// @ts-check
/**
 * Runs only on Expo's build machines, through the EAS build hooks in package.json.
 * - `start`:  records memory use every 15 seconds, in the background.
 * - `report`: when a build fails, prints that record plus any out-of-memory or crash evidence.
 * It never makes a build fail itself.
 */
import { execSync, spawn } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LOG_FILE = '/tmp/kaw-memory.log';
const SAMPLE_EVERY_MS = 15_000;
const REPORT_LAST_SAMPLES = 60;

/** @param {string} path */
function readText(path) {
  try {
    return readFileSync(path, 'utf8').trim();
  } catch {
    return '(not available)';
  }
}

/** @param {string} field */
function meminfoMegabytes(field) {
  const match = new RegExp(`^${field}:\\s+(\\d+) kB`, 'm').exec(readText('/proc/meminfo'));
  return match ? Math.round(Number(match[1]) / 1024) : 0;
}

function biggestProcesses() {
  try {
    return execSync('ps -eo rss=,comm= --sort=-rss | head -n 3', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .map((line) => {
        const parts = line.trim().split(/\s+/);
        return `${parts.slice(1).join(' ')} ${String(Math.round(Number(parts[0]) / 1024))} MB`;
      })
      .join(', ');
  } catch {
    return '(unknown)';
  }
}

function recordSample() {
  const total = meminfoMegabytes('MemTotal');
  const used = total - meminfoMegabytes('MemAvailable');
  const time = new Date().toISOString().slice(11, 19);
  appendFileSync(
    LOG_FILE,
    `${time}  used ${String(used)} of ${String(total)} MB  |  ${biggestProcesses()}\n`,
  );
}

function crashLogs() {
  return ['android', 'android/app']
    .filter((folder) => existsSync(folder))
    .flatMap((folder) =>
      readdirSync(folder)
        .filter((name) => name.startsWith('hs_err_pid'))
        .map((name) => `${folder}/${name}`),
    );
}

function printReport() {
  const samples = readText(LOG_FILE).split('\n');
  console.log('===== Kaw build diagnostics =====');
  console.log('--- Memory over time (last samples) ---');
  console.log(samples.slice(-REPORT_LAST_SAMPLES).join('\n'));
  console.log('--- Out-of-memory kills (oom_kill) ---');
  console.log(readText('/sys/fs/cgroup/memory.events'));
  console.log('--- Highest memory use ---');
  console.log(readText('/sys/fs/cgroup/memory.peak'));
  console.log('--- Gradle settings ---');
  console.log(readText('android/gradle.properties'));
  for (const log of crashLogs()) {
    console.log(`--- Java crash log: ${log} ---`);
    console.log(readText(log).split('\n').slice(0, 40).join('\n'));
  }
}

const mode = process.argv[2];
if (mode === 'start') {
  spawn(process.execPath, [fileURLToPath(import.meta.url), 'watch'], {
    detached: true,
    stdio: 'ignore',
  }).unref();
  console.log(`Kaw build diagnostics: recording memory every 15 s to ${LOG_FILE}`);
} else if (mode === 'watch') {
  recordSample();
  setInterval(recordSample, SAMPLE_EVERY_MS);
} else if (mode === 'report') {
  printReport();
}

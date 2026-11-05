export type HealthStatus = 'ok' | 'error';
export type DatabaseStatus = 'ok' | 'unreachable';

export interface HealthResponse {
  readonly status: HealthStatus;
  readonly database: DatabaseStatus;
}

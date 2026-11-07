# Kaw (کەو)

Kaw is a mobile app that helps Kurdish children who grow up outside Kurdistan learn Kurdish Sorani. I'm starting with families in the Netherlands.

Kaw is a partridge (کەو in Kurdish). He travels through real Kurdish cities, and every stop on his journey is a lesson. There are two age groups:

- **3 to 5:** short lessons a parent and child do together. Listening, playing and speaking.
- **6 to 10:** the child learns alone, from hearing words to reading and writing them.

## Built with

Expo (React Native), TypeScript, Skia, Node.js, Fastify and PostgreSQL.

## Running it

You need Node.js 26, pnpm and Docker Desktop.

pnpm install
pnpm db:up
pnpm --filter @kaw/api dev

Then, in `apps/mobile`, start the app with `pnpm expo start`. Kaw needs a development build (it doesn't run in Expo Go).

## License

The code is MIT licensed, see [LICENSE](LICENSE). The art and content (the Kaw character, pictures, sounds and learning content) are not, see [LICENSE-ASSETS.md](LICENSE-ASSETS.md).

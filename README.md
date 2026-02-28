# svelteDemo

A short demo of a svelte app with auth and all crud operations.

## Tech Stack

- **Framework:** [Svelte 5](https://svelte.dev/)
- **Meta-Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Language:** TypeScript

## Developing

Start docker and boot up the database:

```sh
npm run db:start
```

Check your DB with:

```sh
npm run db:studio
```

Make sure all dependencies are installed with:

```sh
npm install
```

Start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Create a production version of the app:

```sh
npm run build
```

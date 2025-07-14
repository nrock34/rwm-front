# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.



to-do

- add isLikedByUser state to like buttons on posts and maybe articles
- implement commenting on posts
- figure out why class= is being ignored by some lucide react components
- add post type icon next to post type
- review link handling in sveltekit
- change all key props to be indexed for certified uniqueness among like-mapped elements
- implement newsletter logic
- implement state logic to deactivate filter by clicking again
- add school indicator next profiles
- add carousel to news and updates
- implement filters on schoalrship section and study abroad section in community components
- fix grid resizing in news and updates component for community page
- redesign emergency contact card
- (news view all page) add trending sort / change popular calc to be done backend / minimize data request
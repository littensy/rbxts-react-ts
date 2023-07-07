# `@rbxts/react-ts`

This package exports `react` and `roact-compat` for use in TypeScript projects.

To get this package working, it needs the `@rbxts/roact` alias so that the Roblox-TS JSX transformer can use this package instead of the default `roact` package.

## Installation

```bash
npm install @rbxts/react-ts
pnpm add @rbxts/react-ts
yarn add @rbxts/react-ts
```

Make sure to add the following alias to your `package.json`:

```json
dependencies: {
    // ...
    "@rbxts/roact": "npm:@rbxts/react-ts@^0.1.0",
}
```

## Sources

Types are derived from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/v17/index.d.ts).

Dependencies of this package were published from [jsdotlua/react-lua](https://github.com/jsdotlua/react-lua).
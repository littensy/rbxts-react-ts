# [`@rbxts/react-ts`](https://www.npmjs.com/package/@rbxts/react-ts)

To allow React in Roblox-TS, this package combines `jsdotlua/react` and `jsdotlua/roact-compat` and re-exports them with typings from `@rbxts/roact` some types from [the DefinitelyTyped package](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/v17/index.d.ts).

The package also needs to be installed with an alias to trick the compiler into using this package instead of the _actual_ Roact package.

## 📦 Installation

### ⚛️ React for Roblox-TS

For this package to work, it needs the `@rbxts/roact` alias so that Roblox-TS can use this package for your TSX files.

You can install with an alias like so:

```bash
# recommended
npm install @rbxts/roact@npm:@rbxts/react-ts@latest
yarn add @rbxts/roact@npm:@rbxts/react-ts@latest

# may cause issues
pnpm add @rbxts/roact@npm:@rbxts/react-ts@latest
```

Make sure the following alias or something similar is in your `package.json`:

```json
"dependencies": {
    "@rbxts/roact": "npm:@rbxts/react-ts",
}
```

### 📎 ReactRoblox

You can install `@rbxts/react-roblox` to render React components with `createRoot` instead of `Roact.mount`.

```bash
npm install @rbxts/react-roblox
yarn add @rbxts/react-roblox
pnpm add @rbxts/react-roblox
```

## ✅ Compatibility

Installing this package will install React, ReactRoblox, etc. directly under the `@rbxts` folder in located ReplicatedStorage.

If your package depends on React packages, they may be imported in Luau via `require(script.Parent...Parent.MODULE)` or `require(...node_modules["@rbxts"].MODULE)` depending on your project structure.

<details>
    <summary>See explorer view</summary>
    <img src="images/compatibility.png" width="200">
</details>

## 📋 Sources

Types are derived from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/v17/index.d.ts).

Dependencies of this package were published from [littensy/react-lua](https://github.com/littensy/react-lua), which is a fork of [jsdotlua/react-lua](https://github.com/jsdotlua/react-lua).

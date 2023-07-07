/// <reference types="@rbxts/types" />

import Roact from "../";

/**
 * Creates a new reference object that can be used with
 * [Roact.Ref](https://roblox.github.io/roact/api-reference/#roactref).
 */
declare function createRef<T>(): Roact.RefObject<T>;

export = createRef;

/// <reference path="./jsx.d.ts" />
/// <reference types="@rbxts/types" />

import Change from "./types/Change";
import Children from "./types/Children";
import Component from "./types/Component";
import createContext from "./types/createContext";
import createElement from "./types/createElement";
import createFragment from "./types/createFragment";
import createRef from "./types/createRef";
import Event from "./types/Event";
import forwardRef from "./types/forwardRef";
import None from "./types/None";
import oneChild from "./types/oneChild";
import PureComponent from "./types/PureComponent";
import Ref from "./types/Ref";

declare namespace Roact {
	export {
		Component,
		createContext,
		createElement,
		createFragment,
		createRef,
		forwardRef,
		None,
		oneChild,
		Change,
		Children,
		Event,
		Ref,
		PureComponent,
	};
}

// Props
declare namespace Roact {
	export type PropsWithChildren<P = {}> = P & {
		/**
		 * @deprecated use `children` instead
		 */
		[Roact.Children]?: Roact.Children;
		children?: Roact.Children;
	};
}

// Component
declare namespace Roact {
	export type HostComponent = keyof CreatableInstances;
	export type FunctionComponent<P = {}> = (props: Roact.PropsWithChildren<P>) => Roact.Element;
	export type ExoticComponent<P = {}> = FunctionComponent<P>;
	export type AnyComponent = Roact.Component | Roact.FunctionComponent | Roact.HostComponent;
	export interface ComponentConstructor<P = {}, S = {}> {
		new (props: P): Roact.Component<P, S>;
	}
}

// Element
declare namespace Roact {
	export interface Element {
		component: defined;
		props: defined;
		source?: string;
	}
}

// Fragment
declare namespace Roact {
	export type Fragment = Roact.Element;
	export const Fragment: Roact.ComponentConstructor<{}, {}>;
}

// Portal
declare namespace Roact {
	/**
	 * A component that represents a portal to a Roblox Instance. Portals are created using Roact.createElement.
	 *
	 * Any children of a portal are put inside the Roblox Instance specified by the required target prop. That Roblox Instance should not be one created by Roact.
	 *
	 * Portals are useful for creating dialogs managed by deeply-nested UI components, and enable Roact to represent and manage multiple disjoint trees at once.
	 *
	 * See the Portals guide for a small tutorial and more details about portals.
	 */
	export const Portal: Roact.ComponentConstructor<{ target: Instance }>;
	export type Portal = typeof Portal;
}

// Binding
declare namespace Roact {
	export interface Binding<T> {
		/**
		 * Returns the internal value of the binding. This is helpful when updating a binding relative to its current value.
		 */
		getValue(): T;

		/**
		 * Returns a new binding that maps the existing binding's value to something else. For example, `map` can be used to
		 * transform an animation progress value like `0.4` into a property that can be consumed by a Roblox Instance like
		 * `UDim2.new(0.4, 0, 1, 0)`.
		 */
		map<U>(predicate: (value: T) => U): Roact.Binding<U>;
	}

	/**
	 * The first value returned is a `Binding` object, which will typically be passed as a prop to a Roact host
	 * component. The second is a function that can be called with a new value to update the binding.
	 */
	export function createBinding<T>(initialValue: T): LuaTuple<[Roact.Binding<T>, (newValue: T) => void]>;

	/**
	 * Combines multiple bindings into a single binding. The new binding's value will have the same keys as the input
	 * table of bindings.
	 */
	export function joinBindings<T extends { [index: string]: Roact.Binding<U> }, U>(
		bindings: T,
	): Roact.Binding<{ [K in keyof T]: T[K] extends Roact.Binding<infer V> ? V : never }>;
	export function joinBindings<T>(bindings: ReadonlyArray<Roact.Binding<T>>): Roact.Binding<Array<T>>;
	export function joinBindings<T>(
		bindings: ReadonlyMap<string | number, Roact.Binding<T>>,
	): Roact.Binding<Map<string | number, Roact.Binding<T>>>;
}

// Mounting
declare namespace Roact {
	export interface Tree {
		/** @hidden */
		readonly _nominal_Tree: unique symbol;
	}

	/**
	 * Creates a Roblox Instance given a Roact element, and optionally a `parent` to put it in, and a `key` to use as
	 * the instance's `Name`.
	 *
	 * The result is a `RoactTree`, which is an opaque handle that represents a tree of components owned by Roact. You
	 * can pass this to APIs like `Roact.unmount`. It'll also be used for future debugging APIs.
	 */
	export function mount(element: Roact.Element, parent?: Instance, key?: string): Roact.Tree;

	/**
	 * Updates an existing instance handle with a new element, returning a new handle. This can be used to update a UI
	 * created with `Roact.mount` by passing in a new element with new props.
	 *
	 * `update` can be used to change the props of a component instance created with `mount` and is useful for putting
	 * Roact content into non-Roact applications.
	 *
	 * As of Roact 1.0, the returned `RoactTree` object will always be the same value as the one passed in.
	 */
	export function update(tree: Roact.Tree, element: Roact.Element): Roact.Tree;

	/**
	 * Destroys the given `RoactTree` and all of its descendants. Does not operate on a Roblox Instance -- this must be
	 * given a handle that was returned by `Roact.mount`.
	 */
	export function unmount(tree: Roact.Tree): void;
}

// GlobalConfig
declare namespace Roact {
	export interface GlobalConfig {
		/**
		 * Enables type checks for Roact's public interface. This includes some of the following:
		 * - Check that the props and children arguments to Roact.createElement are both tables or nil
		 * - Check that setState is passing self as the first argument (it should be called like `self:setState(...)`)
		 * - Confirm the Roact.mount's first argument is a Roact element
		 * - And much more!
		 */
		typeChecks: boolean;

		/**
		 * Enables type checks for internal functionality of Roact. This is typically only useful when debugging Roact
		 * itself. It will run similar type checks to those mentioned above, but only the private portion of the API.
		 */
		internalTypeChecks: boolean;

		/**
		 * When enabled, Roact will capture a stack trace at the site of each element creation and hold onto it, using
		 * it to provide additional details on certain kinds of errors. If you get an error that says "", try enabling
		 * this config value to help with debugging.
		 *
		 * Enabling elementTracing also allows the use of the getElementTraceback method on Component, which can also be
		 * helpful for debugging.
		 */
		elementTracing: boolean;

		/**
		 * Enables validation of props via the validateProps method on components. With this flag enabled, any
		 * validation written by component authors in a component's validateProps method will be run on every prop
		 * change. This is helpful during development for making sure components are being used correctly.
		 */
		propValidation: boolean;
	}

	/**
	 * The entry point for configuring Roact. Roact currently applies this to everything using this instance of Roact,
	 * so be careful using this with a project that has multiple consumers of Roact.
	 *
	 * Once config values are set, they will apply from then on. This is primarily useful when developing as it can
	 * enable features that validate your code more strictly. Most of the settings here incur a performance cost and
	 * should typically be disabled in production environments.
	 *
	 * Call this method once at the root of your project (before mounting any Roact elements).
	 */
	export function setGlobalConfig(globalConfig: Partial<Roact.GlobalConfig>): void;
}

// Utility Types
declare namespace Roact {
	export type BindingFunction<T> = (newVal: T) => void;
	export type RefPropertyOrFunction<T extends Instance> = Roact.Ref<T>;
	export interface RenderablePropsClass<P> {
		new (props: P): {
			render(): Element | undefined;
		};
	}
}

// JSX
declare namespace Roact {
	type AllowRefs<T> = T extends Instance ? Roact.Ref<T> : never;
	type InferEnumNames<T> = T extends EnumItem ? T["Name"] : never;

	export type JsxInstanceProperties<T extends Instance> = {
		[P in Exclude<WritablePropertyNames<T>, "Parent" | "Name">]?:
			| T[P]
			| AllowRefs<T[P]>
			| InferEnumNames<T[P]>
			| Roact.Binding<T[P]>;
	};

	export type JsxInstanceEvents<T extends Instance> = {
		[K in ExtractKeys<T, RBXScriptSignal>]?: T[K] extends RBXScriptSignal<infer F>
			? (rbx: T, ...args: Parameters<F>) => void
			: never;
	};

	export type JsxInstanceChangeEvents<T extends Instance> = { [key in InstancePropertyNames<T>]?: (rbx: T) => void };

	export type JsxInstance<T extends Instance> = Roact.PropsWithChildren &
		JsxInstanceProperties<T> & {
			Event?: Roact.JsxInstanceEvents<T>;
			Change?: Roact.JsxInstanceChangeEvents<T>;
			/**
			 * @deprecated use `ref` instead
			 */
			Ref?: Roact.RefPropertyOrFunction<T>;
			ref?: Roact.RefPropertyOrFunction<T>;
		};
}

// Deprecated
declare namespace Roact {
	/** @deprecated Use `Roact.Tree` instead. */
	export type ComponentInstanceHandle = Roact.Tree;
	/** @deprecated Use `Roact.Binding<T>` instead. */
	export type RoactBinding<T> = Roact.Binding<T>;
	/** @deprecated Use `Roact.BindingFunction<T>` instead. */
	export type RoactBindingFunc<T> = Roact.BindingFunction<T>;
	/** @deprecated Use `Roact.JsxInstance<T>` instead. */
	export type JsxObject<T extends Instance> = Roact.JsxInstance<T>;
}

// React-like hooks
declare namespace Roact {
	type Context<T> = ReturnType<typeof Roact.createContext<T>>;

	type RefObject<T> = Ref.RefObject<T>;
	type RefCallback<T> = Ref.RefCallback<T>;
	interface MutableRefObject<T> {
		current: T;
	}

	type SetStateAction<S> = S | ((prevState: S) => S);
	type Dispatch<A> = (value: A) => void;
	type DispatchWithoutAction = () => void;

	type Reducer<S, A> = (prevState: S, action: A) => S;
	type ReducerWithoutAction<S> = (prevState: S) => S;
	type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
	type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
	type ReducerStateWithoutAction<R extends ReducerWithoutAction<any>> = R extends ReducerWithoutAction<infer S>
		? S
		: never;

	type DependencyList = ReadonlyArray<any>;
	type EffectCallback = () => void;

	/**
	 * Accepts a context object (the value returned from `React.createContext`) and returns the current
	 * context value, as given by the nearest context provider for the given context.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useContext
	 */
	function useContext<T>(context: Context<T>): T;
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useState
	 */
	function useState<S>(initialState: S | (() => S)): LuaTuple<[S, Dispatch<SetStateAction<S>>]>;
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useState
	 */
	function useState<S = undefined>(): LuaTuple<[S | undefined, Dispatch<SetStateAction<S | undefined>>]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	function useReducer<R extends ReducerWithoutAction<any>, I>(
		reducer: R,
		initializerArg: I,
		initializer: (arg: I) => ReducerStateWithoutAction<R>,
	): LuaTuple<[ReducerStateWithoutAction<R>, DispatchWithoutAction]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	function useReducer<R extends ReducerWithoutAction<any>>(
		reducer: R,
		initializerArg: ReducerStateWithoutAction<R>,
		initializer?: undefined,
	): LuaTuple<[ReducerStateWithoutAction<R>, DispatchWithoutAction]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	function useReducer<R extends Reducer<any, any>, I>(
		reducer: R,
		initializerArg: I & ReducerState<R>,
		initializer: (arg: I & ReducerState<R>) => ReducerState<R>,
	): LuaTuple<[ReducerState<R>, Dispatch<ReducerAction<R>>]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	function useReducer<R extends Reducer<any, any>, I>(
		reducer: R,
		initializerArg: I,
		initializer: (arg: I) => ReducerState<R>,
	): LuaTuple<[ReducerState<R>, Dispatch<ReducerAction<R>>]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	function useReducer<R extends Reducer<any, any>>(
		reducer: R,
		initialState: ReducerState<R>,
		initializer?: undefined,
	): LuaTuple<[ReducerState<R>, Dispatch<ReducerAction<R>>]>;
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useRef
	 */
	function useRef<T>(initialValue: T): MutableRefObject<T>;
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
	 * of the generic argument.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useRef
	 */
	function useRef<T>(initialValue: T | undefined): RefObject<T>;
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useRef
	 */
	function useRef<T = undefined>(): MutableRefObject<T | undefined>;
	/**
	 * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
	 * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
	 * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
	 *
	 * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
	 *
	 * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
	 * `componentDidMount` and `componentDidUpdate`.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useLayoutEffect
	 */
	function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
	/**
	 * Accepts a function that contains imperative, possibly effectful code.
	 *
	 * @param effect Imperative function that can return a cleanup function
	 * @param deps If present, effect will only activate if the values in the list change.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useEffect
	 */
	function useEffect(effect: EffectCallback, deps?: DependencyList): void;
	/**
	 * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
	 * `ref`. As always, imperative code using refs should be avoided in most cases.
	 *
	 * `useImperativeHandle` should be used with `React.forwardRef`.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useImperativeHandle
	 */
	function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;
	/**
	 * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
	 * has changed.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useCallback
	 */
	function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
	/**
	 * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useMemo
	 */
	function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
	/**
	 * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
	 *
	 * NOTE: We don’t recommend adding debug values to every custom hook.
	 * It’s most valuable for custom hooks that are part of shared libraries.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useDebugValue
	 */
	function useDebugValue<T>(value: T, format?: (value: T) => any): void;
	/**
	 * `useBinding` lets you create a binding object that can be used to store a
	 * value and update it without causing a re-render.
	 */
	function useBinding<T>(initialValue: T): LuaTuple<[Binding<T>, (newValue: T) => void]>;
}

// React API
declare namespace Roact {
	type ComponentClass<P> = ComponentConstructor<P>;

	type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

	type ComponentProps<T extends ComponentType<any>> = T extends ComponentType<infer P> ? P : never;

	function memo<P extends object>(
		Component: FunctionComponent<P>,
		propsAreEqual?: (
			prevProps: Readonly<PropsWithChildren<P>>,
			nextProps: Readonly<PropsWithChildren<P>>,
		) => boolean,
	): FunctionComponent<P>;

	function memo<T extends ComponentType<any>>(
		Component: T,
		propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean,
	): ExoticComponent<ComponentProps<T>>;

	type LazyExoticComponent<T extends ComponentType<any>> = ExoticComponent<ComponentProps<T>> & {
		readonly _result: T;
	};

	function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T>;

	const StrictMode: ExoticComponent<PropsWithChildren>;

	interface SuspenseProps extends PropsWithChildren {
		/** A fallback react tree to show when a Suspense child (like React.lazy) suspends */
		fallback?: Roact.Element;
	}

	/**
	 * This feature is not yet available for server-side rendering.
	 * Suspense support will be added in a later release.
	 */
	const Suspense: ExoticComponent<SuspenseProps>;

	export interface SchedulerInteraction {
		__count: number;
		id: number;
		name: string;
		timestamp: number;
	}

	/**
	 * {@link https://react.dev/reference/react/Profiler#onrender-callback Profiler API}}
	 */
	type ProfilerOnRenderCallback = (
		id: string,
		phase: "mount" | "update",
		actualDuration: number,
		baseDuration: number,
		startTime: number,
		commitTime: number,
		interactions: Set<SchedulerInteraction>,
	) => void;

	interface ProfilerProps extends PropsWithChildren {
		id: string;
		onRender: ProfilerOnRenderCallback;
	}

	const Profiler: ExoticComponent<ProfilerProps>;
}

export = Roact;

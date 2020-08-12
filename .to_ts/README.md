# Goal

- Having all existing mechanisms (code, tests, storybooks) working with typescript instead of flow
- On build - generating typescript definitions (`.d.ts`) as a by-product
- Doing the bulk of the job using script so one could rerun it in case of local changes in `flow` code that need to go back to the repo (i.e PR)

# Current State Overview

### flow code files  

- `./` - 2 files
- `./src` - 231 files
- `./cpa-server` - 3 files
- `./cypress` - 9 files
- `./stories` - 23 files
- `./test` - 298 files

### Other files

- `.md` files - 11 files
- configuration files - `.eslintignore`, `package.json yarn.lock`, `.flowconfig`, `circleci/config`, `.storybook/.babelrc`
- `flow-typed` folder (maybe not required because most of the dependencies probably has TS typing, but some `@types/...` packages will need to be installed)

# Getting started

```bash
source ./.to_ts/preinstall.sh
node .to_ts/translate.js
source ./.to_ts/finalize.sh
```

# Roadmap

- [x] trasnlate flow into typescript
- [ ] apply prettier
- [ ] update md files
- [ ] update comments in code
- [ ] yarn add and remove of packages

# Code Changes Required

## Automatic Changes

- [ ] `| null | undefined` should either be ` | null` or `propname?: Type`
- [ ] apply `prettier` on code
- [ ] ADD `src/global.d.ts`

```typescript
// src/global.d.ts content
export {};

declare global {
  type TimeoutID = number;
  type AnimationFrameID = number;
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  }
}
```

## flow-to-ts Bugs

- [ ] `src/debug/middleware/log.ts` - `(mode?: Mode = 'verbose')` --> `(mode: Mode = 'verbose')`
- [ ] `src/state/position.ts` - `otherValue?: number = 0` --> `otherValue: number = 0`

## Manual Type Fixes

- [ ] `rollup.config` - 1. `import typescript from '@rollup/plugin-typescript';`  2. add plugin `typescript()` 
- [ ] `| null | undefined` should either ` | null` or `propname?: Type`
- [ ] `src/dev-warning.ts` - `window[...]` --> `(window as any)[...]`
- [ ] `bindEvents` - `el: HTMLElement` --> `el: HTMLElement | Window`
- [ ] `src/index.ts` - `export` --> `export type` for types
- [ ] `RbdInvariant` should have been class
- [ ] `src/native-with-fallback.ts` - `NodeList<HTMLElement>` --> `NodeList`
- [ ] `src/state/auto-scroller/fluid-scroller/did-start-in-scrollable-area.ts` DELETE
- [ ] `src/invariant.ts` - shoult return the validated object - `export function invariant<T>(condition: T | null | undefined, message?: string) : T{`
- [ ] `src/state/dimension-structures.ts` - reduce init value with `{}` should be `{} as {[id:string]:DroppableDimension }` & `as {[id:string]:DraggableDimension }`
- [ ] `getShouldAnimate` - `id` arg - `id: string`
- [ ] `src/types.ts` - `DropPendingState = DraggingState & ` -->  `DropPendingState = Omit<DraggingState, 'phase'> & `
- [ ] `src/types.ts` - `CollectingState = DraggingState & ` -->  `CollectingState = Omit<DraggingState, 'phase'> & `
- [ ] `src/types.ts` - ^ could avoid Omit
- [ ] `src/view/event-bindings/bind-events.ts` - `bindEvents` should return ()=>any 
- [ ] `src/view/event-bindings/bind-events.ts` - `getOptions` argument `shared` should be EventOptions | undefined
- [ ] `src/view/event-bindings/event-types.ts` - `fn: Function;` --> `fn: ()=>any;`
- [ ] `src/state/middleware/drop/drop-middleware.ts` - ADD `if(state.phase === 'DROP_ANIMATING') return; // dummy escape for typescript`
- [ ] `src/state/reducer.ts` - LOTS OF MANUAL CAHANGES REQUIRED
- [ ] `src/state/store-types.ts` - adapt to TS generics - problem with the Dispatch type in Middleware - something `payload` prop
- [ ] **ALL** replace `Node` --> `ReactNode`

## other

- [ ] **ALL** - replace `useCallback` --> `useCallbackOne` && `useMemo` --> `useMemoOne`. AVOID `from 'react'` (may be separated PR)
- [ ] some `.spec.ts` files should be `.spec.tsx` files
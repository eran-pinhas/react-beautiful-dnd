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

### TODOs

- [x] trasnlate flow into typescript
- [ ] apply prettier
- [ ] update md files
- [ ] update comments in code
- [ ] yarn add and remove of packages

### issue

- [ ] some `.spec.ts` files should be `.spec.tsx` files

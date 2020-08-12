const {
  join
} = require('path');
const {
  readdir,
  unlink,
  writeFile,
  readFile,
  lstat,
  rmdir,
  access
} = require('fs').promises;

function exists(filename) {
  return access().then(() => true, () => false);
}

const flowOoTs = require('@khanacademy/flow-to-ts');

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map(dirent => {
    const res = join(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function deleteFolderRecursive(dirpath) {
  if (await exists(dirpath)) {
    const files = await readdir(dirpath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const curPath = join(dirpath, file);
      if ((await lstat(curPath)).isDirectory()) {
        // recurse
        await deleteFolderRecursive(curPath);
      } else {
        // delete file
        await unlink(curPath);
      }
    }
    await rmdir(dirpath);
  }
}

const requiresExplicitStringKey = ['src/types.js', 'src/view/use-focus-marshal/use-focus-marshal.js', 'stories/src/multi-drag/types.js', 'stories/src/multi-drag/column.jsx', 'src/state/registry/registry-types.js'];

async function transition() {
  console.log('\nTRANSLATING TO TS');
  const all_files = await getFiles('.');
  const files = all_files.filter(fname => fname.endsWith('.js') || fname.endsWith('.jsx')).filter(fname => !fname.startsWith('flow-typed/')).filter(fname => !fname.startsWith('node_modules/')).filter(fname => fname !== '.to_ts/ts_transition.js');

  let skipped = [];
  console.log(`${files.length} files found`);
  for (let i = 0; i < files.length; i++) {
    const src = files[i];

    let srcContent = (await readFile(src)).toString();
    if (srcContent.trim().match(/^\/\/\s@flow/g) || srcContent.trim().match(/\n\/\/\s@flow/g) || // sometimes the @flow appears after a list comment
    srcContent.includes('eslint-disable flowtype')) {
      if (requiresExplicitStringKey.includes(src)) {
        srcContent = srcContent.replace(/\[([a-zA-Z]+): ([a-zA-Z]+)\]/g, substr => `[${substr.match(/\[([a-zA-Z]+): ([a-zA-Z]+)\]/)[1]}: string]`);
      }
      console.log(src);
      const dest = src.replace(/\.js$/, '.ts').replace(/\.jsx$/, '.tsx');
      const destContent = flowOoTs(srcContent, {});
      await writeFile(dest, destContent);
      await unlink(src);
    } else {
      skipped.push(src);
    }
  }
  console.log(`SKIPPED non-flow file:`);
  skipped.slice(0, 100).forEach(s => console.log(s));

  console.log('\nDELETING .flowconfig and flow-typed');
  await deleteFolderRecursive('flow-typed');

  if (await exists('.flowconfig')) await unlink('.flowconfig');

  console.log('\nCREATING tsconfig.json');
  await writeFile('tsconfig.json', `{
    "compilerOptions": {
      "jsx": "react",
      "target": "es5",
      "lib": [
        "dom",
        "dom.iterable",
        "esnext"
      ],
      "allowJs": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true
    },
    "include": [
      "src"
    ]
  }`);
}

transition();
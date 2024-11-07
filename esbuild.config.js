import * as esbuild from 'esbuild';
import 'dotenv/config';
const define = {
  'process.env.PORT': process.env.PORT,
};

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    splitting: true,
    target: 'es2017',
    outdir: 'dist',
    loader: {
      '.ts': 'tsx',
    },
    format: 'esm',
    define,
  })
  .then(() => console.log('Build sucessfully'))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

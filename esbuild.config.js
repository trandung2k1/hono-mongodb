import * as esbuild from 'esbuild';
import 'dotenv/config';
const define = {
  'process.env.PORT': JSON.stringify(process.env.PORT),
  'process.env.ACCESS_TOKEN_SECRET': JSON.stringify(process.env.ACCESS_TOKEN_SECRET),
  'process.env.MONGODB_URI': JSON.stringify(process.env.MONGODB_URI),
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

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const input = 'src/index.ts';

export default [
  // UMD build (for browsers)
  {
    input,
    output: {
      name: 'TikiTime',
      file: 'dist/tiki-time.min.js',
      format: 'umd',
      exports: 'named',
      globals: {
        react: 'React'
      }
    },
    plugins: [
      resolve({ extensions }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'bundled',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript'
        ]
      }),
      terser()
    ]
  },
  // CommonJS and ES Module builds
  {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ extensions }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'bundled',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript'
        ]
      })
    ],
    external: ['react', 'react-dom']
  },
  // TypeScript declarations
  {
    input,
    output: {
      file: pkg.types,
      format: 'es'
    },
    plugins: [dts()],
    external: [/\.css$/]
  }
];
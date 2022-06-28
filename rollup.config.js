import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: ['src/weekly-calendar-card.ts'],
    output: {
        dir: './dist',
        format: 'es',
    },
    plugins: [
        typescript(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
        resolve(),
        commonjs(),
        terser(),
    ],
};

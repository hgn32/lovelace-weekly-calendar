import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

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
        }),
        terser(),
        commonjs(),
    ],
};

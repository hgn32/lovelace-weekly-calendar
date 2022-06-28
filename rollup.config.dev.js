import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';

export default {
    input: ['src/weekly-calendar-card.ts'],
    output: {
        dir: './dist',
        format: 'es',
    },
    plugins: [
        typescript(),
        serve({
            contentBase: './',
            host: '0.0.0.0',
            port: 5000,
            allowCrossOrigin: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }),
    ],
};
 
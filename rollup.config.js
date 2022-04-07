import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

const extensions = [".ts"];

const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ["./dist"],
  host: "0.0.0.0",
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};
export default {
  input: "./src/weekly-calendar-card.ts",
  output: {
    file: "./build/weekly-calendar-card.js",
    format: "cjs",
  },
  plugins: [
    resolve({ extensions }),
    json(),
    babel({ extensions, include: ["src/**/*"], babelHelpers: "bundled" }),
    nodeResolve({}),
    commonjs(),
    typescript(),
    json(),
  ],
};

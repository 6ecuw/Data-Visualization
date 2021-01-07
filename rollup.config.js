import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    file: "public/bundle.js",
    format: "iife",
    sourcemap: !production,
  },
  plugins: [
    css({ output: "bundle.css" }),
    resolve(),
    commonjs(),
    production && terser(),
  ],
};

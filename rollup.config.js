import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    file: "public/bundle.js",
    format: "iife",
    sourcemap: !production,
  },
  plugins: [resolve(), commonjs(), production && terser()],
};

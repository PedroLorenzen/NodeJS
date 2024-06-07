import { ESLint } from "eslint";
import sveltePlugin from "eslint-plugin-svelte3";

export default [
    {
        plugins: {
            svelte: sveltePlugin,
        },
        rules: {
            "prettier/prettier": 0,
            indent: ["error", 2],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
        },
    },
];

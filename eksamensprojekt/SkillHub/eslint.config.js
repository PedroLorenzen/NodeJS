import { ESLint } from "eslint";
import sveltePlugin from "eslint-plugin-svelte3";

export default [
    {
        plugins: {
            svelte: sveltePlugin,
        },
        rules: {
            indent: ["error", 2],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
        },
    },
];

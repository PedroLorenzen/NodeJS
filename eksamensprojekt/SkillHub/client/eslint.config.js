import sveltePlugin from "eslint-plugin-svelte";

export default [
    {
        plugins: {
            svelte: sveltePlugin,
        },
        rules: {
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
        },
    },
];

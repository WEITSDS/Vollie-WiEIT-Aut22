module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: [ "tsconfig.json" ],
        tsconfigRootDir: __dirname,
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
    ],
    rules: {
        // Only allow unused vars if they're prefixed by an _
        "@typescript-eslint/no-unused-vars": [
            "error",
            { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }
        ],

        "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
                "allowNumber": true,
                "allowBoolean": true
            }
        ],
    }
}
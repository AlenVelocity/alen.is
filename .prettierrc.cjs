/** @type {import("prettier").Config} */
module.exports = {
    arrowParens: 'always',
    printWidth: 120,
    singleQuote: true,
    semi: false,
    trailingComma: 'none',
    tabWidth: 4,
    plugins: [require.resolve('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.ts'
}

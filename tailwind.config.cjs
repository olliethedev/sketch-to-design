module.exports = {
    content: ['./ui-src/**/*.{js,jsx,ts,tsx}', './ui-src/ui.html'],
    theme: {
        extend: {},
      },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        darkTheme: "dark",
        themes: ["light", "dark",]
      },
};
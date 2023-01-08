/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        // Main Colors
        'violet': "#655ec7",
        'light-black': '#2c2c37',
        'dark-black': '#22232e',
        // Card Colors
        'blue': '#50c4e2',
        'dark-violet': '#8472f0',
        'light-green': '#6cdbb0',
        'light-gray': '#6b6d7c',
        'err-msg': '#cb4d4d',
      },
      textColor: {
        'white': '#FFFFFF',
        'light-gray': '#6b6d7c',
        'dark-violet': '#8472f0',
        'err-red': '#ff6464',
      },
      borderColor: {
        'violet': '#655ec7',
      },
    },
    plugins: [],
  }
}

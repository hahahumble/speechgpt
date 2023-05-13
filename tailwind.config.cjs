/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        120: "480px",
        125: "500px",
        130: "520px",
        140: "560px",
        150: "600px",
        160: "640px",
        180: "720px",
        200: "800px",
      },
      height: {
        120: "480px",
        125: "500px",
        130: "520px",
        135: "540px",
        140: "560px",
        150: "600px",
        160: "640px",
      },
      maxHeight: {
        140: "560px",
        150: "600px",
        160: "640px",
      },
      maxWidth: {
        160: "640px",
        180: "720px",
        200: "800px",
      }
    },
  },
  plugins: [],
}

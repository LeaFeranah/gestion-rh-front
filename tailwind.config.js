// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {},
  // },
  theme: {
    extend: {
      colors: {
        'bg-akj': '#56656b', 
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      
    },
  },
  plugins: [],
  //plugins: [],
}

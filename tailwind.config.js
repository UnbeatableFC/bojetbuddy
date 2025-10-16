import  fontFamily  from "tailwindcss/defaultTheme";

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        heading: ["var(--font-raleway)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

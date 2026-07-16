import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                matcha: {
                    50: "#F4F7EE",
                    100: "#E7EFDC",
                    200: "#D2E0BC",
                    300: "#B7CD96",
                    400: "#9CB975",
                    500: "#7C9B58", // warna utama brand
                    600: "#638244",
                    700: "#4C6636",
                    800: "#374B29",
                    900: "#1F2B18", // background dark mode
                    950: "#141F0F",
                },
                cream: {
                    50: "#FDFBF6",
                    100: "#FBF7EE",
                    200: "#F4EEDE",
                    300: "#EAE0C8",
                },
                foam: {
                    400: "#E3C88F",
                    500: "#D9B384", // aksen tombol/CTA (warna busa matcha latte)
                    600: "#C89A63",
                },
            },
        },
    },

    plugins: [forms],
};

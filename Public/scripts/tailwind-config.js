// /Public/scripts/tailwind-config.js
// Configuración Tailwind optimizada para Soccer Scan
tailwind.config = {
    theme: {
        extend: {
        screens: {
            'xs': '375px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        colors: {
            'brand': {
            light: 'var(--color-AC)',
            medium: 'var(--color-AM)',
            dark: 'var(--color-AF)',
            red: 'var(--color-R)',
            cream: 'var(--color-B)',
            }
        },
        fontFamily: {
            quicksilver: ['var(--letra-Quicksilver)', 'sans-serif'],
            afacado: ['var(--letra-Afacado)', 'sans-serif'],
            staatliches: ['var(--letra-Staatliches)', 'sans-serif'],
            sunshine: ['var(--letra-sunshine)', 'sans-serif'],
        }
        },
    },
};
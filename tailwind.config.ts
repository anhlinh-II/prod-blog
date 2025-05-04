import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Nếu dùng Pages Router và thư mục src
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Nếu dùng thư mục src
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Nếu dùng App Router và thư mục src
    // Hoặc không có 'src/' nếu bạn không dùng thư mục src
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Bạn có thể mở rộng theme Tailwind ở đây
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
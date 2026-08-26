/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Next.js projesini statik HTML/CSS olarak 'out' klasörüne çıkarır
  images: {
    unoptimized: true, // Statik export'ta Next.js Image Optimization çalışmayacağı için gereklidir
  },
};

module.exports = nextConfig;


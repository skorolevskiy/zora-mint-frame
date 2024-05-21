/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            source: '/opengraph-image.png',
            headers: [
              {
                key: 'Cache-Control',
                value: 's-maxage=1, stale-while-revalidate=59',
              },
            ],
          },
        ];
      },
};

module.exports = nextConfig;

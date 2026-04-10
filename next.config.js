module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/scanner',
        permanent: true,
      },
    ];
  },
};

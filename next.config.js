module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Scanner',
        permanent: true,
      },
    ];
  },
};

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },

  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = 'Muserfly';
        return args;
      });
  },
};

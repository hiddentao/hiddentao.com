module.exports = ({actions}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
        process: require.resolve('process/browser'),
      },
    },
  });
};

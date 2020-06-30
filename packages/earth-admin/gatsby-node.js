exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /@auth0/,
            use: loaders.null()
          },
          {
            test: /@auth0-spa-js/,
            use: loaders.null()
          },
          {
            test: /codemirror/,
            use: loaders.null()
          },
          {
            test: /ckeditor5-react/,
            use: loaders.null()
          },
          {
            test: /ckeditor5-build-classic/,
            use: loaders.null()
          }
        ]
      }
    });
  }
};

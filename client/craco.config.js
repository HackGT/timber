const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#7B69EC",
              "@heading-color": "#212121",
              "@text-color": "#343434",
              "@text-color-secondary": "#212121",
              "@border-radius-base": "2px",
              "@border-color-base": "#e6e6e6",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

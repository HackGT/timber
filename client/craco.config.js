const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#7B69EC',
                          '@font-size-base': '18px',
                          '@heading-color' : '#212121',
                          '@text-color' : '#858585',
                          '@text-color-secondary' : '#212121',
                          '@border-radius-base' : '4px',
                          '@border-color-base' : '#e6e6e6',
                          '@box-shadow-base' : '0 8px 24px 0 rgb(33, 36, 41, 10%)',
                         },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
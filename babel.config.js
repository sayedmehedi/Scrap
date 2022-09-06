module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: 'react-native-dotenv',
        path: '.env',
      },
    ],
    [
      'module-resolver',
      {
        root: './src',
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@screens': './src/screens',
          '@constants': './src/constants',
          '@config': './src/config',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@core': './src/core',
          '@data': './src/data',
          '@hooks': './src/hooks',
          '@components': './src/components',
          '@providers': './src/providers',
          '@navigators': './src/navigators',
          '@layouts': './src/layouts',
          '@store': './src/store',
          '@src': './src',
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    'react-native-reanimated/plugin',
  ],
};

const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const paths = require("@expo/config/paths");
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // If you want to add a new alias to the config.
 
  config.resolve.alias = {
    ...config.resolve.alias,
    '@ant-design/react-native': 'antd-mobile',
  }
  // Maybe you want to turn off compression in dev mode.
  if (config.mode === 'development') {
    config.devServer.compress = false;
  }

  // Or prevent minimizing the bundle when you build.
  if (config.mode === 'production') {
    config.optimization.minimize = false;
  }

  // FIXME: ../../Utilities/Platform not found for react-native-web
  config.module.rules = [
		...config.module.rules,
  ];

  // Finally return the new config for the CLI to use.
  return config;
}

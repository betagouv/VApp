module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-dark-mode'
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {}
  },

  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });
    return config;
  },

  staticDirs: ['./static'],

  docs: {
    autodocs: true
  }
};

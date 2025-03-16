// babel.config.js is a compiler plugin for test file but next js has its own compilet that appear detectConflictingPaths. So need to deactivate this file to run the next js application (but to test, it need to be activate)

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
};

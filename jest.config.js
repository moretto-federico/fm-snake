module.exports = {
  verbose: true,
  globals: {
    NODE_ENV: 'test',
  },
  setupFiles: [
    '<rootDir>/test-shim.js',
    '<rootDir>/test-setup.js'
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/test/**/*test.(ts|tsx|js)'
  ]
};

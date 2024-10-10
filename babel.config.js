// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     'react-native-reanimated/plugin', // Add this line
//   ],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Keep this line for react-native-reanimated
    ['module:react-native-dotenv', {
      "moduleName": "@env",  // You can also alias this if needed
      "path": ".env",        // Path to your .env file
    }]
  ],
};

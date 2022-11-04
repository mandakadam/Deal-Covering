
module.exports = {
  "ignorePatterns": process.env.NODE_ENV === "production" ? ['*/*'] : [],
  "root": false,
  "env": {
    "node": false
  },
  "extends": [
    "plugin:vue/essential"
  ],
  "rules": {},
  "parserOptions": {
    "parser": "@babel/eslint-parser"
  },

  globals: {
    __webpack_public_path__: "writable"
  },
}

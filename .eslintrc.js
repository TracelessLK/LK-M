// strict
module.exports = {
  "env": {
    "es6": true,
    "jest/globals": true,
  },
  "parser": "babel-eslint",
  "plugins": [
    "flowtype",
    "jest"
  ],
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '15.0',
      flowVersion: '0.80.0'
    }
  },
  "extends": [
    "eslint:recommended",
    "standard",
    "airbnb",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "impliedStrict": true
    }
  },
  "rules": {
    'react/prop-types': 0,
    "no-inner-declarations": 0,
    "consistent-return": 2,
    "no-proto": 2,
    "no-undef-init": 2,
    "no-new-func": 2,
    "no-console": 2,
    "no-debugger": 2,
    "no-eval": 2,
    "global-require": 2,
    "no-implied-eval": 2,
    "no-extend-native": 2,
    "no-throw-literal": 2,
    "no-extra-parens": 2,
    "no-iterator": 2,
    "no-shadow": 2,
    "no-labels": 2,
    "sort-vars": 2,
    "object-shorthand": 2,
    "valid-jsdoc": 2,
    "dot-notation": 2,
    "no-loop-func": 2,
    "no-script-url": 2,
    "no-process-exit": 2,
    "accessor-pairs": 2,
    "array-callback-return": 2,
    "curly": ["error", "all"],
    "default-case": 2,
    "for-direction": 2,
    "getter-return": 2,
    "no-await-in-loop": 2,
    "no-caller": 2,
    "no-empty-function": 2,
    "no-extra-bind": 2,
    "no-extra-label": 2,
    "no-floating-decimal": 2,
    "no-template-curly-in-string": 2,
    "eqeqeq": ["error", "always"],
    "no-lone-blocks": 2,
    "no-new": 2,
    "no-new-wrappers": 2,
    "no-return-assign": 2,
    "no-return-await": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-unmodified-loop-condition": 2,
    "no-unused-expressions": 2,
    "no-useless-call": 2,
    "no-useless-return": 2,
    "no-void": 2,
    "no-with": 2,
    "prefer-promise-reject-errors": 2,
    "require-await": 2,
    "no-shadow-restricted-names": 2,
    "no-label-var": 2,
    "no-useless-rename": 2,
    "callback-return": 2,
    "handle-callback-err": 2,
    "no-buffer-constructor": 2,
    "no-new-require": 2,
    "no-path-concat": 2,
    "no-confusing-arrow": 2,
    "no-useless-computed-key": 2,
    "no-duplicate-imports": 2,
    "radix": [2, "as-needed"],
    'no-unused-vars': ["error", {"args": "after-used"}],
    "no-var": 2,
    "semi": [2, "never"],
    "comma-dangle": ["error", "never"],
    "react/jsx-filename-extension": 0,
    "no-plusplus": 0,
    "no-restricted-syntax": 0,
    "no-loop-func": 0,
    "no-underscore-dangle": 0,
    "react/forbid-prop-types": 0,
    "react/require-default-props": 0,
    "max-len": 0,

    //fixme: in ChatView.js `import ImageResizer from 'react-native-image-resizer'`
    "import/no-unresolved": 0

  },
  globals: {
    "__DEV__": true
  },

};

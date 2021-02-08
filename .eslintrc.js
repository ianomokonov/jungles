module.exports = {
  root: true,
  env: {
    es6: true,
  },
  ignorePatterns: ['*.js'],
  overrides: [
    // Добавьте эти настройки, если вы задаёте шаблоны внутри файлов *.component.ts
    {
      files: ['*.component.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      plugins: ['@angular-eslint/template'],
      processor: '@angular-eslint/template/extract-inline-html',
    },
    {
      files: ['*.ts'],
      extends: [
        'plugin:@angular-eslint/recommended',
        // Стайл гайд AirBnB
        'airbnb-typescript/base',
        // Настройки для Prettier
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'lines-between-class-members': 'off',
        '@typescript-eslint/lines-between-class-members': ['off'],
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true,
          },
        ],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            ignoredMethodNames: ['constructor'],
          },
        ],
        'no-console': [
          'error',
          {
            allow: ['warn', 'error'],
          },
        ],
        'jsdoc/require-param': 0,
        'jsdoc/require-returns': 0,
        complexity: ['error', 6],
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        'max-len': ['error', { code: 140 }],
      },
    },
  ],
};

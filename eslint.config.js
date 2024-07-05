// @ts-check

import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  stylistic.configs['all-flat'],
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
  }),
  {
    ignores: ['dist/*'],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);

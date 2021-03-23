module.exports = {
    parser: 'babel-eslint',
    env: {
        es6: true,
        browser: true,
        node: true,
        worker: true,
        webextensions: true
    },
    globals: {
        safari: true
    },
    rules: {
        // Possible errors
        quotes: [2, 'single', { allowTemplateLiterals: true }],

        // Best Practics
        'no-case-declarations': 2,

        // Stylistic Issues
        'template-tag-spacing': 2,

        // ECMAScript 6
        'arrow-body-style': 0,
        'arrow-parens': 0,
        'arrow-spacing': 2,
        'constructor-super': 2,
        'generator-star-spacing': 0,
        'no-class-assign': 2,
        'no-confusing-arrow': 0,
        'no-const-assign': 2,
        'no-dupe-class-members': 2,
        'no-duplicate-imports': 0,
        'no-new-symbol': 0,
        'no-restricted-imports': 0,
        'no-this-before-super': 2,
        'no-useless-computed-key': 0,
        'no-useless-constructor': 0,
        'no-useless-rename': 0,
        'no-var': 2,
        'object-shorthand': 0,
        'prefer-arrow-callback': 0,
        'prefer-const': 2,
        'prefer-destructuring': 0,
        'prefer-numeric-literals': 0,
        'prefer-rest-params': 0,
        'prefer-spread': 0,
        'prefer-template': 0,
        'require-yield': 0,
        'rest-spread-spacing': 0,
        'sort-imports': 0,
        'space-before-function-paren': [2, {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'symbol-description': 0,
        'template-curly-spacing': 0,
        'yield-star-spacing': 0,
        'for-direction': 2,
        'getter-return': [2, { allowImplicit: true }],
        'no-await-in-loop': 0,
        'no-compare-neg-zero': 2,
        'no-cond-assign': 2,
        'no-console': 2,
        'no-constant-condition': 2,
        'no-control-regex': 2,
        'no-debugger': 2,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty-character-class': 2,
        'no-empty': [2, { allowEmptyCatch: true }],
        'no-ex-assign': 2,
        'no-extra-boolean-cast': 2,
        'no-extra-parens': 0,
        'no-extra-semi': 2,
        'no-func-assign': 2,
        'no-inner-declarations': [2, 'functions'],
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-obj-calls': 2,
        'no-prototype-builtins': 0,
        'no-regex-spaces': 2,
        'no-sparse-arrays': 2,
        'no-template-curly-in-string': 0,
        'no-unexpected-multiline': 2,
        'no-unreachable': 2,
        'no-unsafe-finally': 0,
        'no-unsafe-negation': 2,
        'use-isnan': 2,
        'valid-jsdoc': [2, {
            preferType: {
                object: 'Object',
                function: 'Function',
                array: 'Array',
                Number: 'number',
                String: 'string',
                Boolean: 'boolean',
                Null: 'null',
                Symbol: 'symbol',
                Undefined: 'undefined'
            },
            matchDescription: '.+',
            requireReturn: false,
            requireParamDescription: false,
            requireReturnDescription: false
        }],
        'valid-typeof': 2,

        // Best practices
        'accessor-pairs': 0,
        'array-callback-return': 0,
        'block-scoped-var': 2,
        'class-methods-use-this': 0,
        complexity: 0,
        'consistent-return': 2,
        curly: 2,
        'default-case': 0,
        'dot-location': [2, 'property'],
        'dot-notation': 2,
        eqeqeq: 2,
        'guard-for-in': 2,
        'no-alert': 0,
        'no-caller': 2,
        'no-case-declarations': 0,
        'no-div-regex': 2,
        'no-else-return': 2,
        'no-empty-function': 0,
        'no-empty-pattern': 2,
        'no-eq-null': 2,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 2,
        'no-extra-label': 0,
        'no-fallthrough': 2,
        'no-floating-decimal': 2,
        'no-global-assign': 2,
        'no-implicit-coercion': 2,
        'no-implicit-globals': 0,
        'no-implied-eval': 2,
        'no-invalid-this': 0,
        'no-iterator': 2,
        'no-labels': 2,
        'no-lone-blocks': 2,
        'no-loop-func': 2,
        'no-magic-numbers': 0,
        'no-multi-spaces': 2,
        'no-multi-str': 2,
        'no-new-func': 2,
        'no-new-wrappers': 2,
        'no-new': 0,
        'no-octal': 2,
        'no-octal-escape': 2,
        'no-param-reassign': 0,
        'no-proto': 2,
        'no-redeclare': 2,
        'no-restricted-properties': 0,
        'no-return-assign': 0,
        'no-return-await': 0,
        'no-script-url': 2,
        'no-self-assign': 0,
        'no-self-compare': 2,
        'no-sequences': 2,
        'no-throw-literal': 2,
        'no-unmodified-loop-condition': 0,
        'no-unused-expressions': 2,
        'no-unused-labels': 0,
        'no-useless-call': 2,
        'no-useless-concat': 2,
        'no-useless-escape': 0,
        'no-useless-return': 0,
        'no-void': 2,
        'no-warning-comments': 0,
        'no-with': 2,
        'prefer-promise-reject-errors': 0,
        radix: 2,
        'require-await': 0,
        'vars-on-top': 0,
        'wrap-iife': [2, 'any'],
        yoda: 2,

        // Strict Mode
        strict: 0,

        // Variables
        'init-declarations': 0,
        'no-catch-shadow': 2,
        'no-delete-var': 2,
        'no-label-var': 0,
        'no-restricted-globals': 0,
        'no-shadow-restricted-names': 2,
        'no-shadow': 0,
        'no-undef-init': 2,
        'no-undef': [2, { typeof: true }],
        'no-undefined': 0,
        'no-unused-vars': [2, { vars: 'all', args: 'after-used', varsIgnorePattern: '^React$' }],
        'no-use-before-define': [2, 'nofunc'],

        // Node.js and CommonJS
        'callback-return': 0,
        'global-require': 0,
        'handle-callback-err': 0,
        'no-buffer-constructor': 2,
        'no-mixed-requires': 0,
        'no-new-require': 0,
        'no-path-concat': 0,
        'no-process-env': 0,
        'no-process-exit': 0,
        'no-restricted-modules': 0,
        'no-sync': 0,

        // Stylistic Issues
        // TODO array-bracket-newline and array-element-newline are not very useful
        'array-bracket-newline': [0, { multiline: true, minItems: 3 }],
        'array-bracket-spacing': 2,
        'array-element-newline': [0, { multiline: true }],
        'block-spacing': 0,
        'brace-style': 2,
        camelcase: 2,
        'capitalized-comments': 0,
        'comma-dangle': 2,
        'comma-spacing': 2,
        'comma-style': 2,
        'computed-property-spacing': 0,
        'consistent-this': 0,
        'eol-last': 2,
        'func-call-spacing': 0,
        'func-name-matching': 2,
        'func-names': 0,
        'func-style': 0,
        'id-blacklist': 0,
        'id-length': 0,
        'id-match': 0,
        indent: [2, 4, { SwitchCase: 1 }],
        'jsx-quotes': 0,
        'key-spacing': 2,
        'keyword-spacing': 2,
        'line-comment-position': 0,
        'linebreak-style': [2, 'unix'],
        'lines-around-comment': 0,
        'max-depth': 0,
        'max-len': 0,
        'max-lines': 0,
        'max-nested-callbacks': 0,
        'max-params': 0,
        'max-statements-per-line': 0,
        'max-statements': 0,
        'multiline-ternary': 0,
        'new-cap': [2, { capIsNew: false }],
        'new-parens': 0,
        'newline-per-chained-call': 0,
        'no-array-constructor': 0,
        'no-bitwise': 0,
        'no-continue': 0,
        'no-inline-comments': 0,
        'no-lonely-if': 0,
        'no-mixed-operators': 0,
        'no-mixed-spaces-and-tabs': 2,
        'no-multi-assign': 0,
        'no-multiple-empty-lines': [2, { max: 1 }],
        'no-negated-condition': 0,
        'no-nested-ternary': 0,
        'no-new-object': 0,
        'no-plusplus': 0,
        'no-restricted-syntax': 0,
        'no-tabs': 0,
        'no-ternary': 0,
        'no-trailing-spaces': 2,
        'no-underscore-dangle': 2,
        'no-unneeded-ternary': 0,
        'no-whitespace-before-property': 0,
        'nonblock-statement-body-position': 0,
        'object-curly-newline': 0,
        'object-curly-spacing': [2, 'always'],
        'object-property-newline': 0,
        'one-var-declaration-per-line': [2, 'always'],
        'one-var': [2, 'never'],
        'operator-assignment': 0,
        'operator-linebreak': [2, 'after', { overrides: { '&&': 'ignore', '||': 'ignore' } }],
        'padded-blocks': [2, 'never'],
        'padding-line-between-statements': [
            1,
            { blankLine: 'always', prev: 'directive', next: '*' },
            { blankLine: 'any', prev: 'directive', next: 'directive' },

            { blankLine: 'always', prev: '*', next: ['switch', 'try'] },

            { blankLine: 'always', prev: ['import', 'cjs-import'], next: '*' },
            { blankLine: 'never', prev: ['import', 'cjs-import'], next: ['import', 'cjs-import'] },

            { blankLine: 'always', prev: ['block', 'block-like', 'multiline-block-like', 'for', 'if'], next: 'return' }
        ],
        'quote-props': [2, 'as-needed'],
        quotes: [2, 'single'],
        'semi-spacing': 2,
        'semi-style': [2, 'last'],
        semi: 2,
        'sort-keys': 0,
        'sort-vars': 0,
        'space-before-blocks': 2,
        'space-before-function-paren': [2, 'never'],
        'space-in-parens': 2,
        'space-infix-ops': 2,
        'space-unary-ops': [2, { words: true, nonwords: false }],
        'spaced-comment': 2,
        'switch-colon-spacing': 2,
        'template-tag-spacing': 0,
        'unicode-bom': 0,
        'wrap-regex': 0
    },
    parserOptions: {
        ecmaFeatures: {
            arrowFunctions: true,
            binaryLiterals: true,
            blockBindings: true,
            classes: true,
            defaultParams: true,
            destructuring: true,
            forOf: true,
            generators: true,
            modules: true,
            objectLiteralComputedProperties: true,
            objectLiteralDuplicateProperties: true,
            objectLiteralShorthandMethods: true,
            objectLiteralShorthandProperties: true,
            octalLiterals: true,
            regexUFlag: true,
            regexYFlag: true,
            restParams: true,
            spread: true,
            superInFunctions: true,
            templateStrings: true,
            unicodeCodePointEscapes: true,
            globalReturn: true,
            experimentalObjectRestSpread: true
        }
    }
};

## Interface & Views

- Reworked the report page to include a query graph and an enhanced query editor.
- Added a "Copy report as page hash" button.
- Implemented [`tooltip`](#views-showcase&!anchor=tooltip) as an option for all views.
- Introduced new options and improvements for the `struct`, `markdown`, and `source` views.
- Changed the default rendering of arrays in a table cell to display the number of elements instead of `[…]`.

See details in [Discovery.js release notes](https://github.com/discoveryjs/discovery/releases).

## Jora Query Language

- **New Methods**:
   - **String and array processing**: Added `indexOf()`, `lastIndexOf()`, `replace()`, `toLowerCase()`, `toUpperCase()`, and `trim()` methods.
   - **Statistics**: Introduced `min()`, `max()`, `numbers()`, `sum()`, `avg()`, `count()`, `variance()`, `stdev()`, `percentile()` (with alias `p()`), and `median()`.
   - **Math**: Added a suite of math methods such as `abs()`, `acos()`, and many others, aligning closely with JavaScript's `Math` object functions.
- **New Operators and Syntax Enhancements**:
   - Introduced the nullish coalescing operator (`??`).
   - Added [assertions](https://discoveryjs.github.io/jora/#article:jora-syntax-assertions) to enhance conditional checks with the `is` operator, e.g., `is number` or `is not (number or string)`.
   - Provided basic support for function arguments in the syntax, enabling `$arg => expr` and `($a, $b) => expr` forms.
   - Updated queries to start with a pipeline operator, e.g., `| expr`.
   - Modified the ternary operator to allow optional components, enabling syntaxes like `expr ? : []`, `expr ? 1`, and `expr?`, with a default structure of `expr ? $ : undefined` when parts are omitted.

For more details, see the [Jora release notes](https://github.com/discoveryjs/jora/releases) for versions between 1.0.0-beta.7 & 1.0.0-beta.10.

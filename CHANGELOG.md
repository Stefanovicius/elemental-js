# elemental-js

## 0.10.0

### Minor Changes

- 925aae0: - Refactored element creation and parsing:
  - Introduced new text template literal for handling reactive text content
  - Split element.js into focused modules (props.js, children.js, text.js)
  - Changed element creation API to use function calls instead of template literals
  - Simplified parser implementation for better maintainability
  - Updated all dependencies to latest versions
- 688013b: feat(parser): enhanced parser with single interpolated value support, refactored for conciseness and better readability.
- e6e17b1: feat: refactored reactivity, implemented batching, and automatic cleanup
- 8629ee5: refactor: split reactive module, reverted to .val accessor
- 6eb9d71: feat: integrated `sel` into `el` switched definition to `l`
- 7c9fbf7: feat: switched to Proxy based reactivity

### Patch Changes

- 8295e21: chore: updated README.md, usage, and externalized parser
- e5dbf2b: Restructured project: migrated from monorepo to single-package setup
- 44e62e2: chore: updated README.md
- 2298923: fix: updated dependencies, and package scripts, minor changes
- ce7fdeb: refactor: optimized DOM manipulation and reduce redundancy
- cd98000: refactor: changed Reactive value accessors to val to accommodate intended usage.

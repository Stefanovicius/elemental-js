---
'elemental-js': minor
---

- Refactored element creation and parsing:
  - Introduced new text template literal for handling reactive text content
  - Split element.js into focused modules (props.js, children.js, text.js)
  - Changed element creation API to use function calls instead of template literals
  - Simplified parser implementation for better maintainability
- Updated all dependencies to latest versions

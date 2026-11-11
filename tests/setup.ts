/**
 * Shared Vitest setup.
 *
 * This file is loaded for *every* suite, and the default project environment is
 * `node`, so it must never touch `window`, `document` or any other browser
 * global. Component suites opt into jsdom with a `// @vitest-environment jsdom`
 * first line and register their own `cleanup()` after each test (Testing
 * Library's automatic cleanup relies on globals, which this project does not
 * enable).
 */
export {};

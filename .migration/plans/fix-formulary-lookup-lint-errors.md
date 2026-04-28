# Fix Lint Errors in formulary-lookup Import Parser

## Problem

`tools/importer/parsers/formulary-lookup.js` has 11 ESLint errors:

1. **`no-restricted-syntax`** (9 errors): `for...of` loops are banned by the project's ESLint config. Must replace with `.some()`, `.find()`, `.forEach()`, or other array methods.
2. **`no-unused-vars`** (2 errors): `text()` (line 49) and `html()` (line 54) helper functions are defined but never called.

The 3 warnings are in other files (`eds-form`, `stock-ticker`) and are pre-existing — not caused by our changes.

## Lines to Fix

| Line | Error | Current Code | Fix |
|---|---|---|---|
| 32 | `no-restricted-syntax` | `for (const sel of CONTAINER_SELECTORS)` | Use `.some()` |
| 35 | `no-restricted-syntax` | `for (const sel of FORMULARY_INNER)` | Use `.some()` |
| 49-52 | `no-unused-vars` | `function text(el, selector)` | Remove function |
| 54-57 | `no-unused-vars` | `function html(el, selector)` | Remove function |
| 100 | `no-restricted-syntax` | `for (const sel of selectors)` in `extractHeading` | Use `.reduce()` or `.find()` pattern |
| 153 | `no-restricted-syntax` | `for (const sel of selectors)` in `extractSubmitLabel` | Use `.reduce()` or `.find()` pattern |
| 217 | `no-restricted-syntax` | `for (const label of labels)` in `extractStateLabel` | Use `.find()` |
| 285 | `no-restricted-syntax` | `for (const node of nodes)` in `extractRecaptchaNotice` | Use `.find()` |
| 310 | `no-restricted-syntax` | `for (const node of nodes)` in `extractDisclaimer` | Use nested `.find()` |
| 312 | `no-restricted-syntax` | `for (const pattern of patterns)` | Fold into `.find()` with `.some()` |
| 336 | `no-restricted-syntax` | `for (const s of scripts)` in `extractRecaptchaKey` | Use `.find()` |

## Checklist

- [ ] **1.1** Replace `for...of` in `detect()` (lines 32, 35) with `.some()` returning boolean
- [ ] **1.2** Remove unused `text()` function (lines 49-52)
- [ ] **1.3** Remove unused `html()` function (lines 54-57)
- [ ] **1.4** Replace `for...of` in `extractHeading()` (line 100) with array `.find()` pattern
- [ ] **1.5** Replace `for...of` in `extractSubmitLabel()` (line 153) with array `.find()` pattern
- [ ] **1.6** Replace `for...of` in `extractStateLabel()` (line 217) with `.find()`
- [ ] **1.7** Replace `for...of` in `extractRecaptchaNotice()` (line 285) with `.find()`
- [ ] **1.8** Replace nested `for...of` in `extractDisclaimer()` (lines 310, 312) with `.find()` + `.some()`
- [ ] **1.9** Replace `for...of` in `extractRecaptchaKey()` (line 336) with `.find()`
- [ ] **1.10** Run `npx eslint tools/importer/parsers/formulary-lookup.js` to verify zero errors

---

## Notes
- Only `tools/importer/parsers/formulary-lookup.js` needs changes. No other files.
- Business logic must remain identical — same selectors, same extraction order, same return values.
- **Execution requires switching to Execute mode.**

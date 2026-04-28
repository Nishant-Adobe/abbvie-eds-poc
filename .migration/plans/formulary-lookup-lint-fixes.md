The line numbers match the **old file** — meaning the pull didn't update the file on your machine. The fixed version was committed to GitHub via the web editor, but your local branch may have diverged.

Run these commands:

```bash
cd C:\AbbVie\abbvie-eds-poc
git stash
git fetch origin
git reset --hard origin/formulary-lookup
npm run lint
```

This forces your local branch to match exactly what's on GitHub (which has the fixed file). Then lint should pass.

If you still see the same errors after this, it means the GitHub web edit didn't save. In that case, check `https://github.com/Nishant-Adobe/abbvie-eds-poc/blob/formulary-lookup/tools/importer/parsers/formulary-lookup.js` — line 32 should show `function matchesAny(element, selectors)` not `for (const sel of`.

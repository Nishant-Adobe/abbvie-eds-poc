# CTA Block — UE "Something went wrong" Error

## Root Cause

The "Something went wrong" error in the Universal Editor properties panel is likely caused by the `condition` property used in the component model. The UE may not support:
- `"condition": { "iconType": ["icon-font", "image"] }` — array syntax for condition matching
- Or `condition` at all in the version of UE being used

The `component-models.json` has been updated with conditional fields but the UE is failing to parse them.

## Potential Fixes

1. **Remove `condition` properties** — Show all icon fields always (simplest, guaranteed to work)
2. **Use single-value conditions only** — Replace array condition with separate duplicate fields
3. **Check UE version support** — The `condition` feature may require a specific UE version

## Checklist

- [ ] Determine if UE supports `condition` property on fields
- [ ] If not supported: remove all `condition` properties and show fields unconditionally
- [ ] If array syntax unsupported: duplicate `iconPosition` field for each iconType value
- [ ] Verify `component-models.json` is valid JSON (no syntax errors)
- [ ] Test in UE after fix
- [ ] Commit and push

---

*Requires Execute mode to make changes. The safest immediate fix is removing all `condition` properties to unblock the UE.*

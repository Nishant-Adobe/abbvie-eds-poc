# GitHub Pages Deployment Rules

## 🎯 Deployment Conditions

GitHub Pages deployment will **ONLY** occur when **BOTH** of these conditions are met:

1. ✅ **Push to dev-docs branch** (`refs/heads/dev-docs`)
2. ✅ **Markdown files in `docs/` directory are changed**

## 📋 Specific File Patterns

The workflows monitor these specific file patterns for documentation changes:

### ✅ Files That Trigger Documentation Deployment
```
docs/**/*.md          # Any .md file in docs/ directory or subdirectories
docs/**/*.mdx         # Any .mdx file in docs/ directory or subdirectories
docs/docusaurus.config.ts  # Docusaurus configuration
docs/sidebars.ts      # Sidebar configuration
```

### ❌ Files That Do NOT Trigger Documentation Deployment
```
*.md                  # Markdown files outside docs/ directory
docs/static/**        # Static assets (images, etc.)
docs/src/**           # Source files (CSS, components)
docs/package.json     # Package configuration
docs/node_modules/**  # Dependencies
blocks/**             # Application components
styles/**             # Application styles
scripts/**            # Application scripts
```

## 🔄 Workflow Behavior

### **Scenario 1: Only Documentation Changes**
```bash
# Changes to documentation files only
docs/docs/intro.md
docs/docs/theme-management.md

# Result: ✅ Documentation deployment to GitHub Pages
```

### **Scenario 2: Only Application Changes**
```bash
# Changes to application files only
blocks/new-component/new-component.css
styles/main.css
package.json

# Result: ❌ NO documentation deployment
```

### **Scenario 3: Mixed Changes**
```bash
# Changes to both application and documentation
blocks/new-component/new-component.css
docs/docs/blocks-components.md

# Result: ✅ Documentation deployment to GitHub Pages
```

### **Scenario 4: No Documentation Changes**
```bash
# Changes to non-monitored files
README.md
.gitignore
.github/workflows/other-workflow.yml

# Result: ❌ NO documentation deployment
```

## 📊 Workflow Triggers

### **deploy-docs.yml**
- **Trigger**: Push to `dev-docs` branch
- **Condition**: Files matching `docs/**/*.md`, `docs/**/*.mdx`, `docs/docusaurus.config.ts`, `docs/sidebars.ts`
- **Action**: Deploy to GitHub Pages

### **test-docs.yml**
- **Trigger**: Pull request to `dev-docs`
- **Condition**: Files matching documentation patterns
- **Action**: Test documentation build and validate documentation links only
- **Validation Scope**: 
  - ✅ Type checking
  - ✅ Build verification
  - ✅ Internal documentation link validation (port 3030)
  - ❌ No application link validation (excludes port 3000)

## 🔍 Change Detection Logic

The workflows use `dorny/paths-filter@v2` to detect changes:

```yaml
filters: |
  docs:
    - 'docs/**/*.md'           # Markdown files in docs/
    - 'docs/**/*.mdx'          # MDX files in docs/
    - 'docs/docusaurus.config.ts'  # Docusaurus config
    - 'docs/sidebars.ts'       # Sidebar config
```

## 📝 Examples

### **Example 1: Documentation Update**
```bash
# File changed: docs/docs/intro.md
git add docs/docs/intro.md
git commit -m "Update introduction documentation"
git push origin dev-docs

# Result: ✅ GitHub Pages deployment triggered
```

### **Example 2: Application Update**
```bash
# File changed: blocks/hero/hero.css
git add blocks/hero/hero.css
git commit -m "Update hero component styles"
git push origin dev-docs

# Result: ❌ NO documentation deployment
```

### **Example 3: Mixed Changes**
```bash
# Files changed: 
# - docs/docs/blocks-components.md
# - blocks/cards/cards.css
git add docs/docs/blocks-components.md blocks/cards/cards.css
git commit -m "Update cards component and documentation"
git push origin dev-docs

# Result: ✅ GitHub Pages deployment triggered
```

### **Example 4: Non-Documentation Changes**
```bash
# File changed: README.md (outside docs/)
git add README.md
git commit -m "Update project README"
git push origin dev-docs

# Result: ❌ NO documentation deployment
```

## 🚀 Deployment URLs

When documentation deployment is triggered:

- **Live URL**: `https://your-username.github.io/eds-multi-brand/`
- **Deployment URL**: Provided in workflow logs
- **Status**: Available in GitHub Actions summary

## 📊 Monitoring

### **Workflow Logs**
- View in GitHub repository → Actions tab
- Shows which files triggered the deployment
- Displays deployment status and URLs

### **Deployment Summary**
Each deployment includes:
- ✅ Build status
- 📚 Live URL
- 🔗 Deployment URL
- 📝 List of changed documentation files

### **Test Results Summary**
Documentation tests include:
- ✅ Build Status
- ✅ Type Check Results
- ✅ Documentation Link Validation (internal only)

## 🔧 Customization

### **Adding New File Patterns**
To monitor additional file types, update the filters in workflow files:

```yaml
filters: |
  docs:
    - 'docs/**/*.md'
    - 'docs/**/*.mdx'
    - 'docs/**/*.yaml'    # Add YAML files
    - 'docs/**/*.json'    # Add JSON files
```

### **Excluding File Patterns**
To exclude certain files from triggering deployment:

```yaml
# In the workflow, add conditions to skip deployment
if: |
  github.ref == 'refs/heads/dev-docs' &&
  needs.detect-docs-changes.outputs.docs-changed == 'true' &&
  !contains(github.event.head_commit.message, '[skip-docs]')
```

## 🆘 Troubleshooting

### **Deployment Not Triggered**
1. Check if changes are in `docs/` directory
2. Verify file extensions are `.md` or `.mdx`
3. Ensure push is to `dev-docs` branch
4. Check workflow logs for path filter results

### **Unexpected Deployment**
1. Review changed files in PR
2. Check path filter configuration
3. Verify workflow trigger conditions
4. Review workflow logs for details

### **Documentation Test Failures**
1. Check for broken internal documentation links
2. Verify documentation builds successfully
3. Review type check errors
4. Ensure documentation server starts correctly (port 3030)

## 📚 Related Documentation

- [GitHub Actions Workflows](./README.md)
- [Docusaurus Configuration](../docs/docusaurus.config.ts)
- [Documentation Structure](../docs/README.md) 
# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the AEM Multi-Brand project, providing automated CI/CD for documentation deployment to GitHub Pages.

## Workflows Overview

### 1. `ci-cd.yml` - Documentation CI/CD Pipeline
**Triggers**: Push/PR to `main` or `develop` branches

**Features**:
- **Smart Change Detection**: Only runs when documentation files change
- **Documentation Testing**: Lints, type-checks, and builds documentation
- **GitHub Pages Deployment**: Automatically deploys documentation when merged to main
- **PR Comments**: Provides detailed feedback on pull requests

**Jobs**:
- `detect-docs-changes` - Determines if documentation files were changed
- `test-docs` - Tests documentation (if docs files changed)
- `deploy-docs-production` - Deploys documentation to GitHub Pages
- `summary` - Provides summary of all actions

### 2. `deploy-docs.yml` - Documentation Deployment
**Triggers**: Push to `main` with changes in `docs/` directory

**Features**:
- **Path-based Triggering**: Only runs when documentation files change
- **Build Testing**: Ensures documentation builds successfully
- **GitHub Pages Deployment**: Deploys to GitHub Pages automatically
- **Deployment Summary**: Shows what files were changed

### 3. `test-docs.yml` - Documentation Testing
**Triggers**: PR to `main` or `develop` with documentation changes

**Features**:
- **Pre-deployment Testing**: Tests documentation before deployment
- **Link Checking**: Verifies internal and external links
- **Build Validation**: Ensures documentation builds without errors
- **PR Feedback**: Provides test results in PR comments

## Change Detection

The workflows use `dorny/paths-filter@v2` to detect documentation changes:

### Documentation Changes
- Files in `docs/` directory with `.md` or `.mdx` extensions
- `docs/docusaurus.config.ts` - Docusaurus configuration
- `docs/sidebars.ts` - Sidebar configuration

### Files Monitored
```
docs/**/*.md          # Markdown files in docs/ directory
docs/**/*.mdx         # MDX files in docs/ directory
docs/docusaurus.config.ts  # Docusaurus configuration
docs/sidebars.ts      # Sidebar configuration
```

## Deployment Strategy

### Staging (develop branch)
- Triggers on push to `develop`
- Tests documentation build
- Used for validation before production

### Production (main branch)
- Triggers on merge to `main`
- Deploys documentation to GitHub Pages
- Only when documentation files are changed

## GitHub Pages Configuration

### Automatic Deployment
- Documentation is automatically deployed when changes are merged to `main`
- Uses GitHub Pages with Actions
- URL: `https://your-username.github.io/eds-multi-brand/`

### Manual Deployment
```bash
# From project root
npm run docs:deploy

# Or from docs directory
cd docs && npm run deploy
```

## Environment Setup

### Required Secrets
No additional secrets needed for GitHub Pages deployment - it's automatically configured.

### Environment Protection
- `github-pages` environment for documentation deployment

## Workflow Customization

### Adding New File Patterns
To monitor additional documentation file types:

```yaml
filters: |
  docs:
    - 'docs/**/*.md'
    - 'docs/**/*.mdx'
    - 'docs/**/*.yaml'    # Add YAML files
    - 'docs/**/*.json'    # Add JSON files
```

### Modifying Triggers
Edit the `on` section in workflow files:

```yaml
on:
  push:
    branches: [ main, develop ]
    paths:
      - 'docs/**/*.md'
      - 'docs/**/*.mdx'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'docs/**/*.md'
      - 'docs/**/*.mdx'
```

## Monitoring and Debugging

### Workflow Logs
- View logs in the "Actions" tab of your repository
- Each job shows detailed step-by-step logs
- Failed jobs show error details and stack traces

### Common Issues

**Build Failures**:
- Check for syntax errors in Markdown files
- Verify all dependencies are installed
- Review build logs for specific errors

**Deployment Failures**:
- Check GitHub Pages settings in repository
- Verify workflow permissions
- Review deployment logs

**Path Filter Issues**:
- Ensure file paths match the filter patterns
- Check for typos in path specifications
- Verify file extensions are correct

## Best Practices

### Workflow Design
1. **Use conditional jobs** to avoid unnecessary work
2. **Cache dependencies** to speed up builds
3. **Implement proper error handling**
4. **Provide clear feedback** in PR comments

### Documentation
1. **Write clear, concise content** with examples
2. **Include code samples** where appropriate
3. **Test documentation locally** before pushing
4. **Keep documentation up to date**

### Performance
1. **Optimize images** before adding them
2. **Use lazy loading** for heavy content
3. **Minimize JavaScript** bundle sizes
4. **Enable compression** for static assets

## Support

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Docusaurus Deployment**: https://docusaurus.io/docs/deployment
- **Project Issues**: https://github.com/adobe/eds-multi-brand/issues 
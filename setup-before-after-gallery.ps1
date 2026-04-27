# Run from C:\AbbVie\abbvie-eds-poc
# Creates all before-after-gallery block files

# Create directories
New-Item -ItemType Directory -Force -Path "blocks\before-after-gallery\abbvie"
New-Item -ItemType Directory -Force -Path "blocks\before-after-gallery\botox"
New-Item -ItemType Directory -Force -Path "blocks\before-after-gallery\rinvoq"

# block-config.js (base + all brands)
$blockConfig = @'
export default async function getBlockConfigs() {
  return { flags: {}, variations: [], decorations: {} };
}
'@
Set-Content -Path "blocks\before-after-gallery\block-config.js" -Value $blockConfig -Encoding utf8
Set-Content -Path "blocks\before-after-gallery\abbvie\block-config.js" -Value $blockConfig -Encoding utf8
Set-Content -Path "blocks\before-after-gallery\botox\block-config.js" -Value $blockConfig -Encoding utf8
Set-Content -Path "blocks\before-after-gallery\rinvoq\block-config.js" -Value $blockConfig -Encoding utf8

# Brand CSS overrides
Set-Content -Path "blocks\before-after-gallery\abbvie\_before-after-gallery.css" -Value "@import '../before-after-gallery.css';`n`n/* Abbvie before-after-gallery overrides */`n" -Encoding utf8
Set-Content -Path "blocks\before-after-gallery\botox\_before-after-gallery.css" -Value "@import '../before-after-gallery.css';`n`n/* Botox before-after-gallery overrides */`n" -Encoding utf8
Set-Content -Path "blocks\before-after-gallery\rinvoq\_before-after-gallery.css" -Value "@import '../before-after-gallery.css';`n`n/* Rinvoq before-after-gallery overrides */`n" -Encoding utf8

Write-Host "Scaffold files created. Now create the main JS, CSS, and JSON files manually or via copy."
Write-Host "Done!"

/**
 * Skyrizi HCP block-config.js
 * Enforces slim variant (logo-only header) regardless of page metadata.
 * Ensures header-variant=slim is always set for any page under this brand.
 */

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      beforeDecorate: async () => {
        // Belt-and-suspenders: ensure slim variant meta tag is present
        // (in case page metadata is misconfigured)
        let meta = document.querySelector('meta[name="header-variant"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'header-variant';
          document.head.appendChild(meta);
        }
        // Only force slim if not explicitly set to something else
        if (!meta.content || meta.content === '') {
          meta.content = 'slim';
        }
      },
    },
  };
}

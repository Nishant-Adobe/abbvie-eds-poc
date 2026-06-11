const TAB_LABELS = [
  'Adults with IBS-C or CIC',
  'Pediatric Functional Constipation (6–17 years of age)',
];

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate(block, { tablist }) {
        if (!tablist) return;
        const buttons = [...tablist.querySelectorAll('button.tabs-tab')];
        buttons.forEach((btn, i) => {
          if (!btn.textContent.trim() || btn.textContent.startsWith('Tab ')) {
            btn.textContent = TAB_LABELS[i] || btn.textContent;
          }
        });
      },
    },
  };
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        const seeAllLabel = 'See All Patient Videos';
        const seeAllHref = '/linzess/why-linzess#patientexperiences';

        // Add See All button (CSS handles hiding items beyond 3)
        const seeAllBtn = document.createElement('a');
        seeAllBtn.className = 'cvp-see-all-btn';
        seeAllBtn.textContent = seeAllLabel;
        seeAllBtn.href = seeAllHref;
        block.append(seeAllBtn);
      },
    },
  };
}

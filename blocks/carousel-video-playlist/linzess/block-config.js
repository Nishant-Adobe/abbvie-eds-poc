export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        const maxVisible = 3;
        const seeAllLabel = 'See All Patient Videos';
        const seeAllHref = '/linzess/why-linzess#patientexperiences';

        const items = block.querySelectorAll('.cvp-playlist-item');
        if (!items.length || items.length <= maxVisible) return;

        items.forEach((item, idx) => {
          if (idx >= maxVisible) {
            item.classList.add('cvp-hidden');
            item.hidden = true;
          }
        });

        const seeAllBtn = document.createElement('a');
        seeAllBtn.className = 'cvp-see-all-btn';
        seeAllBtn.textContent = seeAllLabel;

        if (seeAllHref) {
          seeAllBtn.href = seeAllHref;
        } else {
          seeAllBtn.href = '#';
          seeAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            items.forEach((item) => {
              item.classList.remove('cvp-hidden');
              item.hidden = false;
            });
            seeAllBtn.remove();
          });
        }

        block.append(seeAllBtn);
      },
    },
  };
}

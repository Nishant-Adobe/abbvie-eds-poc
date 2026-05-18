import { showSlide } from '../carousel.js';

let autoPlayInterval = null;

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

function startAutoPlay(block, interval = 5000) {
  stopAutoPlay();
  autoPlayInterval = setInterval(() => {
    const current = parseInt(block.dataset.activeSlide || '0', 10);
    showSlide(block, current + 1);
  }, interval);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: async (block) => {
        const slides = block.querySelectorAll('.carousel-slide');
        if (slides.length < 2) return;

        if (!block.dataset.activeSlide) {
          block.dataset.activeSlide = '0';
        }

        startAutoPlay(block);

        block.addEventListener('mouseenter', stopAutoPlay);
        block.addEventListener('mouseleave', () => startAutoPlay(block));
        block.addEventListener('focusin', stopAutoPlay);
        block.addEventListener('focusout', () => startAutoPlay(block));
      },
    },
  };
}

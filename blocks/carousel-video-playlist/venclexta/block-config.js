let transcriptModal = null;

function getTranscriptModal() {
  if (transcriptModal) return transcriptModal;

  const overlay = document.createElement('div');
  overlay.className = 'cvp-transcript-modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'cvp-transcript-modal-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Video Transcript');

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'cvp-transcript-modal-close';
  closeBtn.textContent = 'Close Transcript';

  const body = document.createElement('div');
  body.className = 'cvp-transcript-modal-body';

  dialog.append(closeBtn, body);
  overlay.append(dialog);
  document.body.append(overlay);

  const close = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('cvp-modal-is-open');
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      close();
    }
  });

  transcriptModal = { overlay, body };
  return transcriptModal;
}

function openTranscriptModal(content) {
  const modal = getTranscriptModal();
  modal.body.innerHTML = '';
  if (typeof content === 'string') {
    modal.body.innerHTML = content;
  } else if (content?.innerHTML) {
    modal.body.innerHTML = content.innerHTML;
  } else if (content?.childNodes) {
    [...content.childNodes].forEach((n) => {
      modal.body.append(n.cloneNode(true));
    });
  }
  modal.overlay.classList.add('is-open');
  document.body.classList.add('cvp-modal-is-open');
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: async (block) => {
        if (window.self !== window.top) return;
        const items = block.querySelectorAll(
          '.cvp-playlist-item',
        );
        const rows = [...block.querySelectorAll(':scope > div')]
          .filter((r) => r.children.length >= 2);

        items.forEach((item, idx) => {
          const row = rows[idx];
          if (!row) return;

          const cells = [...row.children];
          const transcriptCell = cells[3];
          const transcriptText = transcriptCell
            ?.textContent?.trim();

          if (!transcriptText) return;

          const link = document.createElement('button');
          link.type = 'button';
          link.className = 'cvp-transcript-link';
          link.textContent = 'View Transcript';

          link.addEventListener('click', (e) => {
            e.stopPropagation();
            openTranscriptModal(transcriptCell);
          });

          item.append(link);
        });
      },
    },
  };
}

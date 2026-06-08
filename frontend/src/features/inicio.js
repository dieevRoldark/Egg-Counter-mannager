import { getGalponState, setGalponState as saveGalponState } from '../state/toggleState.js';

const isMobile = () => window.matchMedia('(max-width: 700px)').matches;
const galponTitleSel = '.galpon__title';

function applyGalponState(title, expand) {
  const body = title.parentElement.querySelector('.galpon__body');
  const icon = title.querySelector('.galpon__icon');
  const galponName = title.parentElement.dataset.galponName;
  if (expand) {
    body.removeAttribute('hidden');
    title.setAttribute('aria-expanded', 'true');
    if (icon) icon.textContent = '▼';
  } else {
    body.setAttribute('hidden', '');
    title.setAttribute('aria-expanded', 'false');
    if (icon) icon.textContent = '▶';
  }
  if (galponName) {
    saveGalponState(galponName, expand);
  }
}

function toggleGalpon(title) {
  const body = title.parentElement.querySelector('.galpon__body');
  applyGalponState(title, body.hasAttribute('hidden'));
}

function handleGalponClick(title) {
  if (isMobile()) {
    toggleGalpon(title);
  } else {
    const body = title.parentElement.querySelector('.galpon__body');
    document.querySelectorAll(galponTitleSel).forEach(t => {
      const tBody = t.parentElement.querySelector('.galpon__body');
      applyGalponState(t, tBody.hasAttribute('hidden'));
    });
  }
}

function initializeGalpones() {
  document.querySelectorAll('.galpon[data-galpon-name]').forEach(article => {
    const title = article.querySelector(galponTitleSel);
    const galponName = article.dataset.galponName;
    const savedState = getGalponState(galponName);
    applyGalponState(title, savedState);
  });
}

function attachListeners() {
  document.querySelectorAll(galponTitleSel).forEach(title => {
    title.addEventListener('click', () => handleGalponClick(title));
    title.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleGalponClick(title);
      }
    });
  });
}

function cleanup() {
  document.querySelectorAll(galponTitleSel).forEach(title => {
    const newTitle = title.cloneNode(true);
    title.parentNode.replaceChild(newTitle, title);
  });
}

export function init() {
  const titulo = document.querySelector('.title');
  if (titulo) titulo.setAttribute('contentEditable', 'true');
  cleanup();
  initializeGalpones();
  attachListeners();
}
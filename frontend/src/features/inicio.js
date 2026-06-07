const titulo = document.querySelector('.title');
if (titulo) titulo.setAttribute('contentEditable', 'true');

const isMobile = () => window.matchMedia('(max-width: 700px)').matches;
const galponTitleSel = '.galpon__title';

function setGalponState(title, expand) {
  const body = title.parentElement.querySelector('.galpon__body');
  const icon = title.querySelector('.galpon__icon');
  if (expand) {
    body.removeAttribute('hidden');
    title.setAttribute('aria-expanded', 'true');
    if (icon) icon.textContent = '▼';
  } else {
    body.setAttribute('hidden', '');
    title.setAttribute('aria-expanded', 'false');
    if (icon) icon.textContent = '▶';
  }
}

function toggleGalpon(title) {
  const body = title.parentElement.querySelector('.galpon__body');
  setGalponState(title, body.hasAttribute('hidden'));
}

function setAllGalpones(expand) {
  document.querySelectorAll(galponTitleSel).forEach(t => setGalponState(t, expand));
}

function handleGalponClick(title) {
  if (isMobile()) {
    toggleGalpon(title);
  } else {
    const body = title.parentElement.querySelector('.galpon__body');
    setAllGalpones(body.hasAttribute('hidden'));
  }
}

// Initial state
if (isMobile()) {
  setAllGalpones(false);
} else {
  setAllGalpones(true);
}

document.querySelectorAll(galponTitleSel).forEach(title => {
  title.addEventListener('click', () => handleGalponClick(title));
  title.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleGalponClick(title);
    }
  });
});
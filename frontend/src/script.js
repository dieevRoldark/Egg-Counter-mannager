const routes = {
  '/inicio': 'views/inicio.html',
  '/inventario': 'views/inventario.html',
  '/progreso': 'views/progreso.html',
};

const cache = {};
const app = document.getElementById('app');

function getCurrentRoute() {
  const hash = window.location.hash.replace('#', '') || '/inicio';
  return routes[hash] ? hash : '/inicio';
}

async function loadView(route) {
  const file = routes[route];
  if (!file) {
    app.innerHTML = '<section class="view-message"><h1>404</h1><p>Sección no encontrada. <a href="#/inicio">Volver al inicio</a></p></section>';
    return;
  }

  if (cache[route]) {
    app.innerHTML = cache[route];
    return;
  }

  app.innerHTML = '<section class="view-message"><h1>Cargando...</h1><p>Obteniendo contenido.</p></section>';

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error();
    const html = await res.text();
    cache[route] = html;
    app.innerHTML = html;
  } catch {
    app.innerHTML = '<section class="view-message"><h1>Error de conexión</h1><p>No se pudo cargar la sección. <a href="#/inicio">Volver al inicio</a></p></section>';
  }
}

function updateActiveNav(route) {
  document.querySelectorAll('[data-link]').forEach(el => {
    el.classList.toggle('nav__item--active', el.getAttribute('data-route') === route);
  });
}

function handleRouteChange() {
  const route = getCurrentRoute();
  loadView(route);
  updateActiveNav(route);
}

document.addEventListener('DOMContentLoaded', () => {
  const route = getCurrentRoute();
  if (window.location.hash !== `#${route}`) {
    window.location.hash = route;
  }
  handleRouteChange();
  window.addEventListener('hashchange', handleRouteChange);
});

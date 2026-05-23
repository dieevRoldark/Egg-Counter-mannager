const ROUTES = Object.freeze({
    "/inicio": "./views/inicio.html",
    "/inventario": "./views/inventario.html",
    "/progreso": "./views/progreso.html"
});

const DEFAULT_ROUTE = "/inicio";
const appElement = document.querySelector("#app");
let renderVersion = 0;
const viewCache = {};

const appState = {
    inicio: {
        primeras: { total: 0, registros: 0 },
        segundas: { total: 0, registros: 0 },
        terceras: { total: 0, registros: 0 }
    }
};

function normalizeRoute(route) {
    if (!route || route === "/") {
        return DEFAULT_ROUTE;
    }

    return route.startsWith("/") ? route : `/${route}`;
}

function getRouteFromHash() {
    const hashValue = window.location.hash.replace(/^#/, "");
    return normalizeRoute(hashValue);
}

function setActiveNav(route) {
    document.querySelectorAll("[data-link]").forEach((link) => {
        const isActive = link.dataset.route === route;
        link.classList.toggle("nav__item--active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function renderMessage(title, description) {
    if (!appElement) {
        return;
    }

    appElement.innerHTML = `
        <section class="view-message">
            <h1>${title}</h1>
            <p>${description}</p>
        </section>
    `;
}

function navigate(route, options = {}) {
    const normalizedRoute = normalizeRoute(route);
    const validRoute = ROUTES[normalizedRoute] ? normalizedRoute : DEFAULT_ROUTE;
    const targetHash = `#${validRoute}`;

    if (options.replace) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${targetHash}`);
        handleRouteChange();
        return;
    }

    if (window.location.hash === targetHash) {
        handleRouteChange();
        return;
    }

    window.location.hash = validRoute;
}

async function loadRoute(route) {
    if (!appElement) {
        return;
    }

    const viewPath = ROUTES[route];

    if (!viewPath) {
        setActiveNav("");
        renderMessage("Sección no encontrada", "La ruta solicitada no existe en la aplicación.");
        return;
    }

    const currentRender = ++renderVersion;
    setActiveNav(route);
    appElement.setAttribute("aria-busy", "true");

    if (viewCache[route]) {
        appElement.innerHTML = viewCache[route];
        appElement.removeAttribute("aria-busy");
        initView(route);
        return;
    }

    renderMessage("Cargando sección", "Obteniendo contenido dinámico...");

    try {
        const response = await fetch(viewPath);

        if (!response.ok) {
            throw new Error(`No se pudo cargar ${viewPath} (status ${response.status}).`);
        }

        const html = await response.text();

        if (currentRender !== renderVersion) {
            return;
        }

        viewCache[route] = html;
        appElement.innerHTML = html;
        initView(route);
    } catch (error) {
        if (currentRender !== renderVersion) {
            return;
        }

        console.error(error);
        renderMessage("Error al cargar la sección", "Verifica que la app corra en un servidor HTTP local.");
    } finally {
        if (currentRender === renderVersion) {
            appElement.removeAttribute("aria-busy");
        }
    }
}

function handleRouteChange() {
    const route = getRouteFromHash();

    if (!ROUTES[route]) {
        navigate(DEFAULT_ROUTE, { replace: true });
        return;
    }

    loadRoute(route);
}

function initView(route) {
    if (route === "/inicio") {
        initInicioView();
        return;
    }

    if (route === "/inventario") {
        initInventarioView();
    }
}

function initInicioView() {
    const forms = document.querySelectorAll("form[data-galpon]");

    forms.forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const galpon = form.dataset.galpon;
            const quantityInput = form.querySelector("input[type='number']");
            const quantity = Number.parseInt(quantityInput?.value ?? "0", 10);

            if (!galpon || !Object.prototype.hasOwnProperty.call(appState.inicio, galpon)) {
                return;
            }

            if (!Number.isFinite(quantity) || quantity < 0) {
                return;
            }

            appState.inicio[galpon].total += quantity;
            appState.inicio[galpon].registros += 1;
            form.reset();
            updateInicioStats();
        });
    });

    updateInicioStats();
}

function updateInicioStats() {
    const resumen = appState.inicio;
    let totalGeneral = 0;
    let totalRegistros = 0;

    Object.entries(resumen).forEach(([galpon, data]) => {
        totalGeneral += data.total;
        totalRegistros += data.registros;

        const promedio = data.registros === 0 ? 0 : data.total / data.registros;
        const avgElement = document.querySelector(`[data-average='${galpon}']`);

        if (avgElement) {
            avgElement.textContent = `Promedio: ${promedio.toFixed(2)}`;
        }
    });

    const totalElement = document.querySelector("#total");
    if (totalElement) {
        totalElement.textContent = String(totalGeneral);
    }

    const recordElement = document.querySelector("#total-registros");
    if (recordElement) {
        recordElement.textContent = `Registros: ${totalRegistros}`;
    }
}

function setInventoryFeedback(element, message, isError) {
    element.textContent = message;
    element.classList.toggle("inventory__feedback--error", isError);
}

function initInventarioView() {
    const form = document.querySelector("#inventory-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const totalInput = document.querySelector("#inventory-total");
        const feedbackElement = document.querySelector("#inventory-feedback");
        const resultList = document.querySelector("#inventory-results");

        if (!totalInput || !feedbackElement || !resultList) {
            return;
        }

        const total = Number.parseFloat(totalInput.value);
        const distribution = {
            B: Number.parseFloat(document.querySelector("#inventory-b")?.value ?? "0"),
            A: Number.parseFloat(document.querySelector("#inventory-a")?.value ?? "0"),
            AA: Number.parseFloat(document.querySelector("#inventory-aa")?.value ?? "0"),
            AAA: Number.parseFloat(document.querySelector("#inventory-aaa")?.value ?? "0")
        };

        const percentages = Object.values(distribution);
        const sumPercentages = percentages.reduce((sum, value) => sum + value, 0);
        const isValidInput = Number.isFinite(total)
            && total >= 0
            && percentages.every((value) => Number.isFinite(value) && value >= 0);

        if (!isValidInput) {
            setInventoryFeedback(feedbackElement, "Ingresa valores numéricos válidos.", true);
            return;
        }

        if (Math.abs(sumPercentages - 100) > 0.001) {
            setInventoryFeedback(feedbackElement, "La suma de porcentajes debe ser 100.", true);
            return;
        }

        resultList.innerHTML = "";

        Object.entries(distribution).forEach(([size, percentage]) => {
            const estimatedEggs = Math.round((total * percentage) / 100);
            const item = document.createElement("li");
            item.textContent = `${size}: ${estimatedEggs}`;
            resultList.appendChild(item);
        });

        setInventoryFeedback(feedbackElement, "Distribución calculada correctamente.", false);
    });
}

document.addEventListener("click", (event) => {
    const routeLink = event.target.closest("[data-link]");

    if (!routeLink) {
        return;
    }

    event.preventDefault();
    const route = routeLink.dataset.route;

    if (route) {
        navigate(route);
    }
});

window.addEventListener("hashchange", handleRouteChange);

document.addEventListener("DOMContentLoaded", () => {
    if (!appElement) {
        return;
    }

    if (!window.location.hash) {
        navigate(DEFAULT_ROUTE, { replace: true });
        return;
    }

    handleRouteChange();
});
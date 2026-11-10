const WHATSAPP = "5511947093575";
const properties = window.CLAYTON_PROPERTIES;

const grid = document.querySelector("#property-grid");
const count = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const favoriteRefs = new Set();
const filters = { purpose: "", type: "", neighborhood: "", bedrooms: "" };

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function filteredProperties() {
  return properties.filter((property) =>
    (!filters.purpose || property.purpose === filters.purpose)
    && (!filters.type || property.type === filters.type)
    && (!filters.neighborhood || property.neighborhood === filters.neighborhood)
    && (!filters.bedrooms || property.bedrooms >= Number(filters.bedrooms))
  );
}

function propertyCard(property) {
  const isFavorite = favoriteRefs.has(property.ref);
  return `
    <article class="property-card">
      <div class="property-photo">
        <a class="property-photo-link" href="${property.page}" aria-label="Ver ${property.name}, referência ${property.ref}">
          <img src="${property.images[0]}" alt="${property.name} demonstrativo em ${property.neighborhood}, São Paulo" loading="lazy" width="900" height="760">
        </a>
        <span class="property-tag">${property.purposeLabel}</span>
        <span class="property-ref">${property.ref}</span>
        <button class="favorite-button" type="button" data-favorite="${property.ref}" aria-label="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}: ${property.name}" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
      </div>
      <div class="property-info">
        <div class="property-title-row">
          <div><h3>${property.name}</h3><p class="property-location">${property.neighborhood}, São Paulo/SP <span>· demonstrativo</span></p></div>
          <strong class="property-price">${property.price}</strong>
        </div>
        <div class="property-specs" aria-label="Características do imóvel">
          <span><strong>${property.area}</strong> m²</span>
          <span><strong>${property.bedrooms}</strong> dorm.</span>
          <span><strong>${property.bathrooms}</strong> banh.</span>
          <span><strong>${property.parking}</strong> vaga${property.parking > 1 ? "s" : ""}</span>
        </div>
        <a class="card-open" href="${property.page}">Ver detalhes <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
}

function renderProperties() {
  const visibleProperties = filteredProperties();
  grid.innerHTML = visibleProperties.map(propertyCard).join("");
  count.textContent = `${visibleProperties.length} ${visibleProperties.length === 1 ? "imóvel" : "imóveis"} demonstrativo${visibleProperties.length === 1 ? "" : "s"}`;
  emptyState.hidden = visibleProperties.length > 0;
  document.querySelector("#share-favorites").disabled = favoriteRefs.size === 0;
  const searchCriteria = [
    filters.purpose && (filters.purpose === "buy" ? "comprar" : "alugar"),
    filters.type,
    filters.neighborhood,
    filters.bedrooms && `${filters.bedrooms}+ dormitórios`
  ].filter(Boolean).join(", ");
  document.querySelector("#empty-whatsapp").href = whatsappUrl(
    `Olá! Conheci o site da Clayton Prime e não encontrei um imóvel com os filtros que procuro. Estou buscando: ${searchCriteria || "descreva aqui o imóvel desejado"}.`
  );
}

function setFilters(nextFilters) {
  Object.assign(filters, nextFilters);
  document.querySelector("#filter-type").value = filters.type;
  document.querySelector("#filter-neighborhood").value = filters.neighborhood;
  document.querySelector("#filter-bedrooms").value = filters.bedrooms;
  document.querySelectorAll(".filter-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.purpose === filters.purpose);
  });
  renderProperties();
}

document.querySelector("#hero-search").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  setFilters({
    purpose: data.get("purpose"),
    type: data.get("type"),
    neighborhood: data.get("neighborhood"),
    bedrooms: data.get("bedrooms")
  });
  document.querySelector("#imoveis").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => setFilters({ purpose: button.dataset.purpose }));
});
document.querySelector("#filter-type").addEventListener("change", (event) => setFilters({ type: event.target.value }));
document.querySelector("#filter-neighborhood").addEventListener("change", (event) => setFilters({ neighborhood: event.target.value }));
document.querySelector("#filter-bedrooms").addEventListener("change", (event) => setFilters({ bedrooms: event.target.value }));
document.querySelector("#clear-filters").addEventListener("click", () => {
  document.querySelector("#hero-search").reset();
  setFilters({ purpose: "", type: "", neighborhood: "", bedrooms: "" });
});

grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    event.stopPropagation();
    const ref = favoriteButton.dataset.favorite;
    favoriteRefs.has(ref) ? favoriteRefs.delete(ref) : favoriteRefs.add(ref);
    renderProperties();
  }
});
document.querySelector("#share-favorites").addEventListener("click", () => {
  if (favoriteRefs.size === 0) return;
  const selected = properties.filter((property) => favoriteRefs.has(property.ref)).map((property) => `${property.ref} — ${property.name}`);
  window.open(whatsappUrl(`Olá! Conheci estes imóveis demonstrativos no site da Clayton Prime e gostaria de mais informações:\n${selected.join("\n")}`), "_blank", "noopener,noreferrer");
});

document.querySelector("#owner-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "Olá! Gostaria de apresentar um imóvel à Clayton Prime.",
    `Nome: ${data.get("name").toString().trim()}`,
    `Objetivo: ${data.get("goal")}`,
    `Tipo de imóvel: ${data.get("type")}`,
    `Bairro: ${data.get("neighborhood").toString().trim()}`
  ].join("\n");
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  primaryNav.classList.toggle("is-open", !isOpen);
});
primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    primaryNav.classList.remove("is-open");
  }
});

const siteHeader = document.querySelector(".site-header");
const updateHeader = () => siteHeader.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
document.querySelector("#current-year").textContent = new Date().getFullYear();

renderProperties();

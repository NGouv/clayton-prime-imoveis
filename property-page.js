const properties = window.CLAYTON_PROPERTIES;
const page = document.querySelector("[data-property-page]");
const property = properties.find((item) => item.ref === page.dataset.propertyPage);

if (property) {
  const whatsappMessage = encodeURIComponent(
    `Olá! Conheci o site da Clayton Prime e gostaria de mais informações sobre o imóvel ${property.ref}.`
  );
  const imageDescriptions = [
    `${property.name} demonstrativo em ${property.neighborhood}, São Paulo`,
    `${property.name} demonstrativo, ambiente interno`,
    `${property.name} demonstrativo, detalhe do imóvel`
  ];

  document.title = `${property.name} ${property.ref} | Clayton Prime Imóveis`;
  document.querySelector('meta[name="description"]').content =
    `${property.name} demonstrativo em ${property.neighborhood}, São Paulo. Consulte detalhes do imóvel ${property.ref} com a Clayton Prime.`;

  page.innerHTML = `
    <section class="property-page-intro">
      <p class="eyebrow"><span></span> Imóvel demonstrativo <i>·</i> ${property.ref}</p>
      <h1>${property.name}</h1>
      <p class="property-page-location">${property.neighborhood}, São Paulo/SP <span>· localização demonstrativa</span></p>
    </section>
    <section class="property-page-layout" aria-label="Detalhes do imóvel">
      <div class="property-page-gallery">
        ${property.images.map((image, index) => `
          <img src="${image}" alt="${imageDescriptions[index]}" width="${index === 0 ? 1200 : 900}" height="${index === 0 ? 800 : 600}" ${index > 0 ? 'loading="lazy"' : 'fetchpriority="high"'}>
        `).join("")}
      </div>
      <div class="property-page-details">
        <p class="property-page-purpose">${property.purposeLabel} <span>· ${property.type}</span></p>
        <p class="property-page-price">${property.price}</p>
        <p class="property-page-demo">Valor e características exclusivamente ilustrativos.</p>
        <dl class="property-page-specs">
          <div><dt>Área</dt><dd>${property.area} m²</dd></div>
          <div><dt>Dormitórios</dt><dd>${property.bedrooms}</dd></div>
          <div><dt>Banheiros</dt><dd>${property.bathrooms}</dd></div>
          <div><dt>Vagas</dt><dd>${property.parking}</dd></div>
        </dl>
        <h2>Sobre o imóvel</h2>
        <p class="property-page-description">${property.description}</p>
        <h2>Características</h2>
        <ul class="property-page-features">
          <li>${property.type}</li>
          <li>${property.area} m²</li>
          <li>${property.bedrooms} dormitórios</li>
          <li>${property.bathrooms} banheiros</li>
          <li>${property.parking} vaga${property.parking > 1 ? "s" : ""}</li>
        </ul>
        <a class="button button-gold property-page-cta" href="https://wa.me/5511947093575?text=${whatsappMessage}" target="_blank" rel="noopener noreferrer">Consultar pelo WhatsApp <span aria-hidden="true">↗</span></a>
        <p class="property-page-disclaimer">Este imóvel é demonstrativo e não representa um anúncio real da Clayton Prime.</p>
      </div>
    </section>`;
}

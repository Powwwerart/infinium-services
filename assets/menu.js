const state = {
  lang: 'es',
  data: null,
};

const elements = {
  name: document.getElementById('restaurant-name'),
  tagline: document.getElementById('restaurant-tagline'),
  menu: document.getElementById('menu-container'),
  hours: document.getElementById('hours-container'),
  location: document.getElementById('location-container'),
  actions: document.getElementById('actions'),
  social: document.getElementById('social'),
  menuHeading: document.getElementById('menu-heading'),
  hoursHeading: document.getElementById('hours-heading'),
  locationHeading: document.getElementById('location-heading'),
  languageButtons: document.querySelectorAll('.lang-button'),
};

const pendingText = {
  es: 'Pendiente',
  en: 'Pending',
};

const uiText = {
  menu: { es: 'Menú', en: 'Menu' },
  hours: { es: 'Horarios', en: 'Hours' },
  location: { es: 'Ubicación', en: 'Location' },
  address: { es: 'Dirección', en: 'Address' },
  city: { es: 'Ciudad', en: 'City' },
  state: { es: 'Estado', en: 'State' },
  maps: { es: 'Abrir en Google Maps', en: 'Open in Google Maps' },
};

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const getSlugFromPath = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const routeIndex = segments.indexOf('r');
  if (routeIndex === -1 || segments.length <= routeIndex + 1) {
    return null;
  }
  return segments[routeIndex + 1];
};

const safeText = (value, lang) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return pendingText[lang];
};

const translateField = (field, lang) => {
  if (!field || typeof field !== 'object') {
    return pendingText[lang];
  }
  return safeText(field[lang], lang);
};

const isValidPrice = (price) => Number.isFinite(price);

const buildInfoRow = (label, value) => {
  const row = document.createElement('div');
  row.className = 'info-row';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;

  const valueSpan = document.createElement('span');
  valueSpan.textContent = value;

  row.append(labelSpan, valueSpan);
  return row;
};

const renderMenu = (data, lang) => {
  elements.menu.innerHTML = '';
  const menu = Array.isArray(data.menu) ? data.menu : [];

  menu.forEach((category) => {
    const items = Array.isArray(category.items) ? category.items : [];
    const validItems = items.filter((item) => isValidPrice(item.price));

    if (validItems.length === 0) {
      return;
    }

    const categoryWrapper = document.createElement('div');
    categoryWrapper.className = 'menu-category';

    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = translateField(category.category, lang);

    const itemsList = document.createElement('div');

    validItems.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'menu-item';

      const name = document.createElement('span');
      name.className = 'menu-item-name';
      name.textContent = translateField(item.name, lang);

      const price = document.createElement('span');
      price.className = 'menu-item-price';
      price.textContent = priceFormatter.format(item.price);

      row.append(name, price);
      itemsList.append(row);
    });

    categoryWrapper.append(categoryTitle, itemsList);
    elements.menu.append(categoryWrapper);
  });

  if (!elements.menu.children.length) {
    const empty = document.createElement('p');
    empty.textContent = pendingText[lang];
    elements.menu.append(empty);
  }
};

const renderHours = (data, lang) => {
  elements.hours.innerHTML = '';
  const schedule = Array.isArray(data?.hours?.schedule) ? data.hours.schedule : [];
  const hasAny = schedule.some((entry) =>
    Boolean(entry?.days || entry?.open || entry?.close)
  );

  if (!hasAny) {
    elements.hours.textContent = pendingText[lang];
    return;
  }

  schedule.forEach((entry) => {
    const daysLabel = safeText(entry?.days, lang);
    const open = safeText(entry?.open, lang);
    const close = safeText(entry?.close, lang);
    elements.hours.append(buildInfoRow(daysLabel, `${open} - ${close}`));
  });
};

const renderLocation = (data, lang) => {
  elements.location.innerHTML = '';
  const location = data?.location ?? {};
  const hasAny = Boolean(location.address || location.city || location.state || location.googleMapsUrl);

  if (!hasAny) {
    elements.location.textContent = pendingText[lang];
    return;
  }

  const address = safeText(location.address, lang);
  const city = safeText(location.city, lang);
  const stateValue = safeText(location.state, lang);

  elements.location.append(buildInfoRow(uiText.address[lang], address));
  elements.location.append(buildInfoRow(uiText.city[lang], city));
  elements.location.append(buildInfoRow(uiText.state[lang], stateValue));

  if (location.googleMapsUrl) {
    const link = document.createElement('a');
    link.href = location.googleMapsUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = uiText.maps[lang];
    elements.location.append(link);
  }
};

const renderActions = (data, lang) => {
  elements.actions.innerHTML = '';
  const whatsapp = data?.contact?.whatsapp;
  const message = data?.contact?.whatsappMessage?.[lang] ?? pendingText[lang];

  if (!whatsapp) {
    return;
  }

  const link = document.createElement('a');
  link.className = 'action-button';
  link.href = `https://wa.me/${encodeURIComponent(whatsapp)}?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'WhatsApp';
  elements.actions.append(link);
};

const renderSocial = (data) => {
  elements.social.innerHTML = '';
  const social = data?.social ?? {};
  const entries = [
    ['Facebook', social.facebook],
    ['Instagram', social.instagram],
    ['TikTok', social.tiktok],
    ['Website', social.website],
  ];

  entries.forEach(([label, url]) => {
    if (!url) {
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    elements.social.append(link);
  });
};

const updateLanguageButtons = () => {
  elements.languageButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.lang === state.lang);
  });
};

const render = () => {
  if (!state.data) {
    return;
  }
  const lang = state.lang;
  elements.name.textContent = translateField(state.data.name, lang);
  elements.tagline.textContent = translateField(state.data.tagline, lang);
  elements.menuHeading.textContent = uiText.menu[lang];
  elements.hoursHeading.textContent = uiText.hours[lang];
  elements.locationHeading.textContent = uiText.location[lang];
  document.documentElement.lang = lang;

  renderMenu(state.data, lang);
  renderHours(state.data, lang);
  renderLocation(state.data, lang);
  renderActions(state.data, lang);
  renderSocial(state.data);
  updateLanguageButtons();
};

const setLanguage = (lang) => {
  state.lang = lang;
  render();
};

const loadRestaurant = async () => {
  const slug = getSlugFromPath();
  if (!slug) {
    state.data = {};
    render();
    return;
  }

  try {
    const response = await fetch(`/data/restaurants/${slug}.json`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Missing data');
    }
    state.data = await response.json();
  } catch (error) {
    state.data = {};
  }

  render();
};

const init = () => {
  elements.languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
  loadRestaurant();
};

init();

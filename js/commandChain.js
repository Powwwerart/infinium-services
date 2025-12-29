// commandChain.js

export const MIN_PRICES_USD = {
  'V-ITAREN': 37.50,
  'V-ORGANEX': 37.50,
  'V-ITALAY': 37.50,
  'V-ASCULAX': 37.50,
  'V-GLUTATION': 67.50,
  'V-ITADOL': 37.50,
  'V-FORTYFLORA': 37.50,
  'V-OMEGA 3': 63.00,
  'VITALPRO': 63.00,
  'V-NITRO': 52.50,
  'V-NRGY': 37.50,
  'VITALAGE COLLAGEN': 75.00,
  'V-CONTROL': 37.50,
  'VITALBOOST': 37.50,
  'V-CURCUMAX': 37.50,
  'V-DAILY': 75.00,
  'GLUTATION PLUS': 67.50,
  'V-NEUROKAFE': 45.00,
  'V-THERMOKAFE': 45.00,
  'V-LOVEKAFE': 45.00,
  'V-TE DETOX': 17.00
};

// Labels ya listos para texto humano (evita "rutinas de energía" raro)
const CATEGORY_LABELS = {
  energia: 'energía',
  estres_descanso: 'estrés y descanso',
  digestion: 'digestión',
  enfoque: 'enfoque',
  peso: 'control de peso',
  articulaciones: 'articulaciones',
  bienestar: 'bienestar general'
};

// Respuestas fijas (sin variaciones)
const CATEGORY_RESPONSES = {
  energia: { product: 'VITALPRO', phrase: 'aporta energía funcional' },
  estres_descanso: { product: 'V-ITALAY', phrase: 'contribuye a la relajación y descanso' },
  digestion: { product: 'V-FORTYFLORA', phrase: 'apoya la flora intestinal' },
  enfoque: { product: 'V-NEUROKAFE', phrase: 'apoya el rendimiento mental' },
  peso: { product: 'V-THERMOKAFE', phrase: 'acompaña el metabolismo activo' },
  articulaciones: { product: 'V-ITADOL', phrase: 'acompaña la movilidad articular' },
  bienestar: { product: 'V-DAILY', phrase: 'apoya el equilibrio nutricional diario' }
};

export const normalizeInput = (text = '') => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const detectCategory = (userInput = '') => {
  const normalized = normalizeInput(userInput);
  if (!normalized) return null;

  // Nota: “bienestar general” no hace falta como keyword separada si ya usamos “bienestar”
  const rules = [
    { category: 'escaneo', keywords: ['escaneo'] },
    { category: 'estres_descanso', keywords: ['estres', 'descanso'] },
    { category: 'energia', keywords: ['energia'] },
    { category: 'digestion', keywords: ['digest'] },
    { category: 'enfoque', keywords: ['enfoque', 'concentr'] },
    { category: 'peso', keywords: ['peso', 'metabol'] },
    { category: 'articulaciones', keywords: ['articul'] },
    { category: 'bienestar', keywords: ['bienestar'] }
  ];

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.category;
    }
  }

  return null;
};

export const formatUSD = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return null;
  return `$${amount.toFixed(2)} USD`;
};

export const getMinPriceUSD = (productName) => {
  if (!productName) return null;
  const price = MIN_PRICES_USD[productName];
  return (typeof price === 'number') ? price : null;
};

export const mapCategoryToResponse = (category) => {
  if (!category) return null;
  if (category === 'escaneo') return { type: 'scan' };

  const mapping = CATEGORY_RESPONSES[category];
  if (!mapping) return null;

  return {
    type: 'product',
    categoryLabel: CATEGORY_LABELS[category] || category,
    product: mapping.product,
    phrase: mapping.phrase
  };
};

export const buildMenuResponse = () => (
  'Para orientarte mejor, dime qué se parece más a lo que buscas ahora mismo:\n'
  + '- Energía\n'
  + '- Estrés / descanso\n'
  + '- Digestión\n'
  + '- Enfoque\n'
  + '- Peso\n'
  + '- Articulaciones\n'
  + '- Bienestar general\n'
  + '- Escaneo'
);

export const buildScanResponse = () => (
  'El escaneo es una herramienta de orientación que ayuda a observar cómo se encuentra el cuerpo en este momento, en relación con hábitos y estilo de vida.\n'
  + 'No diagnostica ni sustituye la atención médica.\n'
  + 'Su objetivo es aportar claridad para tomar decisiones más conscientes.'
);

export const buildProductResponse = ({ categoryLabel, product, phrase, price }) => (
  `Para ${categoryLabel}, suele encajar bien ${product}.\n\n`
  + `Es un suplemento alimenticio que ${phrase}.\n\n`
  + `Precio de referencia desde: ${price}. (Puede variar al entrar a la tienda).\n\n`
  + '¿Cómo te gustaría continuar?\n'
  + '- Comprar ahora\n'
  + '- Hablar con un asesor por WhatsApp\n'
  + '- Quiero algo más personalizado (escaneo)\n\n'
  + 'Este producto no es un medicamento.\n'
  + 'El consumo es responsabilidad de quien lo recomienda y de quien lo usa.'
);

export const handleUserMessage = (userMessage = '') => {
  const category = detectCategory(userMessage);

  // ✅ IMPORTANTE: si no detecta, NO regreses null (evita "no contestó nada")
  if (!category) return buildMenuResponse();

  if (category === 'escaneo') {
    return buildScanResponse();
  }

  const mapped = mapCategoryToResponse(category);
  if (!mapped || mapped.type !== 'product' || !mapped.product) {
    return buildMenuResponse();
  }

  const priceNumber = getMinPriceUSD(mapped.product);
  if (priceNumber === null) {
    return buildMenuResponse();
  }

  const formattedPrice = formatUSD(priceNumber);
  if (!formattedPrice) {
    return buildMenuResponse();
  }

  return buildProductResponse({
    categoryLabel: mapped.categoryLabel,
    product: mapped.product,
    phrase: mapped.phrase,
    price: formattedPrice
  });
};

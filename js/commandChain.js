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
  bienestar: 'bienestar general',
  defensas: 'defensas',
  piel: 'piel y colágeno',
  detox: 'detox suave'
};

// Respuestas fijas (sin variaciones)
const CATEGORY_RESPONSES = {
  energia: {
    productA: {
      name: 'VITALPRO',
      how: 'Cómo funciona: aporta nutrientes diarios que acompañan el ritmo de tus actividades.'
    },
    productB: {
      name: 'V-NRGY',
      how: 'Cómo funciona: combina ingredientes que apoyan la vitalidad sin ser invasivos.'
    }
  },
  estres_descanso: {
    productA: {
      name: 'V-ITALAY',
      how: 'Cómo funciona: incluye componentes que favorecen la sensación de calma y descanso.'
    },
    productB: {
      name: 'V-LOVEKAFE',
      how: 'Cómo funciona: mezcla botánicos que acompañan un estado de ánimo equilibrado.'
    }
  },
  digestion: {
    productA: {
      name: 'V-FORTYFLORA',
      how: 'Cómo funciona: aporta cepas que ayudan a mantener la flora intestinal en balance.'
    },
    productB: {
      name: 'V-ORGANEX',
      how: 'Cómo funciona: reúne ingredientes que apoyan una digestión ligera día a día.'
    }
  },
  enfoque: {
    productA: {
      name: 'V-NEUROKAFE',
      how: 'Cómo funciona: combina nutrientes que acompañan el enfoque en tareas diarias.'
    },
    productB: {
      name: 'V-OMEGA 3',
      how: 'Cómo funciona: aporta grasas esenciales que respaldan el rendimiento mental cotidiano.'
    }
  },
  peso: {
    productA: {
      name: 'V-THERMOKAFE',
      how: 'Cómo funciona: integra extractos que acompañan un metabolismo activo con hábitos saludables.'
    },
    productB: {
      name: 'V-CONTROL',
      how: 'Cómo funciona: ayuda a sostener rutinas de control con nutrición equilibrada.'
    }
  },
  articulaciones: {
    productA: {
      name: 'V-ITADOL',
      how: 'Cómo funciona: aporta componentes que acompañan la movilidad y el confort diario.'
    },
    productB: {
      name: 'V-CURCUMAX',
      how: 'Cómo funciona: combina extractos que respaldan la flexibilidad en el día a día.'
    }
  },
  bienestar: {
    productA: {
      name: 'V-DAILY',
      how: 'Cómo funciona: refuerza la base de micronutrientes para una rutina equilibrada.'
    },
    productB: {
      name: 'V-ITAREN',
      how: 'Cómo funciona: suma antioxidantes que acompañan el bienestar general.'
    }
  },
  defensas: {
    productA: {
      name: 'V-GLUTATION',
      how: 'Cómo funciona: aporta antioxidantes que apoyan la protección diaria del organismo.'
    },
    productB: {
      name: 'GLUTATION PLUS',
      how: 'Cómo funciona: combina nutrientes que respaldan el equilibrio antioxidante.'
    }
  },
  piel: {
    productA: {
      name: 'VITALAGE COLLAGEN',
      how: 'Cómo funciona: incluye colágeno y cofactores que acompañan la apariencia de la piel.'
    },
    productB: {
      name: 'VITALBOOST',
      how: 'Cómo funciona: reúne vitaminas que apoyan la nutrición de piel, cabello y uñas.'
    }
  },
  detox: {
    productA: {
      name: 'V-TE DETOX',
      how: 'Cómo funciona: infusión suave con plantas que acompañan una rutina ligera.'
    },
    productB: {
      name: 'V-ORGANEX',
      how: 'Cómo funciona: incluye ingredientes que apoyan el equilibrio diario del cuerpo.'
    }
  }
};

const MENU_KEYWORDS = ['menu', 'opciones', 'categorias', 'categoria', 'lista'];

export const normalizeInput = (text = '') => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const isMenuRequest = (normalizedInput) =>
  MENU_KEYWORDS.some((keyword) => normalizedInput.includes(keyword));

export const detectCategory = (userInput = '') => {
  const normalized = normalizeInput(userInput);
  if (!normalized) return null;

  const rules = [
    { category: 'escaneo', keywords: ['escaneo'] },
    { category: 'estres_descanso', keywords: ['estres', 'descanso', 'relaj'] },
    { category: 'energia', keywords: ['energia'] },
    { category: 'digestion', keywords: ['digest', 'flora'] },
    { category: 'enfoque', keywords: ['enfoque', 'concentr'] },
    { category: 'peso', keywords: ['peso', 'metabol'] },
    { category: 'articulaciones', keywords: ['articul', 'movilidad'] },
    { category: 'bienestar', keywords: ['bienestar'] },
    { category: 'defensas', keywords: ['defensa', 'inmun'] },
    { category: 'piel', keywords: ['piel', 'colageno', 'cabello', 'unas'] },
    { category: 'detox', keywords: ['detox', 'depur'] }
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
    products: [mapping.productA, mapping.productB]
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
  + '- Defensas\n'
  + '- Piel / colágeno\n'
  + '- Detox suave\n\n'
  + 'Si prefieres algo más personalizado, también puedo ayudarte con un escaneo.'
);

export const buildScanResponse = () => (
  'El escaneo es una herramienta de orientación que ayuda a observar cómo se encuentra el cuerpo en este momento, en relación con hábitos y estilo de vida.\n'
  + 'No diagnostica ni sustituye la atención médica.\n'
  + 'Su objetivo es aportar claridad para tomar decisiones más conscientes.'
);

export const buildProductResponse = ({ categoryLabel, products }) => {
  const productLines = products
    .map((product, index) => (
      `${index + 1}) ${product.name}\n${product.how}\nDesde ${product.price}.`
    ))
    .join('\n\n');

  return (
    `Para ${categoryLabel}, estas dos opciones suelen encajar:\n\n`
    + `${productLines}\n\n`
    + '¿Cómo te gustaría continuar?\n'
    + '- Comprar ahora\n'
    + '- Hablar con un asesor por WhatsApp\n'
    + '- Quiero algo más personalizado (escaneo)\n\n'
    + 'Este producto no es un medicamento.\n'
    + 'El consumo es responsabilidad de quien lo recomienda y de quien lo usa.'
  );
};

export const handleUserMessage = (userMessage = '') => {
  const normalized = normalizeInput(userMessage);
  if (!normalized) return null;

  if (isMenuRequest(normalized)) {
    return buildMenuResponse();
  }

  const category = detectCategory(userMessage);
  if (!category) return null;

  if (category === 'escaneo') {
    return buildScanResponse();
  }

  const mapped = mapCategoryToResponse(category);
  if (!mapped || mapped.type !== 'product' || !mapped.products?.length) {
    return null;
  }

  const productsWithPrices = mapped.products
    .map((product) => {
      const priceNumber = getMinPriceUSD(product.name);
      if (priceNumber === null) return null;
      const formattedPrice = formatUSD(priceNumber);
      if (!formattedPrice) return null;

      return {
        ...product,
        price: formattedPrice
      };
    })
    .filter(Boolean);

  if (productsWithPrices.length !== mapped.products.length) {
    return null;
  }

  return buildProductResponse({
    categoryLabel: mapped.categoryLabel,
    products: productsWithPrices
  });
};

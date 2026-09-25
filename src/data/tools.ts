export type ToolMode =
  | "ad"
  | "titles"
  | "descriptions"
  | "hashtags"
  | "whatsapp"
  | "price"
  | "improve";

export interface ToolDefinition {
  slug: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
  mode: ToolMode;
  action: string;
  tips: string[];
}

export const tools: ToolDefinition[] = [
  {
    slug: "crear-anuncio",
    name: "Creador de anuncios",
    title: "Crea un anuncio claro, con los detalles que importan",
    description:
      "Crea gratis tres títulos, descripciones y textos para WhatsApp, Marketplace e Instagram. Añade detalles por categoría y revisa la calidad de tu anuncio.",
    shortDescription:
      "Añade los datos de tu producto, revisa la vista previa y elige el texto para cada canal.",
    icon: "sparkles",
    color: "green",
    mode: "ad",
    action: "Crear mi anuncio",
    tips: [
      "Completa los campos de tu categoría: ayudan a responder las dudas de quien compra.",
      "Describe también los detalles de uso o defectos: la claridad genera confianza.",
      "Revisa el resultado y acompáñalo con fotografías actuales de tu producto.",
    ],
  },
  {
    slug: "generador-titulos",
    name: "Generador de títulos",
    title: "El primer paso para que se fijen en tu anuncio",
    description:
      "Genera títulos claros para tus productos con marca, modelo y características relevantes. Compara opciones para Marketplace, Instagram y otras redes.",
    shortDescription: "Compara tres opciones con los datos que identifican tu producto.",
    icon: "type",
    color: "blue",
    mode: "titles",
    action: "Generar títulos",
    tips: [
      "Empieza por el producto y añade la marca o el modelo si aportan información.",
      "Elige una característica concreta, como capacidad o tamaño.",
      "Evita las mayúsculas excesivas y las promesas que no puedas comprobar.",
    ],
  },
  {
    slug: "generador-descripciones",
    name: "Generador de descripciones",
    title: "Dale a tu producto una descripción completa",
    description:
      "Organiza las características, el estado y la entrega de tu producto en una descripción de venta fácil de leer. Herramienta gratuita y sin registro.",
    shortDescription: "Presenta el estado, las características y la entrega en un texto claro.",
    icon: "align",
    color: "purple",
    mode: "descriptions",
    action: "Generar descripción",
    tips: [
      "Separa las especificaciones técnicas de las condiciones de entrega.",
      "Explica qué incluye la compra sin dar por supuestos los accesorios.",
      "Una descripción útil responde dudas; no necesita exagerar beneficios.",
    ],
  },
  {
    slug: "generador-hashtags",
    name: "Generador de hashtags",
    title: "Encuentra hashtags relacionados con lo que vendes",
    description:
      "Crea hashtags relevantes según tu producto, categoría, marca y ubicación. Copia una selección para acompañar tus publicaciones en redes sociales.",
    shortDescription: "Añade etiquetas relevantes para tu producto y su categoría.",
    icon: "hash",
    color: "orange",
    mode: "hashtags",
    action: "Generar hashtags",
    tips: [
      "Selecciona las etiquetas que realmente describan el producto.",
      "Una etiqueta de ubicación puede ayudar a contextualizar una venta local.",
      "Los hashtags no garantizan alcance: acompáñalos con una publicación clara.",
    ],
  },
  {
    slug: "texto-whatsapp",
    name: "Texto para WhatsApp",
    title: "Presenta tu producto en un mensaje fácil de compartir",
    description:
      "Prepara un texto corto de venta para WhatsApp con producto, precio, estado y entrega. Cópialo y compártelo tú mismo con las personas interesadas.",
    shortDescription: "Resume tu oferta en un mensaje breve, fácil de leer y compartir.",
    icon: "message",
    color: "green",
    mode: "whatsapp",
    action: "Crear texto para WhatsApp",
    tips: [
      "Pon el nombre y el precio al principio para facilitar la lectura.",
      "Comparte el mensaje con personas que quieran recibirlo.",
      "Añade una foto nítida y contesta las preguntas con datos concretos.",
    ],
  },
  {
    slug: "calculadora-precio-venta",
    name: "Calculadora de precio",
    title: "Calcula un precio que tenga en cuenta tus costos",
    description:
      "Calcula el precio de venta según tus costos, gastos, comisión y margen deseado. Consulta el desglose y distingue margen de beneficio y recargo.",
    shortDescription: "Ten en cuenta tus costos, comisiones y el margen que buscas.",
    icon: "calculator",
    color: "teal",
    mode: "price",
    action: "Calcular precio de venta",
    tips: [
      "Incluye embalaje, transporte y otros gastos que asumas por unidad.",
      "El margen se calcula sobre el precio de venta, no sobre el costo.",
      "Compara también el estado del producto y los precios de ofertas similares.",
    ],
  },
  {
    slug: "mejorar-anuncio",
    name: "Mejorar mi anuncio",
    title: "Haz que tu anuncio sea más fácil de leer",
    description:
      "Ordena el texto de tu anuncio y recibe sugerencias concretas sobre información que falta. Mejora su legibilidad sin inventar datos del producto.",
    shortDescription: "Ordena un texto que ya tienes y descubre qué información le falta.",
    icon: "edit",
    color: "rose",
    mode: "improve",
    action: "Mejorar mi anuncio",
    tips: [
      "Pega el texto completo para conservar todos sus datos.",
      "Comprueba las sugerencias y añade solo información verdadera.",
      "Revisa siempre precios, teléfonos y condiciones antes de publicarlo.",
    ],
  },
];

export const homeFaq = [
  {
    question: "¿Las herramientas son realmente gratuitas?",
    answer:
      "Sí. Puedes crear y copiar los textos sin pagar y sin abrir una cuenta. También puedes utilizar las herramientas por separado tantas veces como necesites.",
  },
  {
    question: "¿Puedo usar los anuncios en Facebook Marketplace o Instagram?",
    answer:
      "Sí. Puedes copiar el resultado, adaptarlo y publicarlo en Marketplace, Instagram, WhatsApp u otros canales. Comprueba las normas de cada plataforma y acompaña el texto con tus propias fotos.",
  },
  {
    question: "¿Necesito registrarme para crear un anuncio?",
    answer:
      "No. Completa la información de tu producto y genera el texto directamente. Los datos del formulario se procesan en tu navegador y no se guardan al cerrar o recargar la página.",
  },
  {
    question: "¿Cómo se generan los textos?",
    answer:
      "Los textos se adaptan a la categoría, el estado y los detalles que introduces. Puedes comparar tres títulos y copiar versiones para distintos canales. Revisa el resultado y añade solo información que corresponda a tu producto.",
  },
  {
    question: "¿Qué significa la calidad de mi anuncio?",
    answer:
      "El puntaje de 0 a 100 te orienta sobre la información que has completado. Las recomendaciones indican qué datos puedes añadir, como el modelo, las características o la entrega. No es una predicción de ventas.",
  },
  {
    question: "¿Véndelo Mejor publica el anuncio por mí?",
    answer:
      "No. Tú decides dónde, cuándo y con quién compartirlo. Cada resultado tiene un botón para copiarlo y publicarlo por tu cuenta.",
  },
];

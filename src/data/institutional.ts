type InstitutionalPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: {
    title: string;
    paragraphs: string[];
  }[];
};

// LEGAL_REVIEW: These are initial texts, not a legal assessment. Before public
// launch, confirm the operator's identity, address, applicable jurisdiction,
// required legal notices, and an effective contact channel with qualified advice.
export const institutionalPages: InstitutionalPage[] = [
  {
    slug: "nosotros",
    title: "Herramientas simples para vender mejor",
    description:
      "Conoce Véndelo Mejor: herramientas gratuitas para organizar la información de tus productos y escribir anuncios claros.",
    intro:
      "Véndelo Mejor nace para ayudar a quienes venden por su cuenta a presentar sus productos con más claridad y dedicar menos tiempo a redactar cada publicación.",
    sections: [
      {
        title: "Publica mejor. Vende más fácil.",
        paragraphs: [
          "Un buen anuncio responde las preguntas importantes: qué vendes, cuánto cuesta, en qué estado se encuentra y cómo se entrega. Nuestras herramientas te ayudan a poner esa información en orden.",
          "Puedes preparar títulos, descripciones, mensajes para WhatsApp y listas de hashtags, además de calcular un precio a partir de tus costos y el margen que buscas.",
        ],
      },
      {
        title: "Herramientas gratuitas y prácticas",
        paragraphs: [
          "No necesitas crear una cuenta. Los textos se elaboran con plantillas y reglas a partir de lo que escribes; esta versión no utiliza servicios externos de inteligencia artificial.",
          "El resultado es un punto de partida: revísalo, añade los detalles que conozcas y elimina cualquier afirmación que no describa tu producto.",
        ],
      },
      {
        title: "Información honesta para compradores reales",
        paragraphs: [
          "Promovemos anuncios que expliquen el estado real del producto, sus características y sus condiciones de entrega. Una descripción clara ayuda a reducir dudas, pero ninguna herramienta puede garantizar una venta.",
          "Véndelo Mejor es un proyecto independiente. No gestiona compras, pagos ni entregas, y no representa a Facebook, WhatsApp, Instagram ni a otras plataformas mencionadas.",
        ],
      },
    ],
  },

  {
    slug: "contacto",
    title: "Contacto",
    description:
      "Información para comunicar sugerencias, reportar problemas y consultar sobre el funcionamiento de Véndelo Mejor.",
    intro:
      "Tus comentarios nos ayudan a mejorar las herramientas y hacerlas más útiles para quienes venden productos en internet.",
    sections: [
      {
        title: "Consultas y sugerencias",
        paragraphs: [
          "Puedes contarnos qué herramienta te gustaría encontrar, señalar un texto confuso o explicar qué parte del proceso de publicación te resulta difícil.",
          "Si encuentras un problema, incluye el nombre de la herramienta, el dispositivo o navegador y los pasos que seguiste. Utiliza datos de ejemplo y evita compartir información privada de compradores o vendedores.",
        ],
      },
      {
        title: "Alcance de la ayuda",
        paragraphs: [
          "Podemos atender consultas sobre Véndelo Mejor. Los reclamos relacionados con compras, cuentas, pagos o publicaciones en otras plataformas deben dirigirse a sus respectivos canales de soporte.",
        ],
      },
      {
        title: "Canal de atención",
        paragraphs: [
          // LEGAL_REVIEW: Set CONTACT_EMAIL to a real, monitored email address.
          "El correo de atención configurado para Véndelo Mejor se muestra en esta página cuando está disponible.",
          "No hay un formulario de envío en esta versión. Cuando escribas al correo publicado, comparte únicamente la información necesaria para atender tu consulta.",
        ],
      },
    ],
  },

  {
    slug: "politica-privacidad",
    title: "Política de privacidad",
    description:
      "Consulta cómo Véndelo Mejor trata la información de los formularios y los datos de medición utilizados para mejorar el sitio.",
    intro:
      "Esta política describe el funcionamiento actual de Véndelo Mejor. Las herramientas pueden utilizarse sin crear una cuenta y los anuncios generados no se almacenan en una base de datos.",
    sections: [
      {
        title: "Información que introduces en las herramientas",
        paragraphs: [
          "Los nombres de productos, precios, características y demás datos que introduces en los formularios se procesan en tu navegador para generar los resultados. Véndelo Mejor no guarda esos anuncios en una base de datos ni utiliza su contenido para entrenar modelos de inteligencia artificial.",
          "Al utilizar el botón de copiar, el texto seleccionado se envía al portapapeles de tu dispositivo. Su tratamiento posterior depende del sistema operativo y de las aplicaciones en las que decidas pegarlo.",
          "Evita introducir documentos de identidad, datos bancarios, contraseñas, direcciones particulares exactas u otra información sensible.",
        ],
      },
      {
        title: "Google Analytics",
        paragraphs: [
          "Véndelo Mejor utiliza Google Analytics 4 para conocer de forma agregada cómo se utiliza el sitio y mejorar sus herramientas.",
          "Este servicio permite medir información como visitas, sesiones, páginas consultadas, interacciones con el sitio, ubicación geográfica aproximada e información técnica del navegador y del dispositivo.",
          "Google Analytics puede utilizar cookies propias, como _ga, para distinguir usuarios y sesiones.",
          "La información recopilada mediante Analytics se utiliza para comprender el funcionamiento de la web y mejorar la experiencia de uso.",
          "Los datos que escribes dentro del creador de anuncios no se envían a Google Analytics como contenido de tus formularios.",
        ],
      },
      {
        title: "Información técnica y alojamiento",
        paragraphs: [
          "Véndelo Mejor está alojado actualmente en la plataforma Netlify.",
          "Como proveedor de infraestructura, Netlify puede procesar información técnica necesaria para entregar y proteger el sitio, como solicitudes de red, información del navegador, fechas de acceso y otros datos técnicos relacionados con el funcionamiento del servicio.",
          "La dirección pública actual del proyecto es vendelo-mejor.netlify.app. Si en el futuro cambia el proveedor de alojamiento o el dominio, esta política podrá actualizarse.",
        ],
      },
      {
        title: "Comunicaciones por correo",
        paragraphs: [
          "Si nos escribes al correo de contacto publicado en el sitio, recibiremos tu dirección de correo electrónico y el contenido del mensaje para poder atender tu consulta.",
          "No incluyas información personal o confidencial que no sea necesaria para resolver tu solicitud.",
        ],
      },
      {
        title: "Publicidad",
        paragraphs: [
          "Actualmente Véndelo Mejor no muestra anuncios reales de Google AdSense.",
          "Los espacios reservados para publicidad que puedan existir dentro del diseño son únicamente espacios preparados para una futura integración y no muestran publicidad por sí mismos.",
          "Si se incorpora Google AdSense u otro servicio publicitario en el futuro, esta política será actualizada para informar sobre los servicios utilizados, los datos implicados y los controles disponibles para los usuarios.",
        ],
      },
      {
        title: "Cambios en esta política",
        paragraphs: [
          "Esta política puede actualizarse cuando se añadan nuevas funcionalidades, servicios de terceros o cambios relacionados con el tratamiento de información.",
          "La versión publicada en esta página será la referencia vigente del funcionamiento de Véndelo Mejor.",
        ],
      },
    ],
  },

  {
    slug: "terminos",
    title: "Términos de uso",
    description:
      "Conoce las condiciones de uso de las herramientas gratuitas de Véndelo Mejor y las responsabilidades al publicar tus anuncios.",
    intro:
      "Véndelo Mejor ofrece herramientas de apoyo para redactar anuncios y realizar cálculos orientativos. El uso de la plataforma es gratuito en esta versión.",
    sections: [
      {
        title: "Uso de las herramientas",
        paragraphs: [
          "Puedes utilizar los resultados como base para tus propias publicaciones. Comprueba antes de publicarlos que el producto, el precio, el estado, las características y las condiciones de entrega sean correctos.",
          "No utilices las herramientas para elaborar ofertas engañosas, suplantar identidades, infringir derechos de terceros ni promocionar productos cuya venta esté prohibida. Respeta las reglas del canal donde publiques.",
        ],
      },
      {
        title: "Resultados y cálculos orientativos",
        paragraphs: [
          "Los textos se generan mediante reglas y plantillas. Pueden necesitar correcciones o detalles adicionales y no constituyen una verificación del producto ni una recomendación sobre su legalidad.",
          "La calculadora depende de los costos, porcentajes y demás datos que introduzcas. Revisa impuestos, comisiones, gastos y condiciones de tu actividad antes de fijar un precio. La herramienta no sustituye asesoramiento contable o financiero.",
          "La plataforma no garantiza ventas, visibilidad en otras plataformas ni una rentabilidad determinada.",
        ],
      },
      {
        title: "Publicaciones y operaciones con terceros",
        paragraphs: [
          "Véndelo Mejor no publica anuncios por ti ni interviene en las negociaciones, los pagos, las entregas o las garantías de los productos. Esas condiciones deben acordarse directamente entre las partes.",
          "Los nombres de plataformas y marcas se mencionan para explicar el contexto de uso. Sus servicios tienen condiciones propias y no existe una afiliación implícita con Véndelo Mejor.",
        ],
      },
      {
        title: "Disponibilidad y cambios",
        paragraphs: [
          "Las funciones pueden evolucionar y el sitio puede presentar interrupciones por mantenimiento o incidencias técnicas. Conserva por tu cuenta los textos que quieras reutilizar, ya que esta versión no ofrece un historial guardado.",
          // LEGAL_REVIEW: Confirm enforceable terms, intellectual-property
          // notices, consumer rights, limits of responsibility and applicable law.
          "Las condiciones de uso podrán actualizarse cuando cambien las funciones de la plataforma o los servicios utilizados.",
        ],
      },
    ],
  },

  {
    slug: "cookies",
    title: "Información sobre cookies",
    description:
      "Consulta qué cookies y tecnologías de medición utiliza actualmente Véndelo Mejor y para qué se utilizan.",
    intro:
      "Véndelo Mejor utiliza Google Analytics para obtener estadísticas de uso del sitio. Las herramientas de creación de anuncios no necesitan cookies para procesar los datos que introduces.",
    sections: [
      {
        title: "Qué son las cookies",
        paragraphs: [
          "Las cookies son pequeños archivos que un sitio puede guardar en el navegador para recordar o asociar información entre visitas.",
          "También existen otras tecnologías de almacenamiento y medición que pueden cumplir funciones similares.",
        ],
      },
      {
        title: "Cookies de Google Analytics",
        paragraphs: [
          "Actualmente utilizamos Google Analytics 4 para medir visitas y comprender de forma agregada cómo se utiliza Véndelo Mejor.",
          "Google Analytics puede establecer cookies propias como _ga, utilizada para distinguir usuarios, y _ga_<identificador>, utilizada para mantener información relacionada con una sesión.",
          "Estas cookies permiten obtener estadísticas como número de visitas, páginas consultadas y comportamiento general dentro del sitio.",
          "Google establece periodos de duración para estas cookies, aunque estos pueden variar según la configuración del navegador, del usuario o de los servicios de Google.",
        ],
      },
      {
        title: "Datos de los formularios",
        paragraphs: [
          "Los datos que escribes para crear títulos, descripciones o anuncios se procesan en la memoria de la página mientras utilizas la herramienta.",
          "Véndelo Mejor no utiliza cookies propias para crear un historial de los productos o anuncios que hayas generado.",
          "Si recargas o cierras la página, los datos introducidos pueden perderse.",
        ],
      },
      {
        title: "Publicidad",
        paragraphs: [
          "Actualmente no utilizamos Google AdSense ni otras redes de publicidad.",
          "Los espacios visuales preparados para futura publicidad no cargan anuncios ni realizan solicitudes publicitarias por sí mismos.",
          "Si se incorpora publicidad posteriormente, esta página se actualizará para informar sobre las cookies o tecnologías adicionales que puedan utilizarse.",
        ],
      },
      {
        title: "Control de cookies",
        paragraphs: [
          "Puedes revisar, bloquear o eliminar cookies desde las opciones de privacidad de tu navegador.",
          "Los nombres y la ubicación de estas opciones dependen del navegador y del dispositivo que utilices.",
          "Bloquear determinadas cookies puede afectar algunas funciones de medición, aunque las herramientas principales de Véndelo Mejor pueden seguir funcionando.",
        ],
      },
      {
        title: "Cambios en el uso de cookies",
        paragraphs: [
          "Si Véndelo Mejor incorpora nuevos servicios de analítica, publicidad o tecnologías similares, esta información será actualizada para reflejar esos cambios.",
        ],
      },
    ],
  },
];
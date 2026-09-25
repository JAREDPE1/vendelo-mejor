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
          // LEGAL_REVIEW: Set CONTACT_EMAIL to a real, monitored email address
          // before launch. The page renderer must display it when configured;
          // otherwise it must clearly identify the contact channel as pending.
          "Esta página mostrará el correo de atención cuando esté habilitado. Si todavía no aparece, el canal está pendiente de configuración y deberá estar disponible antes del lanzamiento público.",
          "No hay un formulario de envío en esta versión. Cuando escribas al correo publicado, comparte únicamente la información necesaria para atender tu consulta.",
        ],
      },
    ],
  },
  {
    slug: "politica-privacidad",
    title: "Política de privacidad",
    description:
      "Consulta cómo funciona el tratamiento de información en la versión actual de Véndelo Mejor y qué ocurre con los datos de tus anuncios.",
    intro:
      "Esta política describe la versión actual de Véndelo Mejor. Las herramientas funcionan sin cuentas de usuario ni una base de datos de anuncios.",
    sections: [
      {
        title: "Información que introduces en las herramientas",
        paragraphs: [
          "Los nombres de productos, precios, características y demás datos de los formularios se procesan en la memoria de tu navegador para generar los resultados. La aplicación no los envía a un servidor, no los guarda en una base de datos y no los utiliza para entrenar modelos de inteligencia artificial.",
          "Esta versión no guarda tus anuncios en cookies ni en el almacenamiento local del navegador. Al usar un botón de copiar, el texto seleccionado se escribe en el portapapeles de tu dispositivo; su gestión posterior depende del sistema operativo y de las aplicaciones que utilices.",
          "Evita introducir documentos de identidad, datos bancarios, direcciones particulares precisas u otra información sensible. Comparte en tus anuncios solo los datos que quieras hacer públicos.",
        ],
      },
      {
        title: "Información técnica del alojamiento",
        paragraphs: [
          // LEGAL_REVIEW: Identify the actual hosting provider and processors;
          // verify IP/access logs, purposes, lawful basis, retention, security,
          // international transfers and safeguards before publishing this text.
          "El proveedor que aloje el sitio puede tratar información técnica de las solicitudes, como direcciones IP, fechas de acceso y datos del navegador, para prestar y proteger el servicio. Este tratamiento depende de la configuración del alojamiento.",
          "Los detalles del proveedor, los plazos de conservación y las condiciones aplicables deberán completarse antes del lanzamiento público.",
        ],
      },
      {
        title: "Comunicaciones por correo",
        paragraphs: [
          // LEGAL_REVIEW: Confirm controller identity and contact details,
          // email provider, lawful basis, retention/deletion period and how
          // applicable access, correction, deletion and other rights are handled.
          "Cuando esté habilitado el correo de contacto y nos escribas, recibiremos tu dirección y el contenido del mensaje para atender la consulta. No incluyas información que no sea necesaria para ese propósito.",
          "La identificación del responsable y el procedimiento para ejercer los derechos que correspondan deberán estar disponibles antes del lanzamiento público. El canal de contacto se publicará en la página Contacto.",
        ],
      },
      {
        title: "Publicidad y servicios externos",
        paragraphs: [
          "Actualmente la aplicación no incorpora anuncios de Google AdSense, herramientas de analítica ni scripts de seguimiento publicitario. Los espacios reservados para publicidad son elementos visuales y no cargan anuncios.",
          // LEGAL_REVIEW: Before enabling AdSense or any analytics/tracking,
          // reassess data flows, disclosures, vendor terms, user rights and any
          // consent requirements applicable to users and the operator. Do not
          // load nonessential technologies before required consent is obtained.
          "Si se incorporan servicios publicitarios o de medición, esta política deberá actualizarse para explicar qué datos tratan y qué controles estarán disponibles. Se solicitará consentimiento cuando sea necesario.",
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
          // notices, consumer rights, limits of responsibility and the mechanism
          // for communicating material changes. Do not invent a governing law,
          // jurisdiction or waive rights that applicable law protects.
          "Estos términos deberán revisarse antes del lanzamiento público para identificar al operador y precisar las condiciones legales aplicables, sin limitar los derechos que reconozca la legislación correspondiente.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Información sobre cookies",
    description:
      "Información sobre cookies, almacenamiento del navegador y los cambios previstos si Véndelo Mejor incorpora publicidad o analítica.",
    intro:
      "La versión actual de la aplicación no instala cookies ni utiliza almacenamiento local para guardar anuncios, preferencias o identificadores de seguimiento.",
    sections: [
      {
        title: "Qué son las cookies",
        paragraphs: [
          "Las cookies son pequeños archivos que un sitio puede guardar en el navegador para recordar información entre visitas. Otras tecnologías, como el almacenamiento local, también pueden conservar datos en el dispositivo.",
        ],
      },
      {
        title: "Funcionamiento actual",
        paragraphs: [
          "Los datos de los formularios y los resultados permanecen en la memoria de la página mientras la utilizas. Las herramientas no necesitan cookies para generar los textos o realizar cálculos.",
          "La aplicación no carga analítica, píxeles de seguimiento ni anuncios reales. Los espacios identificados para futura publicidad no almacenan información ni contactan con una red publicitaria.",
          // LEGAL_REVIEW: Audit the deployed host, CDN and every integration
          // for cookies and comparable technologies; distinguish provider-level
          // behavior from application behavior and update this inventory.
          "Antes del lanzamiento público deberá verificarse también el comportamiento del proveedor de alojamiento y de cualquier integración añadida.",
        ],
      },
      {
        title: "Si se añade publicidad o medición",
        paragraphs: [
          // LEGAL_REVIEW: Complete the provider/purpose/duration inventory and
          // implement the applicable consent and withdrawal controls before
          // adding AdSense, analytics or nonessential browser storage. Verify
          // current regional and Google requirements with qualified advice.
          "Si se incorporan Google AdSense, servicios de analítica u otras tecnologías, esta página deberá indicar sus proveedores, finalidades y duración. También deberán habilitarse los controles de consentimiento que correspondan antes de su activación.",
        ],
      },
      {
        title: "Controles del navegador",
        paragraphs: [
          "Puedes revisar, bloquear o eliminar cookies desde los ajustes de privacidad de tu navegador. Los nombres de esas opciones varían según el navegador y el dispositivo.",
          "Si tienes dudas sobre el funcionamiento de este sitio, consulta la política de privacidad y el canal disponible en la página Contacto.",
        ],
      },
    ],
  },
];

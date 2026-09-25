export interface CategoryGuide {
  slug: string;
  key: "celulares" | "laptops" | "motos" | "autos" | "muebles" | "electrodomesticos";
  name: string;
  title: string;
  description: string;
  intro: string;
  icon: "phone" | "laptop" | "motorbike" | "car" | "sofa" | "appliance";
  accent: "blue" | "purple" | "orange" | "teal" | "rose" | "green";
  checklist: string[];
  sections: { title: string; body: string }[];
  example: { title: string; description: string };
  faq: { question: string; answer: string }[];
}

export const categories: CategoryGuide[] = [
  {
    slug: "vender-celulares",
    key: "celulares",
    name: "Celulares",
    title: "Cómo vender tu celular con un anuncio claro",
    description:
      "Prepara tu celular para venderlo: qué datos incluir, cómo mostrar su estado y qué revisar antes de entregarlo. Crea un anuncio claro y completo.",
    intro:
      "La capacidad, la batería y el estado de la pantalla importan más que una lista de adjetivos. Ayuda a quien compra a entender exactamente qué recibirá.",
    icon: "phone",
    accent: "blue",
    checklist: [
      "Marca, modelo y capacidad de almacenamiento.",
      "Estado de pantalla, cámaras, botones y puerto de carga.",
      "Información de batería disponible y fecha de la revisión.",
      "Reparaciones o piezas cambiadas que conozcas.",
      "Accesorios incluidos y fotos reales de sus detalles.",
    ],
    sections: [
      {
        title: "Describe lo que puedes comprobar",
        body: "Consulta el modelo y el almacenamiento en los ajustes. Prueba llamadas, cámaras, sonido y carga. Si no has comprobado una función, indícalo. Publica el porcentaje de salud de batería solo si el equipo lo muestra; no lo confundas con el nivel de carga.",
      },
      {
        title: "Fotografía también las marcas de uso",
        body: "Muestra el frente con la pantalla encendida, la parte posterior y los bordes con buena luz. Añade una foto cercana de rayones o golpes. Oculta las notificaciones, los contactos y los números de serie o IMEI en las fotos públicas.",
      },
      {
        title: "Prepara una entrega sin datos personales",
        body: "Antes de entregar el equipo, guarda una copia de tus datos y sigue las instrucciones del fabricante para cerrar tus cuentas, retirar bloqueos vinculados y restablecerlo. Retira la tarjeta SIM y cualquier memoria propia. Acuerda cómo podrá revisarlo la persona interesada.",
      },
    ],
    example: {
      title: "Celular de 128 GB usado, con cargador y funda",
      description:
        "Equipo usado con pantalla sin grietas y marcas visibles en los bordes. Cámaras, sonido y carga probados. Incluye cargador y funda. Puedo enviar fotos de los detalles y coordinar una revisión antes de la entrega.",
    },
    faq: [
      {
        question: "¿Debo publicar el IMEI de mi celular?",
        answer:
          "Evita mostrarlo completo en un anuncio público. Describe el modelo y sus características, y acuerda una verificación pertinente durante la revisión sin exponer identificadores innecesariamente.",
      },
      {
        question: "¿Cómo describo una batería que dura poco?",
        answer:
          "Dilo de forma directa y explica tu experiencia de uso. Por ejemplo: ‘Con uso frecuente necesito cargarlo durante el día’. No prometas una autonomía exacta que no hayas medido.",
      },
    ],
  },
  {
    slug: "vender-laptops",
    key: "laptops",
    name: "Laptops",
    title: "Cómo publicar una laptop con sus datos importantes",
    description:
      "Aprende qué especificaciones, fotos y pruebas incluir al vender una laptop. Explica su estado, los accesorios y los detalles que debe conocer el comprador.",
    intro:
      "Una laptop se entiende mejor con especificaciones precisas y pruebas concretas. Explica su configuración actual, su desgaste y lo que incluyes con la venta.",
    icon: "laptop",
    accent: "purple",
    checklist: [
      "Modelo exacto y procesador, incluida su generación si la conoces.",
      "Memoria RAM y capacidad y tipo de almacenamiento.",
      "Tamaño y estado de la pantalla, teclado y bisagras.",
      "Funcionamiento de puertos, cámara, conexión y cargador.",
      "Duración observada de batería y reparaciones conocidas.",
    ],
    sections: [
      {
        title: "Distingue memoria y almacenamiento",
        body: "La RAM y la capacidad del disco son datos diferentes: escribe ambos por separado. Verifica la configuración actual en el sistema, especialmente si cambiaste componentes. Evita copiar la ficha de otra versión del mismo modelo.",
      },
      {
        title: "Cuenta cómo funciona hoy",
        body: "Comprueba el teclado, el panel táctil, los puertos y las bisagras. Si mencionas la batería, explica en qué actividad observaste esa duración. No prometas rendimiento para programas o juegos que no hayas probado en esta configuración.",
      },
      {
        title: "Muestra el equipo y protege tus archivos",
        body: "Fotografía la pantalla encendida, el teclado y los laterales. Cierra documentos y oculta datos de cuentas en las capturas. Antes de entregarla, respalda tus archivos y utiliza el procedimiento del fabricante para borrar tus datos. Indica si incluye cargador y qué software se entrega realmente.",
      },
    ],
    example: {
      title: "Laptop de 14 pulgadas, 8 GB de RAM y SSD de 256 GB",
      description:
        "Laptop usada con teclado y puertos USB probados. Tiene marcas de uso en la tapa y una pequeña marca en el reposamanos, visibles en las fotos. Incluye cargador. La batería requiere cargas frecuentes; se puede revisar encendida al coordinar la entrega.",
    },
    faq: [
      {
        question: "¿Qué hago si no recuerdo el procesador?",
        answer:
          "Revísalo en la información del sistema y copia el nombre exacto. Es mejor dejar un dato pendiente que anunciar una configuración que corresponde a otra laptop.",
      },
      {
        question: "¿Puedo decir que sirve para diseño o videojuegos?",
        answer:
          "Describe programas o juegos que hayas probado y las condiciones de uso. Incluye las especificaciones para que cada persona evalúe si el equipo cubre sus necesidades.",
      },
    ],
  },
  {
    slug: "vender-motos",
    key: "motos",
    name: "Motos",
    title: "Cómo preparar un anuncio para vender tu moto",
    description:
      "Redacta un anuncio de moto con modelo, año, kilometraje y mantenimiento. Aprende qué fotos tomar y cómo compartir información sin exponer documentos.",
    intro:
      "Quien busca una moto necesita conocer su uso y mantenimiento, además de su apariencia. Un anuncio concreto permite coordinar una revisión con expectativas claras.",
    icon: "motorbike",
    accent: "orange",
    checklist: [
      "Marca, modelo, año y cilindrada comprobados.",
      "Lectura actual del odómetro y uso habitual.",
      "Mantenimientos realizados y comprobantes disponibles.",
      "Estado observado de llantas, luces, frenos y transmisión.",
      "Modificaciones, caídas o reparaciones conocidas.",
      "Accesorios incluidos y condiciones para una revisión.",
    ],
    sections: [
      {
        title: "Explica el uso y el mantenimiento",
        body: "Indica si la usabas para traslados cotidianos, trabajo o recorridos ocasionales. Anota el kilometraje que muestra el tablero y la fecha de lectura. Si no conoces su historial completo, acláralo. Menciona servicios concretos con sus fechas en lugar de decir solo ‘mantenimiento al día’.",
      },
      {
        title: "Deja ver sus puntos importantes",
        body: "Toma fotos de ambos lados, tablero, llantas y detalles de desgaste. Describe ruidos, pérdidas de fluidos o fallas que hayas detectado. Un video breve de encendido puede aportar contexto, pero no sustituye la revisión mecánica que acuerden las partes.",
      },
      {
        title: "Coordina la revisión y la documentación",
        body: "Explica qué documentación tienes disponible para revisar y evita publicar fotos completas con datos personales, firmas o identificadores. Acuerda con anticipación las condiciones de una inspección o prueba. Consulta el proceso de transferencia aplicable en tu localidad antes de concretar la venta.",
      },
    ],
    example: {
      title: "Moto de 150 cc, año 2021, con 24 000 km en el tablero",
      description:
        "Moto usada para traslados diarios. Tiene rayones en el lateral derecho, mostrados en las fotos. Incluye parrilla posterior. Puedo compartir los mantenimientos que tengo registrados y coordinar una revisión mecánica. Kilometraje sujeto al uso hasta la venta.",
    },
    faq: [
      {
        question: "¿Conviene mencionar una caída anterior?",
        answer:
          "Sí. Explica qué ocurrió, qué piezas se repararon o cambiaron y qué detalles permanecen. Las fotos y comprobantes que tengas ayudan a describirlo con precisión.",
      },
      {
        question: "¿Cómo informo el kilometraje si todavía la uso?",
        answer:
          "Escribe la lectura del tablero y su fecha, y aclara que puede aumentar porque la moto sigue en uso. Actualiza el dato cuando cambie de forma relevante.",
      },
    ],
  },
  {
    slug: "vender-autos",
    key: "autos",
    name: "Autos",
    title: "Cómo escribir un anuncio completo para vender tu auto",
    description:
      "Organiza los datos de tu auto, su historial y las fotos del interior y exterior. Crea un anuncio que facilite preguntas útiles y una revisión informada.",
    intro:
      "La versión exacta, el historial que conoces y las fotos de cada zona ayudan a evaluar un auto. Presenta la información en un orden fácil de comparar.",
    icon: "car",
    accent: "teal",
    checklist: [
      "Marca, modelo, versión y año del vehículo.",
      "Transmisión, combustible y motorización comprobados.",
      "Lectura del odómetro y fecha de referencia.",
      "Mantenimientos, reparaciones y daños conocidos.",
      "Estado del interior y equipamiento que funciona.",
      "Qué incluye la venta y disponibilidad para inspección.",
    ],
    sections: [
      {
        title: "Identifica la versión que vendes",
        body: "Un mismo modelo puede tener versiones con equipamiento distinto. Verifica la transmisión, el combustible y los accesorios presentes en tu auto. No copies prestaciones de otra versión ni describas como original un accesorio agregado posteriormente.",
      },
      {
        title: "Ordena el historial con fechas",
        body: "Resume los servicios y reparaciones que puedas documentar, y distingue lo que sabes de lo que te contó un propietario anterior. Describe daños o trabajos de carrocería conocidos. Evita frases absolutas como ‘sin ningún detalle’ si hay aspectos que no has revisado.",
      },
      {
        title: "Fotografía el recorrido completo",
        body: "Incluye exterior desde varias esquinas, asientos, tablero, maletero y detalles de desgaste. Retira objetos personales y oculta datos privados en documentos o pantallas. Facilita una inspección independiente acordada y verifica los requisitos locales de transferencia antes de la entrega.",
      },
    ],
    example: {
      title: "Auto sedán 2018, transmisión manual, 82 000 km",
      description:
        "Auto usado con transmisión manual. Presenta desgaste en el asiento del conductor y una marca en el parachoques posterior, visibles en las fotos. Se pueden revisar los registros de mantenimiento disponibles y coordinar una inspección. El kilometraje puede variar por uso.",
    },
    faq: [
      {
        question: "¿Debo incluir fotos de todos los documentos?",
        answer:
          "No necesitas publicarlos completos. Indica qué información está disponible y compártela para una verificación pertinente, protegiendo datos personales y firmas.",
      },
      {
        question: "¿Qué diferencia hay entre año y versión?",
        answer:
          "El año identifica un dato temporal del vehículo; la versión distingue su configuración o equipamiento. Comprueba ambos en la información disponible del auto y aclara cualquier dato que no puedas confirmar.",
      },
    ],
  },
  {
    slug: "vender-muebles",
    key: "muebles",
    name: "Muebles",
    title: "Cómo vender muebles mostrando medidas y detalles",
    description:
      "Publica tus muebles con medidas útiles, fotos claras y condiciones de recojo. Explica materiales, desgaste y acceso para facilitar una compra informada.",
    intro:
      "Un mueble puede gustar en una foto y no caber en casa. Las medidas, los materiales y las condiciones de recojo son tan importantes como su apariencia.",
    icon: "sofa",
    accent: "rose",
    checklist: [
      "Ancho, alto y fondo con la misma unidad de medida.",
      "Material, color y acabado que puedas identificar.",
      "Estado de patas, uniones, cajones o tapizado.",
      "Manchas, rayones, piezas faltantes o reparaciones.",
      "Posibilidad de desmontarlo y piezas incluidas.",
      "Piso, acceso y condiciones de recojo o transporte.",
    ],
    sections: [
      {
        title: "Mide pensando en el traslado",
        body: "Anota ancho, alto y fondo; para un sofá, añade la altura del asiento si resulta útil. Indica si las patas se retiran o si el mueble se desmonta. Describe escaleras, ascensor y accesos del lugar de recojo para que la persona compradora pueda planificar el transporte.",
      },
      {
        title: "Describe el material sin adivinar",
        body: "Distingue madera maciza, tablero u otros materiales solo si los conoces. Muestra uniones, bordes y la parte posterior. En muebles tapizados, fotografía manchas o desgaste y menciona olores persistentes o reparaciones que puedan influir en la decisión.",
      },
      {
        title: "Aclara qué incluye el precio",
        body: "Especifica si vendes una pieza o un conjunto y si cojines, sillas o accesorios están incluidos. Acuerda quién desmonta, carga y transporta el mueble. Publica una zona aproximada y comparte la dirección exacta cuando el recojo esté coordinado.",
      },
    ],
    example: {
      title: "Escritorio de 120 × 60 cm con dos cajones",
      description:
        "Escritorio usado de 120 cm de ancho, 60 cm de fondo y 75 cm de alto. Los dos cajones abren correctamente. Tiene un rayón en la cubierta, visible en las fotos. Recojo en primer piso; transporte a cargo de quien compra. No incluye silla.",
    },
    faq: [
      {
        question: "¿Qué medidas debo poner en el anuncio?",
        answer:
          "Como mínimo, ancho, alto y fondo, identificados con su unidad. Si el mueble se abre o extiende, agrega las medidas en ambas posiciones.",
      },
      {
        question: "¿Cómo evito confusiones con el envío?",
        answer:
          "Indica desde el anuncio si ofreces entrega o solo recojo y quién asume el costo. Confirma el acceso, la ayuda para cargar y las dimensiones antes de fijar la fecha.",
      },
    ],
  },
  {
    slug: "vender-electrodomesticos",
    key: "electrodomesticos",
    name: "Electrodomésticos",
    title: "Cómo anunciar electrodomésticos con información útil",
    description:
      "Explica capacidad, medidas y funcionamiento al vender electrodomésticos. Prepara fotos, detalla fallas y acuerda las condiciones de prueba y traslado.",
    intro:
      "Una lavadora, refrigeradora o cocina necesita algo más que una foto frontal. Explica qué funciones has comprobado, sus dimensiones y cómo se entregará.",
    icon: "appliance",
    accent: "green",
    checklist: [
      "Marca y modelo exactos de la etiqueta del equipo.",
      "Capacidad y medidas externas verificadas.",
      "Tipo de conexión y datos eléctricos indicados en la etiqueta.",
      "Funciones probadas, fallas y reparaciones conocidas.",
      "Accesorios, bandejas, mangueras u otras piezas incluidas.",
      "Condiciones de revisión, desconexión y transporte.",
    ],
    sections: [
      {
        title: "Verifica capacidad y conexiones",
        body: "Copia la capacidad y las características de la etiqueta o del manual del modelo exacto. No estimes el consumo ni prometas ahorro energético sin información verificable. Señala las medidas externas y los requisitos de conexión conocidos para que quien compra compruebe el espacio y la compatibilidad.",
      },
      {
        title: "Describe una prueba concreta",
        body: "Cuenta qué función probaste y cuándo: por ejemplo, un ciclo de lavado y centrifugado. Si una función falla o no se ha probado, escríbelo. Mostrar el equipo encendido no demuestra por sí solo que todas sus funciones operan correctamente.",
      },
      {
        title: "Planifica la entrega según el equipo",
        body: "Limpia las zonas accesibles siguiendo el manual y fotografía interior, controles y piezas incluidas. Aclara quién se encarga de desconectar y trasladar el aparato. Para instalación, transporte y puesta en marcha, consulta las instrucciones del fabricante y solicita ayuda técnica cuando corresponda.",
      },
    ],
    example: {
      title: "Lavadora de 8 kg usada, con manguera de entrada",
      description:
        "Lavadora usada de 8 kg. Se probaron un ciclo de lavado y el centrifugado. Tiene marcas en la cubierta y no incluye manguera de desagüe. Puedo facilitar las medidas y coordinar una revisión. Recojo y transporte por acordar.",
    },
    faq: [
      {
        question: "¿Puedo vender un equipo que tiene una falla?",
        answer:
          "Describe la falla de manera visible y precisa, e indica si se vende para reparar o como repuesto. No lo presentes como completamente funcional ni estimes el costo de reparación sin una evaluación.",
      },
      {
        question: "¿Qué fotos aportan más información?",
        answer:
          "Incluye vista general, interior, panel de controles, accesorios y cualquier daño. Si fotografías la etiqueta para mostrar el modelo, oculta el número de serie y otros identificadores innecesarios.",
      },
    ],
  },
];

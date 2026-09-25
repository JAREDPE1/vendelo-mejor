# Véndelo Mejor

Herramientas gratuitas para preparar anuncios en español. Next.js 16.3.6 estable, App Router, React 19, TypeScript estricto y Tailwind CSS 4. Sin base de datos, cuentas, API de IA ni anuncios reales.

## Ejecutar en Windows

Requiere Node.js 22.13 o posterior (se comprobó con Node.js 24.14.1) y npm.

```powershell
cd C:\Users\PC\Desktop\ventas
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Abre http://localhost:3000. Detén el servidor con `Ctrl+C`. El sufijo `.cmd` evita bloqueos de `npm.ps1` por la política de ejecución de PowerShell. En otros terminales puedes usar `npm`.

## Verificar y ejecutar la compilación de producción

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd start
```

No ejecutes `start` y `dev` en el mismo puerto. `typecheck` genera primero los tipos de rutas de Next.js. Las pruebas usan `node:test`, incluido en Node, sin instalar un framework de pruebas.

## Estructura

```text
src/
  app/
    layout.tsx              # Layout, idioma, metadata base, header y footer
    page.tsx                # Inicio
    crear-anuncio/page.tsx   # Herramienta principal
    [slug]/page.tsx          # Páginas estáticas derivadas de los datos
    globals.css             # Tailwind, identidad visual y responsive
    sitemap.ts              # Sitemap de las 19 páginas
    robots.ts               # Reglas según el dominio configurado
    icon.svg                # Icono de la marca
  components/
    ProductForm.tsx          # Formulario compartido y flujo de crear anuncio
    AdPreview.tsx            # Tarjeta de venta genérica que se actualiza al escribir
    AdQuality.tsx            # Puntaje y recomendaciones que llevan al campo
    AdResults.tsx            # Tres títulos y siete resultados copiables
    FormField.tsx            # Etiqueta, ayuda y error accesibles
    GeneratedResult.tsx      # Presentación reutilizable de cada resultado
    CopyButton.tsx           # Copia con alternativa de selección manual
                            # También header, footer y plantillas de páginas
  data/
    tools.ts                # Siete herramientas y preguntas frecuentes
    categories.ts           # Seis guías originales
    category-fields.ts      # Campos, etiquetas y restricciones por categoría
    institutional.ts        # Cinco páginas y comentarios LEGAL_REVIEW
  lib/
    generators.ts           # Datos del producto, generación y resúmenes por canal
    ad-templates.ts         # Variantes de presentación y cierre por categoría
    ad-quality.ts           # Heurística de información completa y específica
    product-validation.ts   # Validación compartida de los datos introducidos
    pricing.ts              # Precio con margen sobre venta y comisión
    seo.ts                  # Metadata individual y Open Graph
    site.ts                 # Dominio y contacto configurables
  types/product.ts          # Datos generales, detalles por categoría y resultados
tests/
  generators.test.ts        # Generación, conservación de hechos y cálculos
  ad-quality.test.ts        # Puntaje, recomendaciones y datos poco útiles
  product-validation.test.ts # Datos opcionales y restricciones numéricas
```

`[slug]` no es una página genérica indexable: `generateStaticParams` prerenderiza cada URL definida y `dynamicParams = false` devuelve 404 para cualquier otra. Cada herramienta conserva su URL, título, descripción, canonical y contenido propio. Esta organización evita duplicar archivos de páginas que solo cambian datos. El contenido editorial se renderiza en el servidor; solo los formularios, la copia y el menú móvil necesitan interactividad.

## Rutas

- `/`
- `/crear-anuncio`
- `/generador-titulos`
- `/generador-descripciones`
- `/generador-hashtags`
- `/texto-whatsapp`
- `/calculadora-precio-venta`
- `/mejorar-anuncio`
- `/vender-celulares`
- `/vender-laptops`
- `/vender-motos`
- `/vender-autos`
- `/vender-muebles`
- `/vender-electrodomesticos`
- `/nosotros`
- `/contacto`
- `/politica-privacidad`
- `/terminos`
- `/cookies`

También están disponibles `/sitemap.xml`, `/robots.txt` y una página 404.

## Herramienta principal: crear anuncio

En `/crear-anuncio` solo es obligatorio el nombre del producto. Precio, estado, marca, modelo, descripción, ubicación y entrega pueden completarse después. El estado comienza vacío: omitirlo nunca se interpreta como «Nuevo», «Como nuevo» ni «Usado». Los precios y los campos numéricos se validan cuando se introducen; los errores se muestran junto al campo y el formulario lleva el foco al primero que requiere corrección.

La categoría muestra campos opcionales específicos: memoria y batería para celulares; procesador y cargador para laptops; año, kilometraje y documentos para vehículos; material y medidas para muebles; capacidad y voltaje para electrodomésticos. `data/category-fields.ts` define tanto los controles como los datos admitidos por el generador. Los detalles se mantienen por categoría en memoria: al volver a una categoría se recupera lo escrito, pero sus datos no pasan al anuncio de otra categoría, aunque compartan una etiqueta como «RAM» o «Color». «Otros productos» permite usar los campos generales.

La vista previa y el puntaje se actualizan mientras escribes. La tarjeta muestra nombre, precio, estado, descripción corta y ubicación cuando existen; no completa datos ausentes. Al generar el anuncio se obtienen:

- Tres títulos sugeridos, cada uno con su botón de copia.
- Descripción corta y descripción completa.
- Lista de características.
- Textos para WhatsApp, Marketplace e Instagram.
- Hashtags.

Los siete resultados adicionales tienen copia individual cuando contienen texto. Si no hay características, se indica que faltan datos en lugar de inventar una lista. Puedes volver a generar para alternar presentaciones, cierres y el orden de los títulos. La redacción también se adapta a la categoría, al estado indicado y a la cantidad de información disponible. Si modificas el formulario después de generar, la interfaz avisa que debes actualizar los resultados.

«Calidad de tu anuncio» usa una heurística de 0 a 100 para valorar información completa y específica: identificación, precio, estado, características distintas, detalles de uso, ubicación y entrega. Rechaza algunos valores de relleno y no premia repetir un texto ni alargarlo. Solo evalúa los detalles de la categoría activa. Las recomendaciones dependen de lo que falta y permiten enfocar el campo correspondiente.

Las etiquetas son «Faltan datos» (0–29), «Anuncio básico» (30–49), «Puede mejorar» (50–69), «Buen anuncio» (70–84) y «Anuncio muy completo» (85–100). El puntaje no verifica la verdad de los datos, el estado del producto ni garantiza ventas. Los criterios y sus pesos están documentados en `lib/ad-quality.ts` para poder ajustarlos sin modificar la interfaz.

## Configuración antes de publicar

- `NEXT_PUBLIC_SITE_URL`: origen público real, por ejemplo `https://tu-dominio.com`, sin ruta, query ni credenciales. Se usa en canonical, Open Graph, Schema.org y sitemap. Si falta o apunta a localhost, la versión queda con `noindex` y `robots.txt` bloquea el rastreo. El modo local no está preparado para indexarse; configura el dominio y recompila para producción.
- `CONTACT_EMAIL`: correo real atendido por el operador. Hasta configurarlo, Contacto indica que el canal está pendiente; no hay un formulario que simule enviar mensajes.
- Revisar los comentarios `LEGAL_REVIEW` en `src/data/institutional.ts`. Completar identidad del responsable, datos de contacto, jurisdicción, alojamiento, tratamiento de registros, derechos y plazos aplicables. Son textos iniciales, no textos legales definitivos.
- `NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS=true`: muestra solo los espacios visuales de publicidad para revisar el diseño. Está desactivado por defecto. Hay una ubicación al final del inicio y otra después de cada herramienta; no se desplazan los controles por anuncios.
- Al cambiar variables utilizadas en páginas estáticas, reinicia el servidor de desarrollo o recompila producción.

## Generación y privacidad

Las reglas adaptan los textos a la categoría, estado y datos aportados. No añaden garantías, accesorios ni afirmaciones no introducidas por el usuario. Las características se separan por saltos de línea o punto y coma; se conservan comas y decimales. La descripción corta limita la longitud a 300 caracteres y WhatsApp a 650. Los resúmenes priorizan detalles o fallas y mantienen los datos seleccionados completos, incluidas sus negaciones; si no cabe toda la información, indican que se consulte la descripción completa. El mejorador limpia espacios y saltos de línea y sugiere datos que faltan; no reescribe hechos mediante IA.

Los formularios no envían datos a un servidor ni utilizan cookies, localStorage o analítica. Los resultados viven en la memoria de la página y pueden perderse al navegar o recargar. El botón de copia usa Clipboard API: requiere HTTPS o localhost; si falla, se ofrece copiar seleccionando el texto.

La calculadora aplica `precio = (costo + gastos) / (1 - margen/100 - comisión/100)`. Acepta dos decimales y valida que margen + comisión sea menor que 100. Usa céntimos enteros para evitar errores de punto flotante y ajusta el precio para cubrir el margen después del redondeo de comisión. No estima el precio de mercado ni calcula impuestos que no se hayan introducido.

## Ampliación

Para añadir una guía, agrega una entrada en `data/categories.ts`: la página estática, sitemap y navegación se derivan de los datos. Para ampliar los datos de una categoría, actualiza los tipos de `types/product.ts` y su definición en `data/category-fields.ts`; mantén las variantes de texto en `lib/ad-templates.ts` y las reglas de validación en `lib/product-validation.ts`. Comprueba con las pruebas que los datos de otras categorías no se filtren a los resultados y que no aparezcan afirmaciones no proporcionadas.

Para una nueva función, añade su definición en `data/tools.ts`, su modo tipado y el formulario correspondiente en `ToolPage`. Reutiliza `FormField`, `GeneratedResult` y `CopyButton`. `AdPreview`, `AdQuality` y `AdResults` separan la presentación de la lógica de generación y validación.

Antes de integrar AdSense, revisa sus requisitos vigentes, consentimiento aplicable, políticas y ubicación de anuncios. `AdPlaceholder` es únicamente un punto de integración; no contiene IDs, scripts, rastreadores ni solicitudes publicitarias. El proyecto no garantiza aprobación de AdSense, posiciones de búsqueda ni ventas.

No se usan fuentes externas ni imágenes remotas: la carga no depende de esos servicios. No se ha desplegado el proyecto ni comprado/configurado un dominio.

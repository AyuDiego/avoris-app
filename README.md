# Avoris - Prueba Técnica de Maquetación

## Descripción del Proyecto

He desarrollado una aplicación web responsive para una agencia de viajes ficticia llamada "Waveless", siguiendo el diseño proporcionado. La aplicación está construida con Angular 19 y presenta:

- Una página de inicio completamente responsive con adaptación específica para móvil, tablet y escritorio
- Componentes interactivos como slider principal, sistema de tarjetas y filtros dinámicos
- Diseño moderno con animaciones sutiles para mejorar la experiencia de usuario

## Enfoque Técnico

### Diseño Responsive

He implementado un diseño completamente adaptable siguiendo la metodología mobile-first con tres puntos de ruptura principales:

- **Móvil**: < 768px - Elementos apilados, menú hamburguesa, filtros en modal
- **Tablet**: 768px - 1440px - Distribución en grid de 2 columnas, adaptaciones específicas
- **Escritorio**: > 1440px - Aprovechamiento del espacio con 3-4 columnas, filtros laterales fijos

### HTML y CSS

- Utilicé **HTML5 semántico** con etiquetas como `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` para mejorar SEO y accesibilidad
- Implementé la **metodología BEM** para CSS con una estructura clara:
  - Bloques: `.c-card`, `.c-navbar`, `.o-hero-slider`
  - Elementos: `.c-card__title`, `.c-navbar__brand`
  - Modificadores: `.c-card--featured`, `.c-navbar__mobile-menu--open`
- Usé **SCSS** como preprocesador para variables, mixins y anidamiento
- Creé un sistema de componentes reutilizables para mantener consistencia visual

### JavaScript (TypeScript)

- Desarrollé funcionalidad interactiva completa para el sistema de filtros:
  - Filtrado por categorías (destinos, tipo de aventura)
  - Filtrado por rango de precios con validación
  - Persistencia de estados con Signals de Angular
  - Comportamiento adaptativo según tamaño de pantalla
- Implementé slider con controles de navegación y animaciones
- Desarrollé sistema de modal para desglose de precios
- Creé menú responsive con transiciones suaves

### Accesibilidad (WCAG 2.1)

- **Navegación por teclado** completa (focus visible, orden lógico, atajos)
- **Atributos ARIA** para mejorar comprensión por lectores de pantalla
  - `aria-label`, `aria-expanded`, `aria-controls`, `aria-current`
- **Contraste adecuado** entre texto y fondo (ratio mínimo 4.5:1)
- **Textos alternativos** descriptivos para todas las imágenes
- **Estructura semántica** clara con encabezados jerárquicos
- **Mensajes de estado** accesibles para elementos dinámicos

## Tecnologías Utilizadas

- Angular 19 (última versión estable)
- TypeScript para lógica estructurada y tipada
- SCSS con metodología BEM
- Signals de Angular para gestión de estado reactivo
- Docker para containerización y despliegue

## Instrucciones de Instalación

### Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Docker (opcional)

### Instalación Local

```bash
# Clonar repositorio
git clone [URL_REPOSITORIO]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Generación de código

Ejecuta `ng generate component nombre-componente` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Compilación

Ejecuta `ng build` para compilar el proyecto. Los artefactos de compilación se almacenarán en el directorio `dist/`.

## Ejecutar pruebas unitarias

Ejecuta `npm test` para ejecutar las pruebas unitarias a través de [Karma/Jasmine]

## Ejecutar pruebas de extremo a extremo

Ejecuta `ng e2e` para ejecutar las pruebas de extremo a extremo a través de una plataforma de tu elección. Para usar este comando, primero necesitas añadir un paquete que implemente capacidades de pruebas de extremo a extremo.

## Implementación con Docker

### Construir la imagen Docker

```bash
docker build -t avoris-app .
```

### Ejecutar el contenedor Docker

```bash
docker run -p 8080:80 avoris-app
```

Después de ejecutar el contenedor, accede a la aplicación en `http://localhost:8080`.

## Estructura del Proyecto

    src/
    ├── app/
    │ ├── core/ # Servicios singleton (icon-registry, etc)
    │ ├── features/ # Componentes específicos de características
    │ │ └── home/ # Componentes de la página de inicio
    │ │ ├── hero/ # Slider principal
    │ │ └── card-grid/ # Grid de tarjetas con filtros
    │ ├── layout/ # Componentes estructurales
    │ │ ├── nav-bar/ # Barra de navegación responsive
    │ │ └── footer/ # Pie de página
    │ ├── shared/ # Componentes reutilizables
    │ │ └── components/ # Componentes atómicos (botones, tarjetas, etc)
    │ │ └── filter-modal/ # Componente de filtros interactivos
    │ └── mock-data/ # Datos simulados para desarrollo
    └── assets/ # Recursos estáticos
    ├── images/ # Imágenes e iconos
    └── styles/ # Estilos globales y variables
    ├── \_variables.scss # Variables SCSS
    └── main.scss # Estilos globales

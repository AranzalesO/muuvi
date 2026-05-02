# Muuvi

Muuvi es una aplicación móvil construida con Expo y React Native para explorar películas usando la API de The Movie Database. El objetivo principal del proyecto es demostrar una arquitectura mantenible, consumo eficiente de datos, experiencia de usuario fluida, soporte offline y una gestión correcta de recordatorios para películas guardadas en la watchlist.

## Requisitos

- Node.js 20 o superior
- npm o pnpm
- Expo CLI
- Una cuenta y token de API de The Movie Database
- Expo Go o un emulador iOS/Android

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

3. Agregar el token de TMDB:

```env
EXPO_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

4. Ejecutar la aplicación:

```bash
npm run start
```

También se puede ejecutar directamente en plataforma:

```bash
npm run android
npm run ios
```

## Arquitectura

La aplicación está organizada con una arquitectura por funcionalidades, separando presentación, casos de uso, reglas de dominio e infraestructura. La intención es mantener las pantallas simples y mover la lógica importante a módulos testeables.

Estructura propuesta:

```txt
app/
  _layout.tsx
  index.tsx
  movie/[id].tsx
  watchlist.tsx

src/
  features/
    movies/
      api/
      components/
      domain/
      hooks/
      screens/
      types.ts
    watchlist/
      domain/
      hooks/
      store/
    notifications/
      domain/
      services/
  shared/
    api/
    components/
    network/
    storage/
    theme/
    types/
```

### Capas principales

**Presentación**

Contiene pantallas, componentes visuales y navegación con Expo Router. Esta capa no conoce detalles de TMDB, persistencia local ni reglas complejas de negocio.

**Aplicación**

Agrupa hooks y servicios que coordinan flujos de uso:

- carga infinita de películas;
- búsqueda por letra;
- detalle de película;
- gestión de watchlist;
- estado offline;
- programación y cancelación de recordatorios.

**Dominio**

Contiene reglas puras y testeables:

- validar que un título comienza con una letra;
- validar que una película tiene al menos tres géneros;
- validar reparto principal balanceado con al menos tres mujeres y tres hombres;
- decidir si un recordatorio debe programarse, cancelarse o reemplazarse.

**Infraestructura**

Contiene integraciones externas:

- cliente HTTP de TMDB;
- adaptadores de respuestas de API;
- persistencia local;
- estado de red con NetInfo;
- notificaciones con Expo Notifications.

## Manejo de estado

El proyecto usa dos tipos de estado con responsabilidades separadas.

### TanStack Query

TanStack Query administra el estado remoto:

- listas paginadas de películas;
- detalle de película;
- créditos y reparto;
- géneros;
- caché;
- reintentos;
- estado de carga/error;
- persistencia offline de queries.

Las pantallas no hacen llamadas HTTP directas. Consumen hooks que exponen datos ya normalizados para la interfaz.

### Zustand

Zustand administra estado local del usuario:

- películas guardadas en la watchlist;
- identificadores de notificaciones programadas;
- metadatos necesarios para evitar recordatorios duplicados;
- persistencia local de preferencias o acciones del usuario.

No se duplican listas remotas en Zustand. Las películas obtenidas de TMDB pertenecen al caché de TanStack Query.

## Patrones de diseño

### Repository Pattern

El acceso a TMDB se encapsula en repositorios:

```ts
movieRepository.getPopularMovies(page)
movieRepository.getMovieDetails(movieId)
movieRepository.getMovieCredits(movieId)
movieRepository.searchMovies(query, page)
```

Esto evita que las pantallas dependan de endpoints, headers o estructura de respuestas externas.

### Adapter / Mapper Pattern

Las respuestas de TMDB se transforman a modelos internos de la app:

```ts
mapTmdbMovieToMovie()
mapTmdbDetailsToMovieDetails()
mapTmdbCreditsToCast()
```

Así se evita filtrar o renderizar directamente usando DTOs externos.

### Facade Pattern

Los hooks funcionan como fachadas para la UI:

```ts
useInfiniteMovies()
useMovieDetail(movieId)
useBalancedMovieSearch(letter)
useWatchlist()
```

Cada pantalla recibe una API simple aunque internamente haya queries, persistencia, manejo offline o validaciones.

### Specification Pattern

El filtro por letra y reparto balanceado se modela como reglas pequeñas y combinables:

```ts
startsWithLetter(movie, letter)
hasMinimumGenres(movie, 3)
hasBalancedMainCast(cast, { women: 3, men: 3 })
isEligibleForBalancedSearch(movie, cast, letter)
```

Esto permite testear la parte más compleja del test sin depender de React Native.

### Command Pattern

Las acciones relacionadas con recordatorios se modelan como comandos explícitos:

```ts
scheduleWatchlistReminder(movie)
cancelWatchlistReminder(movieId)
replaceWatchlistReminder(movie)
cancelReminderAfterMovieOpened(movieId)
```

Este patrón ayuda a controlar efectos secundarios y cumplir las reglas de duplicados/cancelación.

### Observer Pattern

La aplicación reacciona a eventos externos:

- cambios de conectividad;
- respuestas a notificaciones;
- cambios de caché;
- cambios de estado persistido.

Estos eventos se manejan en puntos centralizados para evitar lógica dispersa en componentes.

## Decisiones técnicas

### Lista principal

La pantalla principal usa paginación infinita con TanStack Query. Para una experiencia fluida con muchas imágenes se prioriza el uso de `FlashList` y `expo-image`, aprovechando reciclado de celdas y caché de imágenes.

### Detalle de película

El detalle usa rutas dinámicas de Expo Router:

```txt
/movie/[id]
```

Al abrir una película se cargan detalles, géneros, descripción y reparto. Si existe un recordatorio pendiente para esa película, se cancela porque el usuario ya abrió el contenido.

### Filtro por letra y reparto balanceado

El filtro no se ejecuta dentro de componentes visuales. El flujo esperado es:

1. El usuario escribe una letra.
2. Se aplica debounce.
3. Se buscan películas candidatas.
4. Se obtienen detalles y créditos en lotes controlados.
5. Se aplican reglas puras de dominio.
6. Se cachea el resultado para evitar repetir trabajo.

El reparto principal se interpreta usando el orden de relevancia entregado por TMDB. Si no existe una definición externa, se considera un subconjunto inicial del cast como reparto principal.

### Offline

La app debe seguir siendo navegable sin conexión. Para esto:

- se persiste el caché de TanStack Query;
- se persiste la watchlist con Zustand;
- se muestra un indicador visible de modo offline;
- se renderiza contenido previamente cargado;
- se muestran estados vacíos claros cuando un contenido nunca fue cacheado.

### Watchlist y notificaciones

Cuando el usuario agrega una película a la watchlist se programa un recordatorio para tres minutos después:

```txt
¿Listo para ver {movie_name}?
```

Reglas implementadas:

- si el usuario quita la película, se cancela el recordatorio;
- si agrega/quita/agrega rápido, se reemplaza el recordatorio anterior;
- si abre el detalle antes de los tres minutos, se cancela;
- si toca la notificación, navega al detalle de la película;
- el mensaje usa el título real de la película.

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run lint
npm run test
```

## Variables de entorno

```env
EXPO_PUBLIC_TMDB_ACCESS_TOKEN=
```

El token no debe subirse al repositorio. El archivo `.env.example` documenta las variables necesarias.

## Pruebas recomendadas

Las pruebas unitarias deben cubrir principalmente reglas de dominio:

- título comienza con una letra ignorando mayúsculas/minúsculas;
- mínimo de géneros;
- reparto balanceado por género;
- elegibilidad completa del filtro;
- deduplicación de recordatorios;
- cancelación de recordatorio al abrir una película;
- persistencia básica de watchlist.

## Proceso de desarrollo

El desarrollo se realiza por fases y con commits frecuentes:

1. Inicialización del proyecto Expo con TypeScript.
2. Configuración base de rutas, tema, linting y variables de entorno.
3. Cliente TMDB, repositorio y modelos tipados.
4. Lista principal con scroll infinito.
5. Detalle de película.
6. Watchlist persistente.
7. Soporte offline.
8. Filtro por letra y reparto balanceado.
9. Recordatorios inteligentes.
10. Pruebas, documentación y pulido final.

Este enfoque permite revisar la evolución del proyecto y entender las decisiones técnicas en cada etapa.

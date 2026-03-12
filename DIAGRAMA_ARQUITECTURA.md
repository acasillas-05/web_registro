# 🎨 DIAGRAMA VISUAL DE ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DEL PROYECTO                             │
│                     Sistema Web de Registro + PokeAPI                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  ENTRY POINT                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  index.js                                                                    │
│  ↓                                                                           │
│  ReactDOM.render(<App />)                                                    │
│  ↓                                                                           │
│  App.js → <BrowserRouter>                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  SISTEMA DE RUTAS (React Router)                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐      ┌─────────────────────┐                      │
│  │  RUTAS PÚBLICAS     │      │  RUTAS PROTEGIDAS   │                      │
│  ├─────────────────────┤      ├─────────────────────┤                      │
│  │ / → /login         │      │ /home               │                      │
│  │ /register          │      │ /about-us           │                      │
│  │ /login             │      │ /capabilities       │                      │
│  └─────────────────────┘      │ /industries         │                      │
│         ↓                      │ /insights           │                      │
│    Sin wrapper                 │ /careers            │                      │
│                                └─────────────────────┘                      │
│                                        ↓                                     │
│                            Wrapped by ProtectedRoute                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPONENTE: ProtectedRoute.js (Higher-Order Component)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  function ProtectedRoute({ children }) {                                    │
│    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'         │
│    return isLoggedIn ? children : <Navigate to="/login" replace />          │
│  }                                                                           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────┐              │
│  │  DECISIÓN                                                 │              │
│  │                                                           │              │
│  │  isLoggedIn === 'true'?                                  │              │
│  │         ↓             ↓                                  │              │
│  │       YES            NO                                  │              │
│  │         ↓             ↓                                  │              │
│  │  Renderiza        Navigate                               │              │
│  │   children        to /login                              │              │
│  │   (página)                                                │              │
│  └──────────────────────────────────────────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│  FLUJO DE AUTENTICACIÓN                                                     │
└─────────────────────────────────────────────────────────────────────────────┘

REGISTRO                          LOGIN                          ACCESO
─────────                        ─────────                       ────────

Register.js                      Login.js                        ProtectedRoute
    ↓                                ↓                                ↓
Usuario llena                    Usuario ingresa              Verifica token
formulario                       credenciales                 en localStorage
    ↓                                ↓                                ↓
Validaciones:                    Validación:                      ┌───────┐
├─ Passwords match              users.find()                     │ Token │
├─ Email no duplicado           con 3 campos                     │ exist?│
└─ Campos required                  ↓                            └───┬───┘
    ↓                           ┌─────────┐                          │
localStorage.users          Si ┤ Match?  ├ No              ┌─────┴─────┐
    .push(newUser)            │ └─────────┘ │              │           │
    ↓                         │             │             YES          NO
navigate('/login')            │             │              │           │
                             ↓             ↓              ↓           ↓
                        CREAR TOKEN     ERROR         Render      Navigate
                             ↓                         Page        /login
                    localStorage.set                    ↓
                    ├─ currentUser                  Usuario ve
                    ├─ isLoggedIn                   contenido
                    └─ navigate('/home')


┌─────────────────────────────────────────────────────────────────────────────┐
│  ESTRUCTURA DE DATOS - localStorage                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  KEY: users                                                           │
│  TYPE: Array<Object>                                                  │
│  ────────────────────────────────────────────────────────────────    │
│  [                                                                     │
│    {                                                                   │
│      nombreCompleto: "Juan Pérez",                                    │
│      correo: "juan@ejemplo.com",                                      │
│      telefono: "1234567890",                                          │
│      password: "123456"  ← ⚠️ Plain text (solo para demo)            │
│    },                                                                  │
│    {                                                                   │
│      nombreCompleto: "María García",                                  │
│      correo: "maria@ejemplo.com",                                     │
│      telefono: "0987654321",                                          │
│      password: "abcdef"                                               │
│    }                                                                   │
│  ]                                                                     │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  KEY: currentUser                                                     │
│  TYPE: Object                                                         │
│  ────────────────────────────────────────────────────────────────    │
│  {                                                                     │
│    nombreCompleto: "Juan Pérez",                                      │
│    correo: "juan@ejemplo.com",                                        │
│    telefono: "1234567890",                                            │
│    password: "123456"                                                 │
│  }                                                                     │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  KEY: isLoggedIn                                                      │
│  TYPE: String ("true" | null)                                         │
│  ────────────────────────────────────────────────────────────────    │
│  "true"   ← Cuando hay sesión activa                                 │
│   null    ← Sin sesión / después de logout                           │
└──────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPOSICIÓN DE PÁGINAS INTERIORES                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  <div className="page-container">  ← Flexbox vertical         │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ <Header />                                           │   │
│    │  ├─ Logo Tech Mahindra                              │   │
│    │  ├─ Nav Links (Home, About Us, etc.)                │   │
│    │  └─ Logout Icon                                     │   │
│    └─────────────────────────────────────────────────────┘   │
│                                                                │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ <div className="page-content">  ← flex: 1           │   │
│    │                                                      │   │
│    │   Contenido específico de la página                 │   │
│    │   (Home, AboutUs, Capabilities, etc.)               │   │
│    │                                                      │   │
│    └─────────────────────────────────────────────────────┘   │
│                                                                │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ <Footer />                                           │   │
│    │  ├─ Copyright dinámico (year)                       │   │
│    │  └─ Contacto info                                   │   │
│    └─────────────────────────────────────────────────────┘   │
│  </div>                                                        │
└───────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│  INTEGRACIÓN PokeAPI - AboutUs.js                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  ESTADOS DEL COMPONENTE (useState)                             │
├────────────────────────────────────────────────────────────────┤
│  pokemonName     → String   (ej: "ditto")                      │
│  pokemonData     → Object   (respuesta API)                    │
│  loading         → Boolean  (true/false)                       │
│  error           → String   (mensaje de error)                 │
│  searchInput     → String   (valor del input)                  │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│  FUNCIÓN ASYNC fetchPokemon(name)                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  setLoading(true) ──────────────────────────┐                 │
│        ↓                                     │                 │
│  try {                                       │                 │
│    fetch('https://pokeapi.co/.../pokemon/' + name)            │
│        ↓                                     │                 │
│    if (!response.ok) throw Error            │                 │
│        ↓                                     │                 │
│    const data = await response.json()       │                 │
│        ↓                                     │                 │
│    setPokemonData(data) ─────┐              │                 │
│  }                            │              │                 │
│  catch (err) {                │              │                 │
│    setError(err.message) ─┐   │              │                 │
│  }                         │   │              │                 │
│  finally {                 │   │              │                 │
│    setLoading(false) ◄─────┴───┴──────────────┘                 │
│  }                                                              │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│  RENDERIZADO CONDICIONAL                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  {loading && <div>Cargando...</div>}                           │
│       ↓                                                         │
│  Estado: loading = true                                        │
│  Render: <div>Cargando...</div>                                │
│                                                                 │
│  {error && <div className="error">{error}</div>}               │
│       ↓                                                         │
│  Estado: error = "Pokémon no encontrado"                       │
│  Render: <div className="error">Pokémon no encontrado</div>    │
│                                                                 │
│  {pokemonData && <div className="pokemon-card">...</div>}      │
│       ↓                                                         │
│  Estado: pokemonData = { name: "ditto", ... }                  │
│  Render: Tarjeta completa con datos                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│  DATOS MOSTRADOS DEL POKÉMON                                                │
└─────────────────────────────────────────────────────────────────────────────┘

API Response                          Transformación                 UI
─────────────                        ───────────────                ───

pokemonData.name                     .toUpperCase()                 DITTO
pokemonData.id                       #${id}                         #132
pokemonData.sprites
  .other['official-artwork']
  .front_default                     <img src={...} />              🖼️ Imagen
pokemonData.types[]                  .map() + className             🟣 normal
pokemonData.weight                   / 10 + " kg"                   4.0 kg
pokemonData.height                   / 10 + " m"                    0.3 m
pokemonData.base_experience          directo                        101
pokemonData.abilities[]              .map() + badge                 limber
pokemonData.stats[]                  .map() + barra                 HP: 48
                                     (base_stat/255)*100%           ████░░░


┌─────────────────────────────────────────────────────────────────────────────┐
│  CICLO DE VIDA DEL COMPONENTE AboutUs                                      │
└─────────────────────────────────────────────────────────────────────────────┘

1. MOUNT (primera vez)
   ↓
   useEffect(() => fetchPokemon('ditto'), [])
   ↓
   ┌────────────────────────┐
   │ loading = true         │
   │ Fetch API...           │ ───→ Usuario ve "Cargando..."
   │ loading = false        │
   │ pokemonData = {...}    │ ───→ Usuario ve tarjeta de Ditto
   └────────────────────────┘

2. USER SEARCH (búsqueda)
   ↓
   Usuario escribe "pikachu" y presiona Enter
   ↓
   handleSearch(e)
   ↓
   e.preventDefault()
   ↓
   fetchPokemon('pikachu')
   ↓
   ┌────────────────────────┐
   │ loading = true         │
   │ pokemonData = null     │ ───→ Usuario ve "Cargando..."
   │ Fetch API...           │
   │ loading = false        │
   │ pokemonData = {...}    │ ───→ Usuario ve tarjeta de Pikachu
   └────────────────────────┘

3. ERROR CASE
   ↓
   Usuario escribe "asdfasdf"
   ↓
   fetchPokemon('asdfasdf')
   ↓
   ┌────────────────────────┐
   │ loading = true         │
   │ Fetch API...           │
   │ response.ok = false    │ ───→ throw Error
   │ catch block            │
   │ error = "No encontrado"│ ───→ Usuario ve mensaje de error
   │ loading = false        │
   └────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│  FLUJO COMPLETO: Usuario Nuevo → Búsqueda Pokémon                          │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: LLEGA AL SITIO
    localhost:3000/
    ↓
    <Navigate to="/login" />
    ↓
    Pantalla: Login.js

Step 2: INTENTA VER CONTENIDO (sin login)
    Escribe manualmente: localhost:3000/home
    ↓
    ProtectedRoute verifica isLoggedIn
    ↓
    isLoggedIn === null (no hay sesión)
    ↓
    <Navigate to="/login" replace />
    ↓
    Pantalla: Login.js (bloqueado)

Step 3: REGISTRARSE
    Click "Regístrate"
    ↓
    Pantalla: Register.js
    ↓
    Llena formulario:
    ├─ Nombre: "Juan Pérez"
    ├─ Correo: "juan@test.com"
    ├─ Teléfono: "123456789"
    ├─ Password: "123456"
    └─ Confirmar: "123456"
    ↓
    Submit → handleSubmit()
    ↓
    Validaciones:
    ✓ Passwords coinciden
    ✓ Email no existe en users[]
    ↓
    localStorage.users.push(newUser)
    ↓
    navigate('/login')
    ↓
    Pantalla: Login.js

Step 4: LOGIN
    Ingresa credenciales:
    ├─ Nombre: "Juan Pérez"
    ├─ Correo: "juan@test.com"
    └─ Password: "123456"
    ↓
    Submit → handleSubmit()
    ↓
    users.find() → Match ✓
    ↓
    localStorage.currentUser = {...}
    localStorage.isLoggedIn = "true"
    ↓
    navigate('/home')
    ↓
    Pantalla: Home.js (con Header + Footer)

Step 5: NAVEGA A ABOUT US
    Click "About Us" en Header
    ↓
    navigate('/about-us')
    ↓
    ProtectedRoute verifica isLoggedIn
    ↓
    isLoggedIn === "true" ✓
    ↓
    Renderiza AboutUs.js
    ↓
    useEffect → fetchPokemon('ditto')
    ↓
    Pantalla: AboutUs.js con Ditto cargado

Step 6: BUSCA OTRO POKÉMON
    Escribe "charizard" en input
    ↓
    Presiona "Buscar"
    ↓
    handleSearch(e)
    ↓
    e.preventDefault()
    ↓
    fetchPokemon('charizard')
    ↓
    setLoading(true)
    ↓
    Muestra "Cargando..."
    ↓
    await fetch('https://pokeapi.co/.../charizard')
    ↓
    response.ok = true ✓
    ↓
    setPokemonData(data)
    ↓
    setLoading(false)
    ↓
    Pantalla: Tarjeta de Charizard con:
    ├─ Imagen oficial
    ├─ Tipos: fire, flying
    ├─ Stats con barras de progreso
    └─ Habilidades, peso, altura

Step 7: LOGOUT
    Click icono de logout en Header
    ↓
    handleLogout()
    ↓
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isLoggedIn')
    ↓
    navigate('/login')
    ↓
    Pantalla: Login.js

Step 8: VERIFICAR PROTECCIÓN
    Intenta acceder: localhost:3000/home
    ↓
    ProtectedRoute verifica isLoggedIn
    ↓
    isLoggedIn === null (eliminado en logout)
    ↓
    <Navigate to="/login" replace />
    ↓
    Pantalla: Login.js (bloqueado de nuevo)


┌─────────────────────────────────────────────────────────────────────────────┐
│  TECNOLOGÍAS Y DEPENDENCIAS                                                 │
└─────────────────────────────────────────────────────────────────────────────┘

package.json dependencies:
├── react@19.2.4 ────────────────────── Core library
├── react-dom@19.2.4 ───────────────────Rendering
├── react-router-dom@7.13.0 ───────────── Routing
├── react-scripts@5.0.1 ────────────────Create React App tools
└── web-vitals@2.1.4 ───────────────────Performance metrics

DevDependencies (testing):
├── @testing-library/react
├── @testing-library/jest-dom
└── @testing-library/user-event

External API:
└── PokeAPI (https://pokeapi.co)

Browser APIs:
├── localStorage (persistence)
├── fetch (HTTP requests)
└── Date (dynamic year)


┌─────────────────────────────────────────────────────────────────────────────┐
│  COMANDOS GIT UTILIZADOS                                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Workflow completo:

1. git status
   └─ Ver archivos modificados/nuevos

2. git add .
   └─ Agregar todos los cambios al staging area

3. git commit -m "Mensaje descriptivo"
   └─ Crear commit con mensaje

4. git push
   └─ Subir cambios a GitHub (rama development)

Commits realizados:
├─ Commit 1: "Agregar componente Footer y nuevas páginas Insights y Careers"
└─ Commit 2: "Agregar protección de rutas y integración con API de Pokémon..."


┌─────────────────────────────────────────────────────────────────────────────┐
│  RESUMEN EJECUTIVO                                                          │
└─────────────────────────────────────────────────────────────────────────────┘

PROYECTO: Sistema de registro web con integración de API externa
TECNOLOGÍA: React 19 + React Router 7
CARACTERÍSTICAS:
  ✓ Autenticación con localStorage (simulación)
  ✓ Protección de rutas privadas (HOC)
  ✓ 6 páginas protegidas + 2 públicas
  ✓ Consumo de API REST (PokeAPI)
  ✓ Manejo de estados asíncronos
  ✓ Componentes reutilizables (Header, Footer)
  ✓ Diseño responsivo
  ✓ Validaciones de formularios

LÍNEAS DE CÓDIGO: ~482 nuevas
ARCHIVOS CREADOS: 6
COMMITS: 2
RAMA: development
ESTADO: ✅ Funcionando sin errores
```

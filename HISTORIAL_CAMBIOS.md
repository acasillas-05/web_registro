# 📝 HISTORIAL DE CAMBIOS IMPLEMENTADOS

## 📅 CRONOLOGÍA DE SOLICITUDES Y CAMBIOS

### 🔴 SOLICITUD #1: Footer y Nuevas Páginas
**Fecha:** 17 de Febrero, 2026

**Petición del usuario:**
> "Necesito agregar un footer sencillo que tenga el mismo diseño de contenedor del header y que no abarque tanta pantalla. ¿Recomiendas que este footer se vea en pantallas como register o login o solamente en las demás pantallas?"

**Decisión tomada:**
- Footer SOLO en páginas interiores (Home, About Us, Capabilities, Industries, Insights, Careers)
- NO en Login ni Register (páginas centradas, enfoque único)

**Archivos creados:**
1. `src/components/Footer.js`
2. `src/components/Footer.css`
3. `src/pages/Insights.js`
4. `src/pages/Careers.js`

**Archivos modificados:**
- `src/pages/Home.js` - Importa y usa Footer
- `src/pages/AboutUs.js` - Importa y usa Footer
- `src/pages/Capabilities.js` - Importa y usa Footer
- `src/pages/Industries.js` - Importa y usa Footer
- `src/pages/Page.css` - Flexbox para footer en bottom
- `src/App.js` - Rutas para Insights y Careers
- `src/components/Header.js` - Links a nuevas páginas

**Características implementadas:**
- Fondo oscuro `#1a1d23` (igual que Header)
- Padding 20px vertical (más compacto que Header)
- Copyright dinámico con `new Date().getFullYear()`
- Diseño responsivo (horizontal → vertical en móvil)
- Flexbox en page-container para footer always-bottom

**Git commit:**
```
Agregar componente Footer y nuevas páginas Insights y Careers
11 archivos modificados, 105 líneas añadidas
```

---

### 🔴 SOLICITUD #2: Sistema de Autenticación y API
**Fecha:** 24 de Febrero, 2026

**Petición del usuario:**
> "Separar el header y footer para usar el mismo en todas nuestras páginas interiores, crear un token o sección de usuario al ingresar las credenciales correctas del login, que las páginas interiores solo sean accesibles si la sesión se inició correctamente. Necesito también que hagas uso de la API de Pokémon."

**Subtareas identificadas:**
1. ✅ Header y Footer ya estaban separados (punto completado previamente)
2. ✅ Sistema de tokens/sesión de usuario
3. ✅ Protección de rutas privadas
4. ✅ Integración con PokeAPI en About Us

---

#### 2.1 Sistema de Tokens - localStorage

**Archivos modificados:**
- `src/pages/Login.js` (ya existía, mejorado)
- `src/pages/Register.js` (ya existía, mejorado)

**Implementación:**

**Login.js - Creación de sesión:**
```javascript
// Al hacer login exitoso:
localStorage.setItem('currentUser', JSON.stringify(user));
localStorage.setItem('isLoggedIn', 'true');
```

**Header.js - Cierre de sesión:**
```javascript
const handleLogout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  navigate('/login');
};
```

**Tokens creados:**
- `currentUser`: Objeto JSON con datos del usuario logueado
- `isLoggedIn`: String "true" como bandera de sesión activa

---

#### 2.2 Protección de Rutas

**Archivo creado:**
- `src/components/ProtectedRoute.js` (NUEVO)

**Código implementado:**
```javascript
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

**Patrón:** Higher-Order Component (HOC)

**Archivo modificado:**
- `src/App.js` - Todas las rutas interiores envueltas en ProtectedRoute

**Antes:**
```javascript
<Route path="/home" element={<Home />} />
```

**Después:**
```javascript
<Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
```

**Páginas protegidas:**
- /home
- /about-us
- /capabilities
- /industries
- /insights
- /careers

**Páginas públicas:**
- /login
- /register
- / (redirige a /login)

---

#### 2.3 Integración con PokeAPI

**Archivo modificado:**
- `src/pages/AboutUs.js` - Reescrito completamente

**Archivo creado:**
- `src/pages/AboutUs.css` - Estilos para tarjeta Pokémon

**Features implementadas:**

1. **Buscador de Pokémon**
   - Input controlado con estado
   - Formulario con onSubmit
   - Búsqueda por nombre

2. **Consumo de API**
   - Fetch asíncrono: `https://pokeapi.co/api/v2/pokemon/{name}`
   - async/await para Promises
   - Manejo de errores con try-catch-finally
   - Validación de response.ok

3. **Estados de UX**
   - Loading mientras carga
   - Error si Pokémon no existe
   - Renderizado condicional

4. **Datos mostrados**
   - ✅ Imagen oficial (official-artwork)
   - ✅ Nombre e ID
   - ✅ Tipo/s (normal, fire, water, etc.)
   - ✅ Peso y altura (convertidos a kg/m)
   - ✅ Experiencia base
   - ✅ Habilidades (normales y ocultas)
   - ✅ Estadísticas (HP, Attack, Defense, etc.)

5. **Diseño**
   - Tarjeta centrada destacada
   - Colores oficiales por tipo de Pokémon (18 tipos)
   - Barras de progreso animadas para stats
   - Cálculo dinámico: `(base_stat / 255) * 100%`
   - Responsive design
   - Gradientes y sombras

6. **Carga inicial**
   - useEffect con array vacío `[]`
   - Carga Ditto automáticamente al montar
   - Sin interacción del usuario necesaria

**Git commit:**
```
Agregar protección de rutas y integración con API de Pokémon en About Us
4 archivos modificados, 377 líneas añadidas
```

---

## 📊 RESUMEN DE ARCHIVOS POR CATEGORÍA

### 🎨 COMPONENTES REUTILIZABLES
| Archivo | Función | Usado en |
|---------|---------|----------|
| `Header.js` | Navegación y logout | Todas las páginas interiores |
| `Header.css` | Estilos del header | - |
| `Footer.js` | Pie de página | Todas las páginas interiores |
| `Footer.css` | Estilos del footer | - |
| `ProtectedRoute.js` | HOC de autenticación | App.js (wrapping routes) |

### 📄 PÁGINAS
| Archivo | Tipo | Protegida | Características especiales |
|---------|------|-----------|---------------------------|
| `Login.js` | Pública | ❌ | Validación de credenciales |
| `Register.js` | Pública | ❌ | Validación de duplicados |
| `Home.js` | Privada | ✅ | Página principal post-login |
| `AboutUs.js` | Privada | ✅ | **Integración PokeAPI** |
| `Capabilities.js` | Privada | ✅ | Página estándar |
| `Industries.js` | Privada | ✅ | Página estándar |
| `Insights.js` | Privada | ✅ | Página estándar |
| `Careers.js` | Privada | ✅ | Página estándar |

### 🎨 ESTILOS
| Archivo | Aplica a | Especial |
|---------|----------|----------|
| `Login.css` | Login.js | Formulario centrado |
| `Register.css` | Register.js | Formulario centrado |
| `Page.css` | Todas las páginas interiores | Flexbox layout |
| `AboutUs.css` | AboutUs.js | **Colores por tipo Pokémon** |
| `Header.css` | Header | Fixed position |
| `Footer.css` | Footer | Auto margin-top |

### ⚙️ CONFIGURACIÓN
| Archivo | Propósito |
|---------|-----------|
| `App.js` | Routing principal |
| `index.js` | Entry point |
| `package.json` | Dependencias |

---

## 🔍 MAPA DE RELACIONES ENTRE ARCHIVOS

```
App.js
├── Router
│   ├── Route /login
│   │   └── Login.js
│   │       └── Login.css
│   ├── Route /register
│   │   └── Register.js
│   │       └── Register.css
│   └── ProtectedRoute ← WRAPPER
│       ├── Route /home
│       │   └── Home.js → Header.js, Footer.js, Page.css
│       ├── Route /about-us
│       │   └── AboutUs.js → Header.js, Footer.js, Page.css, AboutUs.css
│       │       └── PokeAPI 🌐
│       ├── Route /capabilities
│       │   └── Capabilities.js → Header.js, Footer.js, Page.css
│       ├── Route /industries
│       │   └── Industries.js → Header.js, Footer.js, Page.css
│       ├── Route /insights
│       │   └── Insights.js → Header.js, Footer.js, Page.css
│       └── Route /careers
│           └── Careers.js → Header.js, Footer.js, Page.css
```

---

## 🧠 FLUJO DE DATOS EN localStorage

```
REGISTRO (Register.js)
│
├── Input: {nombreCompleto, correo, telefono, password, confirmPassword}
├── Validación: password === confirmPassword
├── Validación: correo no existe en users[]
│
└── Guardado:
    localStorage.users = [...existingUsers, {nombreCompleto, correo, telefono, password}]
```

```
LOGIN (Login.js)
│
├── Input: {nombreCompleto, correo, password}
├── Búsqueda: users.find() con 3 condiciones
│
└── Si encontrado:
    ├── localStorage.currentUser = {user data}
    ├── localStorage.isLoggedIn = "true"
    └── navigate('/home')
```

```
PROTECCIÓN (ProtectedRoute.js)
│
├── Check: localStorage.isLoggedIn === "true"
│
├── Si true: Renderiza children (página solicitada)
└── Si false: <Navigate to="/login" />
```

```
LOGOUT (Header.js)
│
├── Acción: Click en icono logout
│
└── Limpieza:
    ├── localStorage.removeItem('currentUser')
    ├── localStorage.removeItem('isLoggedIn')
    └── navigate('/login')
```

---

## 🎨 DECISIONES DE DISEÑO IMPORTANTES

### 1. ¿Por qué Footer solo en páginas interiores?

**Razón UX:**
- Login/Register son páginas de propósito único (single focus)
- Formulario centrado sin distracciones
- Footer podría desviar atención de la acción principal

**Razón de diseño:**
- Páginas de autenticación usan layout centrado
- Páginas interiores usan layout full-height con flexbox
- Footer necesita `margin-top: auto` que solo funciona con flex

---

### 2. ¿Por qué dos tokens (currentUser + isLoggedIn)?

**Separación de responsabilidades:**
- `isLoggedIn`: Verificación rápida booleana (ProtectedRoute)
- `currentUser`: Datos completos del usuario (perfil, personalización)

**Ventaja:**
- No necesitas parsear JSON solo para verificar sesión
- Puedes agregar más datos a currentUser sin afectar autenticación

---

### 3. ¿Por qué async/await en lugar de .then()?

**Legibilidad:**
```javascript
// Con .then() (callback hell)
fetch(url)
  .then(response => {
    if (!response.ok) throw Error();
    return response.json();
  })
  .then(data => setPokemonData(data))
  .catch(err => setError(err))
  .finally(() => setLoading(false));

// Con async/await (lineal)
try {
  const response = await fetch(url);
  if (!response.ok) throw Error();
  const data = await response.json();
  setPokemonData(data);
} catch (err) {
  setError(err);
} finally {
  setLoading(false);
}
```

**Manejo de errores:**
- try-catch es más intuitivo que .catch()
- finally garantiza ejecución (setLoading(false))

---

### 4. ¿Por qué 18 clases CSS para tipos de Pokémon?

**Alternativa rechazada:**
- Podría haber usado JavaScript para asignar colores inline

**Por qué CSS es mejor:**
- Separación de responsabilidades (styling en CSS)
- Performance (CSS es más rápido que JS inline)
- Mantenibilidad (todos los colores en un lugar)
- Cacheable (CSS se descarga una vez)

**Implementación:**
```javascript
className={`type-badge ${type.type.name}`}
// Genera: "type-badge fire" → .type-badge.fire { bg: #F08030; }
```

---

## 🔧 HERRAMIENTAS Y COMANDOS GIT USADOS

### Commits realizados

**Commit 1:**
```bash
git add .
git commit -m "Agregar componente Footer y nuevas páginas Insights y Careers"
git push
```
- 11 archivos cambiados
- 105 inserciones

**Commit 2:**
```bash
git add .
git commit -m "Agregar protección de rutas y integración con API de Pokémon en About Us"
git push
```
- 4 archivos cambiados
- 377 inserciones

**Rama:** development

---

## 📈 ESTADÍSTICAS DEL PROYECTO

### Líneas de código agregadas
- Footer y páginas nuevas: **~105 líneas**
- Sistema de autenticación y API: **~377 líneas**
- **Total: ~482 líneas** de código funcional

### Archivos creados
1. Footer.js
2. Footer.css
3. Insights.js
4. Careers.js
5. ProtectedRoute.js
6. AboutUs.css

**Total: 6 archivos nuevos**

### Archivos modificados sustancialmente
1. App.js (routing + protection)
2. AboutUs.js (API integration)
3. Header.js (logout + new links)
4. Page.css (flexbox layout)

### Componentes React
- **Páginas:** 8 (Login, Register, Home, AboutUs, Capabilities, Industries, Insights, Careers)
- **Componentes:** 3 (Header, Footer, ProtectedRoute)
- **Total: 11 componentes**

### Hooks usados
- `useState` (en 4 archivos)
- `useEffect` (en 1 archivo)
- `useNavigate` (en 3 archivos)

### Métodos de Array
- `.find()` - Búsqueda de usuario
- `.some()` - Verificación de duplicados
- `.map()` - Renderizado de listas
- `.push()` - Agregar usuario

---

## 🎯 CONCEPTOS DE PROGRAMACIÓN DEMOSTRADOS

### Patrones de Diseño
✅ Higher-Order Component (HOC)
✅ Controlled Components
✅ Composition over Inheritance
✅ Separation of Concerns
✅ DRY (Don't Repeat Yourself)

### Programación Asíncrona
✅ Promises
✅ async/await
✅ try-catch-finally
✅ Error handling
✅ Loading states

### React Avanzado
✅ Hooks (useState, useEffect, useNavigate)
✅ Conditional Rendering
✅ Event Handling
✅ Form Validation
✅ Routing y Navigation

### JavaScript Moderno
✅ Arrow Functions
✅ Destructuring
✅ Spread Operator
✅ Template Literals
✅ Array Methods
✅ Short-circuit Evaluation

### API y HTTP
✅ RESTful API consumption
✅ Fetch API
✅ JSON parsing
✅ HTTP status validation
✅ Error responses

---

## 🎓 PARA EXPLICAR AL PROFESOR

### Storytelling del proyecto

1. **Problema inicial:**
   - "Necesitábamos un sistema de registro para controlar acceso a contenido privado"

2. **Solución arquitectónica:**
   - "Implementé una SPA (Single Page Application) con React y React Router"
   - "Separé componentes reutilizables (Header, Footer) de páginas específicas"

3. **Autenticación:**
   - "Creé un sistema de autenticación con localStorage simulando un backend"
   - "Implementé validaciones en registro y login"
   - "Usé un HOC para proteger rutas privadas"

4. **Integración externa:**
   - "Consumí PokeAPI para demostrar integración con servicios externos"
   - "Implementé manejo de estados asíncronos y UX con loading/error"

5. **Git workflow:**
   - "Trabajé en la rama development para no afectar main"
   - "Hice commits atómicos con mensajes descriptivos"
   - "Pusheé cambios al repositorio remoto"

---

**¡Ahora tienes contexto completo del proyecto! 🎓**

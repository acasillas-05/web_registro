# 🚀 GUÍA RÁPIDA DE CONSULTA - PREGUNTAS FRECUENTES

## 🎯 RESPUESTAS CORTAS PARA EL PROFESOR

### "¿Qué tecnologías usaste?"
React 19, React Router 7, PokeAPI, CSS3, localStorage para persistencia.

### "¿Cómo funciona la autenticación?"
1. Register guarda usuarios en localStorage como array JSON
2. Login valida credenciales y crea flag `isLoggedIn: 'true'`
3. ProtectedRoute verifica ese flag antes de mostrar páginas
4. Si no hay sesión, redirige a /login automáticamente

### "¿Qué hace ProtectedRoute?"
Es un Higher-Order Component que envuelve páginas privadas. Verifica si existe sesión activa en localStorage. Si no → redirige a login. Si sí → muestra la página.

### "¿Cómo consumes la API?"
Con `fetch()` asíncrono usando async/await. Manejo de errores con try-catch-finally. Valido response.ok antes de parsear JSON. Uso estados loading/error para UX.

### "¿Por qué 5 estados en AboutUs?"
- `pokemonData`: Datos de la API
- `loading`: Mostrar spinner
- `error`: Mensajes de error
- `pokemonName`: Nombre actual
- `searchInput`: Valor del input controlado

### "¿Qué es useEffect con array vacío?"
Se ejecuta solo una vez al montar el componente. Lo uso para cargar Ditto automáticamente sin interacción del usuario.

### "¿Cómo separaste Header y Footer?"
Los creé como componentes independientes que importo en cada página. Esto evita duplicación de código (DRY principle).

### "¿Qué validaciones implementaste?"
- Contraseñas coincidentes en registro
- Email no duplicado (array.some())
- 3 credenciales en login (nombre, correo, password)
- Validación HTTP en fetch (response.ok)
- Campos required en formularios HTML5

### "¿Por qué no usaste backend?"
Para simplificar el proyecto y enfocarse en React. localStorage simula persistencia. En producción usaría Express + MongoDB.

### "¿Es seguro guardar contraseñas así?"
No. Es solo para fines educativos. En producción usaría bcrypt para hash, JWT tokens, HTTPS, y autenticación del servidor.

### "¿Qué es renderizado condicional?"
Mostrar/ocultar elementos según condiciones usando el operador &&. Si la condición es false, React no renderiza nada.

### "¿Qué son controlled components?"
Inputs cuyo value está controlado por useState. Cada onChange actualiza el estado, y el estado define el valor del input.

### "¿Cómo funcionan las rutas protegidas?"
```
Usuario intenta /home 
→ ProtectedRoute verifica isLoggedIn 
→ Si false: <Navigate to="/login" />
→ Si true: renderiza <Home />
```

---

## 📋 CÓDIGO QUE DEBES CONOCER DE MEMORIA

### 1. Estructura de ProtectedRoute
```javascript
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
```

### 2. Patrón de búsqueda en Login
```javascript
const user = users.find(u => 
  u.nombreCompleto === formData.nombreCompleto &&
  u.correo === formData.correo &&
  u.password === formData.password
);
```

### 3. Fetch asíncrono
```javascript
const fetchPokemon = async (name) => {
  setLoading(true);
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error('No encontrado');
    const data = await response.json();
    setPokemonData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. useEffect para carga inicial
```javascript
React.useEffect(() => {
  fetchPokemon('ditto');
}, []); // Array vacío = solo al montar
```

---

## 🎨 FLUJO VISUAL DE AUTENTICACIÓN

```
NUEVO USUARIO
├─ / (raíz)
├─ Redirige → /login
├─ Click "Regístrate"
├─ /register
│  ├─ Llena formulario
│  ├─ Valida passwords coincidan
│  ├─ Valida email no duplicado
│  ├─ localStorage.users.push(newUser)
│  └─ Redirige → /login
├─ /login
│  ├─ Ingresa credenciales
│  ├─ Busca en localStorage.users
│  ├─ Si válido:
│  │  ├─ localStorage.currentUser = user
│  │  ├─ localStorage.isLoggedIn = 'true'
│  │  └─ Redirige → /home
│  └─ Si inválido: Muestra error
└─ PÁGINAS PROTEGIDAS
   ├─ ProtectedRoute verifica isLoggedIn
   ├─ Si true: Muestra página
   └─ Si false: Redirige → /login
```

---

## 🔥 CONCEPTOS AVANZADOS QUE IMPRESIONAN

### 1. Destructuring con rest operator
```javascript
const { confirmPassword, ...dataToSave } = formData;
// Extrae confirmPassword y guarda el resto en dataToSave
```

### 2. Short-circuit evaluation
```javascript
{loading && <div>Cargando...</div>}
// Si loading es false, no evalúa el resto
```

### 3. Template literals en className
```javascript
className={`type-badge ${type.type.name}`}
// Genera: "type-badge fire"
```

### 4. Inline styles dinámicos
```javascript
style={{width: `${(stat.base_stat / 255) * 100}%`}}
// Calcula porcentaje en tiempo real
```

### 5. Array methods encadenados
```javascript
const emailExists = users.some(user => user.correo === formData.correo);
// Devuelve true si encuentra coincidencia
```

---

## 📊 DATOS IMPORTANTES

### Estructura localStorage
```
users: [{nombreCompleto, correo, telefono, password}, ...]
currentUser: {nombreCompleto, correo, telefono, password}
isLoggedIn: "true" | null
```

### Endpoints usados
```
https://pokeapi.co/api/v2/pokemon/{name}
```

### Datos mostrados del Pokémon
- Nombre e ID
- Imagen oficial (sprites.other.official-artwork)
- Tipos (types[].type.name)
- Peso y altura (weight/10, height/10)
- Experiencia base (base_experience)
- Habilidades (abilities[].ability.name)
- Stats (stats[].base_stat)

---

## 🎯 DEMOSTRACIÓN PASO A PASO

### Para mostrar al profesor:

1. **Mostrar protección de rutas**
   - Escribe `localhost:3000/home` en URL
   - Muestra cómo redirige a login
   
2. **Registrar usuario**
   - Click en "Regístrate"
   - Llena formulario con datos ficticios
   - Muestra redirección a login
   
3. **Mostrar localStorage**
   - F12 → Application → Local Storage
   - Muestra array `users` con el nuevo usuario
   
4. **Hacer login**
   - Ingresa credenciales incorrectas → Muestra error
   - Ingresa correctas → Muestra redirección a home
   
5. **Mostrar tokens de sesión**
   - F12 → Application → Local Storage
   - Muestra `isLoggedIn: "true"` y `currentUser`
   
6. **Navegar páginas**
   - Click en diferentes links del header
   - Todas las páginas cargan (protección funciona)
   
7. **Buscar Pokémon**
   - About Us ya tiene Ditto cargado
   - Busca "pikachu" → Muestra loading → Muestra datos
   - Busca "asdasd" → Muestra error
   
8. **Hacer logout**
   - Click en icono de logout
   - Muestra cómo elimina tokens de sesión
   - Redirige a login
   
9. **Verificar protección post-logout**
   - Intenta acceder a /home manualmente
   - Muestra redirección a login

---

## 💬 FRASES TÉCNICAS QUE SUENAN BIEN

- "Implementé un patrón de composición de componentes"
- "Usé el principio de elevación de estado"
- "Apliqué renderizado condicional para optimizar performance"
- "Seguí el patrón de componentes controlados para formularios"
- "Implementé un Higher-Order Component para la autenticación"
- "Utilicé async/await para manejo de operaciones asíncronas"
- "Apliqué el principio DRY separando componentes reutilizables"
- "Implementé un sistema de routing con protección de rutas privadas"

---

## ⚠️ SI TE PREGUNTAN SOBRE LIMITACIONES

**Sé honesto:**
- "localStorage no es seguro para datos sensibles en producción"
- "No implementé validación de email con regex"
- "Las contraseñas deberían hashearse con bcrypt"
- "Falta implementar refresh tokens para sesiones largas"
- "No hay recuperación de contraseña"
- "Debería usar HTTPS en producción"
- "Faltaría implementar rate limiting en la API"

**Pero menciona qué harías:**
- "En producción usaría JWT tokens del servidor"
- "Implementaría validaciones más robustas con Formik o Yup"
- "Agregaría autenticación de dos factores"
- "Usaría Context API o Redux para estado global"
- "Implementaría testing con Jest y React Testing Library"

---

## 🎓 CONCEPTOS DE REACT QUE DOMINAS

✅ **Hooks:**
- useState (gestión de estado local)
- useEffect (efectos secundarios)
- useNavigate (navegación programática)

✅ **Componentes:**
- Functional components
- Props y children
- Composición de componentes
- Higher-Order Components

✅ **Eventos:**
- onChange, onSubmit, onClick
- preventDefault()
- Controlled components

✅ **Renderizado:**
- Condicional (&&, ternarios)
- Listas (.map() con key)
- Fragments

✅ **Routing:**
- BrowserRouter, Routes, Route
- Navigate, Link
- Rutas protegidas
- Redirecciones

---

**¡Con esto estás más que preparado! 💪**

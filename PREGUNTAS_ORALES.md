# 🎤 PREGUNTAS ESPECÍFICAS DE CÓDIGO - PREPARACIÓN ORAL

## 🔴 PREGUNTAS NIVEL BÁSICO

### "Explícame esta línea: `const [loading, setLoading] = useState(false);`"

**Respuesta:**
"Esta es la sintaxis de destructuring de arrays en JavaScript combinada con el hook useState de React. useState retorna un array de dos elementos: el valor actual del estado y una función para actualizarlo. Con destructuring, los extraigo en dos variables: `loading` (valor) y `setLoading` (función setter). Lo inicializo en false porque al cargar el componente no está cargando nada todavía."

**Demostración en código:**
```javascript
// Lo que hace useState internamente (simplificado):
function useState(initialValue) {
  let state = initialValue;
  const setState = (newValue) => { state = newValue; };
  return [state, setState];
}

// Por eso puedo hacer:
const [loading, setLoading] = useState(false);
// En lugar de:
const stateArray = useState(false);
const loading = stateArray[0];
const setLoading = stateArray[1];
```

---

### "¿Qué hace este código: `users.some(user => user.correo === formData.correo)`?"

**Respuesta:**
"El método `.some()` de arrays devuelve true si AL MENOS UN elemento cumple la condición. Aquí estoy verificando si algún usuario en el array tiene el mismo correo que el usuario está intentando registrar. Si encuentra coincidencia, retorna true y muestro error de 'correo duplicado'."

**Comparación:**
```javascript
// .some() - Usa OR lógico (||)
[1, 2, 3].some(x => x > 2)  // true (existe 3)

// .every() - Usa AND lógico (&&)
[1, 2, 3].every(x => x > 0) // true (todos son positivos)

// .find() - Retorna el elemento
[1, 2, 3].find(x => x > 2)  // 3

// .filter() - Retorna array de coincidencias
[1, 2, 3].filter(x => x > 1) // [2, 3]
```

---

### "¿Por qué usas `e.preventDefault()` en el formulario?"

**Respuesta:**
"Por defecto, cuando envías un formulario HTML, el navegador recarga la página enviando los datos al servidor. Como estoy construyendo una SPA (Single Page Application), no quiero recargas de página. `preventDefault()` cancela ese comportamiento predeterminado y me permite manejar el envío con JavaScript puro, validando datos y navegando con React Router sin recargar."

**Demostración:**
```javascript
// Sin preventDefault:
<form onSubmit={handleSubmit}>  // → Página se recarga

// Con preventDefault:
const handleSubmit = (e) => {
  e.preventDefault();  // Cancela recarga
  // Ahora puedo hacer validaciones, fetch, navigate, etc.
};
```

---

## 🟡 PREGUNTAS NIVEL INTERMEDIO

### "Explica qué es `{ children }` en ProtectedRoute"

**Respuesta:**
"`children` es una prop especial de React que contiene todo lo que coloques entre las etiquetas de apertura y cierre de un componente. En este caso, cuando escribo `<ProtectedRoute><Home /></ProtectedRoute>`, el componente `<Home />` se pasa automáticamente como `children`. Esto me permite crear un wrapper que decide si mostrar su contenido o redirigir, sin importar qué componente se le pase."

**Código detallado:**
```javascript
// Definición del HOC:
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;  // Renderiza lo que se pasó entre las tags
}

// Uso:
<ProtectedRoute>
  <Home />  {/* Esto es 'children' */}
</ProtectedRoute>

// Es equivalente a:
<ProtectedRoute children={<Home />} />
```

**Ventaja del patrón:**
```javascript
// Puedo reutilizar el mismo HOC para cualquier componente:
<ProtectedRoute><Home /></ProtectedRoute>
<ProtectedRoute><AboutUs /></ProtectedRoute>
<ProtectedRoute><Careers /></ProtectedRoute>
```

---

### "¿Qué hace `JSON.parse(localStorage.getItem('users') || '[]')`?"

**Respuesta:**
"Es una expresión que maneja tres casos simultáneamente:

1. `localStorage.getItem('users')` obtiene el string guardado
2. Si no existe (null), el operador `||` retorna el fallback `'[]'` (string vacío de array)
3. `JSON.parse()` convierte el string JSON a objeto JavaScript

Esto garantiza que siempre obtengo un array, incluso en la primera ejecución cuando no hay usuarios registrados. Sin el `|| '[]'`, JSON.parse(null) daría error."

**Paso a paso:**
```javascript
// Primera vez (no hay usuarios):
localStorage.getItem('users')  // → null
null || '[]'                   // → '[]'
JSON.parse('[]')              // → []

// Segunda vez (hay usuarios):
localStorage.getItem('users')  // → '[{"nombre":"Juan"}]'
'[...]' || '[]'               // → '[...]' (primer truthy)
JSON.parse('[...]')           // → [{nombre: "Juan"}]
```

---

### "Explica esta línea: `const { confirmPassword, ...dataToSave } = formData;`"

**Respuesta:**
"Es destructuring con el operador rest `...` para excluir un campo. Extraigo `confirmPassword` en su propia variable, y con `...dataToSave` capturo TODAS LAS DEMÁS propiedades en un nuevo objeto. Es útil porque `confirmPassword` solo sirve para validación, no debe guardarse en la base de datos."

**Equivalente sin destructuring:**
```javascript
// Lo que hace automáticamente:
const confirmPassword = formData.confirmPassword;
const dataToSave = {
  nombreCompleto: formData.nombreCompleto,
  correo: formData.correo,
  telefono: formData.telefono,
  password: formData.password
  // confirmPassword NO está aquí
};

// Mucho más conciso con destructuring:
const { confirmPassword, ...dataToSave } = formData;
```

---

### "¿Por qué `useEffect` con array vacío `[]`?"

**Respuesta:**
"El segundo argumento de useEffect es un array de dependencias que React observa. Cuando alguna dependencia cambia, useEffect se ejecuta de nuevo. Un array VACÍO significa 'ninguna dependencia', por lo tanto useEffect solo se ejecuta UNA VEZ al montar el componente. Es equivalente a `componentDidMount` en class components."

**Comparación:**
```javascript
// Sin dependencias: Se ejecuta en CADA render
useEffect(() => {
  console.log('Ejecuta siempre');
});

// Array vacío: Se ejecuta SOLO al montar
useEffect(() => {
  console.log('Ejecuta una vez');
}, []);

// Con dependencias: Se ejecuta cuando cambian
useEffect(() => {
  console.log('Ejecuta cuando count cambia');
}, [count]);
```

**Mi caso:**
```javascript
useEffect(() => {
  fetchPokemon('ditto');  // Solo quiero cargar Ditto UNA VEZ
}, []);  // Si no pusiera [], cargaría en cada render → loop infinito
```

---

## 🔴 PREGUNTAS NIVEL AVANZADO

### "¿Qué pasaría si no usas `finally` en el fetch?"

**Respuesta:**
"Sin `finally`, si ocurre un error en el `try`, el código salta directo al `catch` sin ejecutar `setLoading(false)`, dejando el spinner de carga visible para siempre. `finally` garantiza que el código se ejecute SIEMPRE, haya o no error, asegurando que el loading se oculte en ambos casos."

**Demostración del problema:**
```javascript
// ❌ MALO - Loading se queda pegado si hay error:
const fetchPokemon = async (name) => {
  setLoading(true);
  try {
    const response = await fetch(url);
    const data = await response.json();
    setPokemonData(data);
    setLoading(false);  // Solo se ejecuta si NO hay error
  } catch (err) {
    setError(err.message);
    // setLoading(false) nunca se ejecuta aquí!
  }
};

// ✅ BUENO - Loading siempre se oculta:
const fetchPokemon = async (name) => {
  setLoading(true);
  try {
    // ...
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);  // Se ejecuta SIEMPRE
  }
};
```

---

### "¿Por qué verificas `response.ok` antes de `response.json()`?"

**Respuesta:**
"Porque fetch NO lanza error automáticamente para códigos HTTP de error (404, 500, etc.). Solo falla en errores de red. Si el Pokémon no existe, la API responde con 404 pero fetch considera la request exitosa. Debo verificar manualmente `response.ok` (true si status está entre 200-299) y lanzar un error yo mismo para que caiga en el catch."

**Ejemplo:**
```javascript
// ❌ MALO - No detecta 404:
const response = await fetch('pokemon/asdfasdf');
const data = await response.json();  // JSON de error de la API
setPokemonData(data);  // Muestra mensaje de error como si fuera data

// ✅ BUENO - Detecta y maneja correctamente:
const response = await fetch('pokemon/asdfasdf');
if (!response.ok) {
  throw new Error('Pokémon no encontrado');  // Salta al catch
}
const data = await response.json();  // Solo si response.ok === true
```

**Valores de response.ok:**
```javascript
200 OK          → response.ok = true
404 Not Found   → response.ok = false
500 Server Err  → response.ok = false
```

---

### "¿Por qué calculas `(base_stat / 255) * 100`?"

**Respuesta:**
"255 es el máximo stat posible en los juegos de Pokémon. Para convertir un valor absoluto a porcentaje para la barra de progreso, divido el stat actual entre el máximo y multiplico por 100. Por ejemplo, si un Pokémon tiene 120 de ataque: (120/255)*100 = 47%, entonces la barra llena el 47% del ancho."

**Fórmula general:**
```javascript
porcentaje = (valor_actual / valor_maximo) * 100

// Ejemplos reales:
HP = 48   → (48/255) * 100 = 18.8%   → Barra pequeña
Attack = 150 → (150/255) * 100 = 58.8% → Barra mediana
Defense = 230 → (230/255) * 100 = 90.2% → Barra grande
```

**En el código:**
```javascript
<div 
  className="stat-fill" 
  style={{width: `${(stat.base_stat / 255) * 100}%`}}
></div>
```

---

### "¿Qué significa `replace` en `<Navigate to="/login" replace />`?"

**Respuesta:**
"`replace` modifica el comportamiento del historial de navegación. Normalmente, React Router hace `push` al historial, permitiendo volver atrás con el botón back. Con `replace`, reemplaza la entrada actual del historial en lugar de agregar una nueva. Esto evita que el usuario pueda volver a páginas protegidas usando el botón atrás del navegador."

**Sin replace:**
```
1. Usuario en /login
2. Navega a /home → Historial: [/login, /home]
3. Logout → va a /login
4. Back button → vuelve a /home (🚫 MALO - puede ver sin login)
```

**Con replace:**
```
1. Usuario en /login
2. Navega a /home → Historial: [/login, /home]
3. Logout → reemplaza /home con /login → Historial: [/login, /login]
4. Back button → se queda en /login (✅ BUENO)
```

---

### "¿Cómo funciona template literal en className?"

**Respuesta:**
"Los template literals (backticks) permiten interpolación de variables con `${}`. En este caso, creo una cadena que combina una clase fija `'type-badge'` con una clase dinámica basada en el tipo del Pokémon. Si `type.type.name` es `'fire'`, genera la string `'type-badge fire'`, activando el CSS `.type-badge.fire { background: #F08030; }`."

**Comparación:**
```javascript
// Concatenación tradicional:
className={'type-badge ' + type.type.name}

// Template literal (moderno):
className={`type-badge ${type.type.name}`}

// Resultado HTML:
<span class="type-badge fire">fire</span>
```

**CSS que se activa:**
```css
.type-badge { 
  /* Estilos base para todos */ 
}
.type-badge.fire { 
  background-color: #F08030;  /* Solo para fire */
}
```

---

## 🎯 PREGUNTAS DE ARQUITECTURA

### "¿Por qué creaste ProtectedRoute en lugar de validar en cada página?"

**Respuesta:**
"Siguiendo el principio DRY (Don't Repeat Yourself) y Single Responsibility. Si validara en cada página, tendría que duplicar la lógica de autenticación 6 veces. Con ProtectedRoute, centralizo la lógica en un solo lugar. Si mañana quiero cambiar de localStorage a JWT, solo modifico un archivo en lugar de 6."

**Sin ProtectedRoute (malo):**
```javascript
// En CADA página (Home, AboutUs, Careers, etc.):
function Home() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) return <Navigate to="/login" />;
  return <div>Home content</div>;
}
// 6 veces el mismo código 🚫
```

**Con ProtectedRoute (bueno):**
```javascript
// Una sola vez:
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

// Uso simple en todas las rutas:
<Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
```

---

### "¿Por qué separaste Header y Footer en componentes?"

**Respuesta:**
"Composición de componentes, uno de los pilares de React. Header y Footer son elementos que se repiten en múltiples páginas. Al separarlos, logro:

1. **Reutilización:** Import una vez en cada página en lugar de copiar HTML
2. **Mantenibilidad:** Si cambio el Header, se actualiza en todas las páginas
3. **Testabilidad:** Puedo testear Header independientemente
4. **Organización:** Cada componente tiene su propia carpeta y estilos
5. **Lazy loading:** Podría cargarlo dinámicamente si fuera necesario"

---

### "¿Qué mejorarías del sistema de autenticación?"

**Respuesta:**
"En orden de prioridad:

1. **Backend real:** Express.js/Node con base de datos (PostgreSQL/MongoDB)
2. **JWT tokens:** En lugar de localStorage strings
3. **Hash de contraseñas:** bcrypt para encriptar antes de guardar
4. **HTTPS:** SSL/TLS para encriptar tráfico
5. **Refresh tokens:** Para sesiones largas sin pedir credenciales
6. **Rate limiting:** Prevenir ataques de fuerza bruta
7. **Validaciones robustas:** Regex para email, requisitos de contraseña
8. **OAuth:** Login con Google/GitHub
9. **2FA:** Autenticación de dos factores
10. **Logs de seguridad:** Registrar intentos de login"

---

## 🔥 PREGUNTA TRAMPA TÍPICA

### "¿Por qué guardas la contraseña en texto plano?"

**⚠️ RESPUESTA HONESTA:**
"Es una limitación consciente de este proyecto educativo. En producción NUNCA haría esto. Implementaría:

1. **Hashing con bcrypt:**
   ```javascript
   const hashedPassword = await bcrypt.hash(password, 10);
   // Guardo solo el hash, nunca la contraseña real
   ```

2. **Comparación segura en login:**
   ```javascript
   const match = await bcrypt.compare(inputPassword, user.hashedPassword);
   ```

3. **Sin backend, podría usar:**
   - CryptoJS para hash del lado del cliente
   - Pero aún así no sería seguro porque el código JS es visible
   
**La verdad es que localStorage + contraseñas es inaceptable en producción. Este proyecto simula autenticación para aprender React, no para implementar seguridad real.**"

---

## 💪 CIERRE FUERTE PARA LA PRESENTACIÓN

**Cuando termines, di:**

> "Este proyecto demuestra mi comprensión de los fundamentos de React incluyendo hooks, routing, componentes funcionales, y consumo de APIs. Entiendo que tiene limitaciones de seguridad siendo una aplicación cliente-only, pero demuestra los patrones y arquitectura correctos. En un entorno de producción, movería la lógica de autenticación al servidor, implementaría JWT tokens, hashearía contraseñas con bcrypt, y usaría HTTPS. ¿Hay algún aspecto específico que le gustaría que profundizara?"

**Esto demuestra:**
✅ Confianza en lo que hiciste
✅ Consciencia de limitaciones
✅ Conocimiento de mejores prácticas
✅ Apertura a feedback
✅ Mentalidad de producción

---

**¡Mucha suerte! 🎓🚀**

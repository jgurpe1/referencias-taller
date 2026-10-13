// Datos de las rutas
const rutas = [
  { nombre: 'Senda del río', km: 6, dificultad: 'fácil', fecha: '2026-11-08', precio: 5, plazas: 12 },
  { nombre: 'Collado del lobo', km: 12, dificultad: 'media', fecha: '2026-11-22', precio: 8, plazas: 10 },
  { nombre: 'Pico Alto', km: 18, dificultad: 'difícil', fecha: '2026-12-06', precio: 12, plazas: 8 },
  { nombre: 'Hayedo de otoño', km: 9, dificultad: 'fácil', fecha: '2026-12-13', precio: 6, plazas: 14 },
  { nombre: 'Cresta de las Águilas', km: 15, dificultad: 'difícil', fecha: '2027-01-17', precio: 12, plazas: 8 },
  { nombre: 'Valle de las Fuentes', km: 11, dificultad: 'media', fecha: '2027-01-31', precio: 8, plazas: 10 },
];

// Año del pie de página
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

// Botón de tema oscuro
const botonTema = document.getElementById('tema');
if (botonTema) {
  botonTema.addEventListener('click', () => {
    const oscuro = document.body.classList.toggle('oscuro');
    botonTema.textContent = oscuro ? 'Tema claro' : 'Tema oscuro';
  });
}

// Lista de rutas con filtro
const lista = document.getElementById('lista');
const filtro = document.getElementById('filtro');
let favoritas = [];
try { favoritas = JSON.parse(localStorage.getItem('favoritas')) || []; } catch (e) { favoritas = []; }
function contarFavoritas() {
  const c = document.getElementById('favoritas');
  if (c) c.textContent = 'Favoritas: ' + favoritas.length;
}
function pintar(dificultad) {
  lista.innerHTML = '';
  rutas.filter((r) => dificultad === 'todas' || r.dificultad === dificultad).forEach((r) => {
    const clase = r.dificultad.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const div = document.createElement('div');
    div.className = 'ruta ' + clase;
    div.innerHTML = '<h2>' + r.nombre + '</h2><p>' + r.km + ' km · ' + r.dificultad + '</p><p>Salida: ' + r.fecha + ' · ' + r.precio + ' €</p>';
    const corazon = document.createElement('button');
    corazon.className = 'corazon';
    corazon.textContent = favoritas.includes(r.nombre) ? '♥' : '♡';
    corazon.addEventListener('click', () => {
      if (favoritas.includes(r.nombre)) favoritas = favoritas.filter((n) => n !== r.nombre);
      else favoritas.push(r.nombre);
      try { localStorage.setItem('favoritas', JSON.stringify(favoritas)); } catch (e) {}
      corazon.textContent = favoritas.includes(r.nombre) ? '♥' : '♡';
      contarFavoritas();
    });
    div.appendChild(corazon);
    lista.appendChild(div);
  });
}
if (lista && filtro) {
  contarFavoritas();
  pintar('todas');
  filtro.addEventListener('change', () => pintar(filtro.value));
}

// Formulario: ruta, total en vivo y validación
const formulario = document.getElementById('formulario');
if (formulario) {
  const selector = document.getElementById('ruta');
  const personas = document.getElementById('personas');
  const total = document.getElementById('total');
  rutas.forEach((r, i) => {
    selector.innerHTML += '<option value="' + i + '">' + r.nombre + ' (' + r.precio + ' €)</option>';
  });
  const plazas = document.getElementById('plazas');
  const libres = rutas.map((r) => r.plazas);
  const mostrarPlazas = () => {
    plazas.textContent = libres[selector.value] === 0 ? 'Ruta completa' : 'Plazas disponibles: ' + libres[selector.value];
  };
  const calcular = () => {
    mostrarPlazas();
    total.textContent = 'Total: ' + rutas[selector.value].precio * (parseInt(personas.value, 10) || 0) + ' €';
  };
  selector.addEventListener('change', calcular);
  personas.addEventListener('input', calcular);
  calcular();
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const n = parseInt(personas.value, 10);
    document.getElementById('e-nombre').textContent = nombre === '' ? 'Escribe tu nombre.' : '';
    document.getElementById('e-email').textContent = email.includes('@') ? '' : 'Escribe un correo válido.';
    let errorPersonas = n >= 1 && n <= 6 ? '' : 'Entre 1 y 6 personas.';
    if (errorPersonas === '' && libres[selector.value] === 0) errorPersonas = 'Esta ruta está completa.';
    else if (errorPersonas === '' && n > libres[selector.value]) errorPersonas = 'Solo quedan ' + libres[selector.value] + ' plazas.';
    document.getElementById('e-personas').textContent = errorPersonas;
    const bien = nombre !== '' && email.includes('@') && errorPersonas === '';
    const exito = document.getElementById('exito');
    exito.hidden = !bien;
    if (bien) {
      exito.textContent = 'Plaza reservada para ' + n + ' persona(s) en ' + rutas[selector.value].nombre + '.';
      libres[selector.value] -= n;
      mostrarPlazas();
    }
  });
}

// Próxima salida
const proxima = document.getElementById('proxima');
if (proxima) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const futuras = rutas.filter((r) => new Date(r.fecha) >= hoy).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  if (futuras.length === 0) {
    proxima.textContent = 'No hay salidas programadas por ahora';
  } else {
    const dias = Math.round((new Date(futuras[0].fecha) - hoy) / 86400000);
    proxima.textContent = 'Próxima salida: ' + futuras[0].nombre + ' (en ' + dias + ' días)';
  }
}

// Material recomendado
const material = {
  'fácil': ['Calzado cómodo', 'Agua (1 L)', 'Gorra', 'Crema solar'],
  'media': ['Botas de montaña', 'Agua (1,5 L)', 'Chaqueta impermeable', 'Bastones', 'Comida de ruta'],
  'difícil': ['Botas de montaña', 'Agua (2 L)', 'Chaqueta impermeable', 'Bastones', 'Frontal', 'Mapa y brújula', 'Comida de ruta'],
};
const nivel = document.getElementById('nivel');
if (nivel) {
  const ul = document.getElementById('material');
  const progreso = document.getElementById('progreso');
  const actualizar = () => {
    const marcadas = ul.querySelectorAll('input:checked').length;
    progreso.textContent = ul.children.length ? 'Llevas ' + marcadas + ' de ' + ul.children.length : '';
  };
  nivel.addEventListener('change', () => {
    ul.innerHTML = '';
    (material[nivel.value] || []).forEach((cosa) => {
      const li = document.createElement('li');
      li.innerHTML = '<label><input type="checkbox"> ' + cosa + '</label>';
      li.querySelector('input').addEventListener('change', actualizar);
      ul.appendChild(li);
    });
    actualizar();
  });
}

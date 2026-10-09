// Año del pie de página
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

// Abierto o cerrado según la hora (lunes a sábado, 8:00 a 20:00)
const estado = document.getElementById('estado');
if (estado) {
  const ahora = new Date();
  const abierto = ahora.getDay() !== 0 && ahora.getHours() >= 8 && ahora.getHours() < 20;
  estado.textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora';
  if (abierto) estado.classList.add('abierto');
}

// Filtro de la carta y contador
const botones = document.querySelectorAll('.filtros button');
const productos = document.querySelectorAll('.productos article');
const contador = document.getElementById('contador');
botones.forEach((boton) => {
  boton.addEventListener('click', () => {
    const cat = boton.dataset.cat;
    let visibles = 0;
    botones.forEach((b) => b.classList.toggle('marcado', b === boton));
    productos.forEach((p) => {
      const mostrar = cat === 'todos' || p.dataset.cat === cat;
      p.hidden = !mostrar;
      if (mostrar) visibles++;
    });
    contador.textContent = 'Mostrando ' + visibles + ' productos';
  });
});
if (botones.length) botones[0].classList.add('marcado');

// Validación del formulario de contacto
const formulario = document.getElementById('formulario');
if (formulario) {
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    document.getElementById('e-nombre').textContent = nombre === '' ? 'Escribe tu nombre.' : '';
    document.getElementById('e-email').textContent = email.includes('@') ? '' : 'Escribe un correo válido.';
    document.getElementById('e-mensaje').textContent = mensaje.length < 10 ? 'El mensaje debe tener al menos 10 caracteres.' : '';
    const bien = nombre !== '' && email.includes('@') && mensaje.length >= 10;
    document.getElementById('exito').hidden = !bien;
  });
}

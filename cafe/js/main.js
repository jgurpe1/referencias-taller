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

// Pedido en la carta
const lista = document.getElementById('lista-pedido');
if (lista) {
  const pedido = {};
  const euros = (n) => n.toFixed(2).replace('.', ',') + ' €';
  const pintarPedido = () => {
    lista.innerHTML = '';
    let total = 0;
    Object.keys(pedido).forEach((nombre) => {
      const linea = pedido[nombre];
      total += linea.precio * linea.cantidad;
      const li = document.createElement('li');
      li.textContent = nombre + ' × ' + linea.cantidad + ' — ' + euros(linea.precio * linea.cantidad);
      lista.appendChild(li);
    });
    document.getElementById('total-pedido').textContent = 'Total: ' + euros(total);
  };
  document.querySelectorAll('.anadir').forEach((boton) => {
    boton.addEventListener('click', () => {
      const articulo = boton.parentElement;
      const nombre = articulo.querySelector('h2').textContent;
      const precio = parseFloat(articulo.querySelector('p').textContent.replace(',', '.'));
      if (!pedido[nombre]) pedido[nombre] = { precio: precio, cantidad: 0 };
      pedido[nombre].cantidad++;
      pintarPedido();
    });
  });
  document.getElementById('vaciar').addEventListener('click', () => {
    Object.keys(pedido).forEach((k) => delete pedido[k]);
    pintarPedido();
  });
}

// Formulario de reservas
const formReserva = document.getElementById('form-reserva');
if (formReserva) {
  formReserva.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('r-nombre').value.trim();
    const fecha = document.getElementById('r-fecha').value;
    const hora = document.getElementById('r-hora').value;
    const n = parseInt(document.getElementById('r-personas').value, 10);
    let errorFecha = '';
    if (fecha === '') {
      errorFecha = 'Elige una fecha.';
    } else {
      const dia = new Date(fecha + 'T00:00:00');
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (dia < hoy) errorFecha = 'La fecha no puede ser pasada.';
      else if (dia.getDay() === 0) errorFecha = 'Los domingos estamos cerrados.';
    }
    document.getElementById('er-nombre').textContent = nombre === '' ? 'Escribe tu nombre.' : '';
    document.getElementById('er-fecha').textContent = errorFecha;
    document.getElementById('er-hora').textContent = hora === '' ? 'Elige una hora.' : '';
    document.getElementById('er-personas').textContent = n >= 1 && n <= 8 ? '' : 'Entre 1 y 8 personas.';
    const bien = nombre !== '' && errorFecha === '' && hora !== '' && n >= 1 && n <= 8;
    const exito = document.getElementById('r-exito');
    exito.hidden = !bien;
    if (bien) exito.textContent = 'Reserva para ' + n + ' persona(s) el ' + fecha + ' a las ' + hora + ', a nombre de ' + nombre + '.';
  });
}

const DESCUENTO_TRANSFERENCIA = 0.15;

const vinos = [
  { id: 1, nombre: "Malbec Reserva", precio: 18000 },
  { id: 2, nombre: "Cabernet Reserva", precio: 18000 },
  { id: 3, nombre: "Blend Reserva", precio: 25000 }
];

let carrito = [];
let usuarioLogueado = null;

function mostrarLogin() {
  contenedor.innerHTML = `
    <h2>Ingreso a la tienda</h2>
    <input type="email" id="email" placeholder="Ingresá tu email">
    <button id="btn-login">Ingresar</button>
    <p id="mensaje-login"></p>
  `;

  document
    .getElementById("btn-login")
    .addEventListener("click", loginLibre);
}

function loginLibre() {
  const email = document.getElementById("email").value.trim();
  const mensaje = document.getElementById("mensaje-login");

  if (!email.includes("@")) {
    mensaje.textContent = "Ingresá un email válido (debe contener @)";
    return;
  }

  usuarioLogueado = {
    email: email,
    rol: "cliente"
  };

  iniciarSimulador();
}


const botonIniciar = document.getElementById("iniciar-validacion");
const contenedor = document.getElementById("contenido-js");


if (!mostrarResumenGuardado()) {
  botonIniciar.addEventListener("click", mostrarLogin);
}


function iniciarSimulador() {
  contenedor.innerHTML = `
    <h2>Catálogo de vinos</h2>
    <p>Seleccioná los vinos que quieras agregar al carrito</p>
  `;

  mostrarVinos();
  mostrarCarrito();
  mostrarTotal();
  mostrarOpcionesDePago();
}



function mostrarVinos() {
  const lista = document.createElement("div");

  vinos.forEach((vino) => {
    const item = document.createElement("div");
    item.innerHTML = `<strong>${vino.nombre}</strong> - $${vino.precio}`;

    const botonAgregar = document.createElement("button");
    botonAgregar.textContent = "Agregar al carrito";
    botonAgregar.addEventListener("click", () => agregarVino(vino));

    item.appendChild(botonAgregar);
    lista.appendChild(item);
  });

  contenedor.appendChild(lista);
}



function agregarVino(vino) {
  const vinoExistente = carrito.find(item => item.id === vino.id);

  if (vinoExistente) {
    vinoExistente.cantidad++;
  } else {
    carrito.push({
      ...vino,
      cantidad: 1
    });
  }

  mostrarCarrito();
  mostrarTotal();
}

function aumentarCantidad(id) {
  const item = carrito.find(vino => vino.id === id);
  item.cantidad++;
  mostrarCarrito();
  mostrarTotal();
}

function disminuirCantidad(id) {
  const item = carrito.find(vino => vino.id === id);

  if (item.cantidad > 1) {
    item.cantidad--;
  } else {
    carrito = carrito.filter(vino => vino.id !== id);
  }

  mostrarCarrito();
  mostrarTotal();
}

function mostrarCarrito() {
  let carritoHTML = document.getElementById("carrito");

  if (!carritoHTML) {
    carritoHTML = document.createElement("div");
    carritoHTML.id = "carrito";
    contenedor.appendChild(carritoHTML);
  }

  carritoHTML.innerHTML = "<h3>Carrito</h3>";

  if (carrito.length === 0) {
    carritoHTML.innerHTML += "<p>El carrito está vacío</p>";
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
  <strong>${item.nombre}</strong> - $${item.precio * item.cantidad}
  <button onclick="disminuirCantidad(${item.id})">−</button>
  <span> ${item.cantidad} </span>
  <button onclick="aumentarCantidad(${item.id})">+</button>
`;

    carritoHTML.appendChild(div);
  });
}



function mostrarTotal() {
  let totalHTML = document.getElementById("total");

  if (!totalHTML) {
    totalHTML = document.createElement("p");
    totalHTML.id = "total";
    contenedor.appendChild(totalHTML);
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  totalHTML.textContent = `Total actual: $${total}`;
}

// -------------------------------
// Opciones de pago MOOR
// -------------------------------

function mostrarOpcionesDePago() {
  const seccionPago = document.createElement("div");
  seccionPago.innerHTML = `<h3>Método de pago</h3>`;

  const botonTransferencia = document.createElement("button");
  botonTransferencia.textContent = "Transferencia (15% OFF)";
  botonTransferencia.addEventListener("click", pagarConTransferencia);

  const botonTarjeta = document.createElement("button");
  botonTarjeta.textContent = "Tarjeta";
  botonTarjeta.addEventListener("click", pagarConTarjeta);

  seccionPago.appendChild(botonTransferencia);
  seccionPago.appendChild(botonTarjeta);

  contenedor.appendChild(seccionPago);
}



function pagarConTransferencia() {
  if (carrito.length === 0) {
    mostrarMensaje("No seleccionaste ningún vino.");
    return;
  }

  const total = calcularTotal();
  const totalConDescuento = total - total * DESCUENTO_TRANSFERENCIA;

  finalizarCompra(`Pago con transferencia aplicado (15% OFF). Total: $${totalConDescuento}`);
}

function pagarConTarjeta() {
  if (carrito.length === 0) {
    mostrarMensaje("No seleccionaste ningún vino.");
    return;
  }

  finalizarCompra(`Pago con tarjeta seleccionado. Total: $${calcularTotal()}`);
}



function calcularTotal() {
  return carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
}
function finalizarCompra(mensaje) {
     localStorage.setItem("resumenCompra", mensaje);


  contenedor.innerHTML = `
    <h2>Resumen de compra</h2>
    <p>${mensaje}</p>
    <p>¡Gracias por tu compra 🍷!</p>
    <button id="btn-logout">Salir</button>
  `;

  carrito = [];

  document
    .getElementById("btn-logout")
    .addEventListener("click", () => {
      usuarioLogueado = null;
      mostrarLogin();
    });
}


function mostrarMensaje(texto) {
  const mensaje = document.createElement("p");
  mensaje.textContent = texto;
  contenedor.appendChild(mensaje);
}
function mostrarResumenGuardado() {
  const resumen = localStorage.getItem("resumenCompra");

  if (resumen) {
    contenedor.innerHTML = `
      <h2>Resumen de compra</h2>
      <p>${resumen}</p>
      <p>¡Gracias por tu compra 🍷!</p>
      <button id="btn-logout">Salir</button>
    `;

    document.getElementById("btn-logout").addEventListener("click", () => {
      localStorage.removeItem("resumenCompra");
      usuarioLogueado = null;
      mostrarLogin();
    });

    return true;
  }

  return false;
}

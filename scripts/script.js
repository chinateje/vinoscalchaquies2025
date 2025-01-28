
const CIUDADES_VALIDAS = ['buenos aires', 'la plata', 'quilmes'];


function solicitarDatos() {
    const edad = prompt('Ingrese su edad:');

    if (!edad || edad < 18) {
        alert('Debe ser mayor de 18 años para continuar.');
        return null;
    }

    const pais = prompt('Ingrese su país de residencia:');
    if (!pais || pais !== 'argentina') {
        alert('Solo se permite el acceso a residentes de Argentina.');
        return null;
    }

    const ciudad = prompt('Ingrese su ciudad de residencia:');
    return { edad, pais, ciudad };
}

function validarCliente(cliente) {
    if (!cliente) {
        console.error('No se pudo validar al cliente por datos incompletos o erróneos.');
        return false;
    }

    for (let i = 0; i < CIUDADES_VALIDAS.length; i++) {
        if (cliente.ciudad === CIUDADES_VALIDAS[i]) {
            return true;
        }
    }

    alert('Solo se permite el acceso a residentes de Buenos Aires, La Plata o Quilmes.');
    return false;
}

function mostrarResultados(esValido) {
    if (esValido) {
        console.log('El cliente cumple con todos los requisitos para ingresar.');
        alert('¡Bienvenido a la página de vinos!');
    } else {
        console.error('El cliente no cumple con los requisitos para ingresar.');
    }
}

function iniciarSimulador() {
    const cliente = solicitarDatos();
    const esValido = validarCliente(cliente);
    mostrarResultados(esValido);
}

document.getElementById('iniciar-validacion').onclick = iniciarSimulador;

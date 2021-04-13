//
const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Promises
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);
  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

// Funcion async que consulta la API para abtener un listado las criptomoedas
async function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  //Intentamos obtener la respuesta  y lanzar el resultado
  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    const criptomonedas = await obtenerCriptomonedas(resultado.Data);
    selectCriptomonedas(criptomonedas);
  } catch (error) {
    console.log(error);
  }
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    // insertar el HTML
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  // Extraer los valores
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const divMensaje = document.createElement("div");
  divMensaje.classList.add("error");

  divMensaje.textContent = mensaje;

  formulario.appendChild(divMensaje);
  setTimeout(() => {
    divMensaje.remove();
  }, 3000);
}

//Funcion asincrona que consulta la api
async function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  const respuesta = await fetch(url);
  const cotizacion = await respuesta.json();
  mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  console.log(cotizacion);
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El Precio de ${objBusqueda.criptomoneda} es: <span> ${PRICE} </span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `<p>Precio más alto hoy: <span>${HIGHDAY}</span> </p>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `<p>Precio más bajo de hoy: <span>${LOWDAY}</span> </p>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);

  formulario.appendChild(resultado);
}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

  resultado.appendChild(spinner);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

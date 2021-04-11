const criptomonedasSelector = document.querySelector("#criptomonedas");
const monedaSelector = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");

const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

//Promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelector.addEventListener("change", leerValor);
  monedaSelector.addEventListener("change", leerValor);
});

function leerValor(e) {
  //Pasamos el nombre de la criptomoneda
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  //validamos la informacion
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos Campos son obligatorios");
    return;
  }

  //Consultando la api
  consultarAPI();
}

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    //Extraemos el nombre de la criptomoneda
    const { FullName, Name } = cripto.CoinInfo;

    //Creamos las opciones de criptomoneadas y les pasamos el nombre de la criptomoneda
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelector.appendChild(option);
  });
}

function mostrarAlerta(msj) {
  const existeError = document.querySelector(".error");

  if (!existeError) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");

    //Mensaje de error
    divMensaje.textContent = msj;

    formulario.appendChild(divMensaje);

    const tiempoMsj = 3000;
    setTimeout(() => {
      divMensaje.remove();
    }, tiempoMsj);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarLoading();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      mostrarCotizacionMonedaHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacionMonedaHTML(cotizacion) {
  limpiarHTML();
  //Valores de la api
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es <span>${PRICE}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.classList.add("precio");
  precioAlto.innerHTML = `Valor mas alto es <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("p");
  precioBajo.classList.add("precio");
  precioBajo.innerHTML = `Valor mas bajo es <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.classList.add("precio");
  ultimasHoras.innerHTML = `Variacion de las ultimas 24 hrs <span>${CHANGEPCT24HOUR}%</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarLoading() {
  limpiarHTML();
  const loading = document.createElement("div");
  loading.classList.add("spinner");

  loading.innerHTML = `
  <div class = "bounce1"></div>
  <div class = "bounce2"></div>
  <div class = "bounce3"></div>
 
  `;

  resultado.appendChild(loading);
}

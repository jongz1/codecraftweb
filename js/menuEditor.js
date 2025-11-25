document.addEventListener("DOMContentLoaded", () => {

    const panel = document.querySelector(".panel");

    // Secciones
    const opcionesColor = panel.querySelector(".opciones-color");
    const opcionesTipografia = panel.querySelector(".opciones-tipografia");

    // entrada color
    const inputFondo = opcionesColor.querySelectorAll("input")[0];
    const inputTexto = opcionesColor.querySelectorAll("input")[1];

    // entrada tipografía
    const inputTamaño = opcionesTipografia.querySelectorAll("input")[0];
    const inputPeso = opcionesTipografia.querySelectorAll("select")[0];
    const inputEstilo = opcionesTipografia.querySelectorAll("select")[1];

    const pre = panel.querySelector(".codigo-css pre");
    const botonEstilizar = panel.querySelector(".btn-estilizar");

    const elementoReal = document.querySelector(".elemento-ejemplo");

    // tabs
    document.querySelector("#btnColor").addEventListener("click", () => {
        opcionesColor.style.display = "block";
        opcionesTipografia.style.display = "none";
    });

    document.querySelector("#btnTipografia").addEventListener("click", () => {
        opcionesColor.style.display = "none";
        opcionesTipografia.style.display = "block";
    });

    function actualizarCodigo() {
        pre.textContent =
`.elemento-ejemplo {
    background-color: ${inputFondo.value};
    color: ${inputTexto.value};
    font-size: ${inputTamaño.value}px;
    font-weight: ${inputPeso.value};
    font-style: ${inputEstilo.value};
}`;
    }

    // eventos
    inputFondo.addEventListener("input", actualizarCodigo);
    inputTexto.addEventListener("input", actualizarCodigo);
    inputTamaño.addEventListener("input", actualizarCodigo);
    inputPeso.addEventListener("change", actualizarCodigo);
    inputEstilo.addEventListener("change", actualizarCodigo);

    botonEstilizar.addEventListener("click", () => {
        if (!elementoReal) return;

        elementoReal.style.backgroundColor = inputFondo.value;
        elementoReal.style.color = inputTexto.value;

        elementoReal.style.fontSize = inputTamaño.value + "px";
        elementoReal.style.fontWeight = inputPeso.value;
        elementoReal.style.fontStyle = inputEstilo.value;
    });

    actualizarCodigo();
});

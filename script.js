let galponUno = prompt("Ingrese un valor");
let galponDos = prompt("Ingrese un valor");
let galponTres = prompt("Ingrese un valor");

eggCount = parseInt(galponUno) + parseInt(galponDos) + parseInt(galponTres);

const totalButton = document.getElementById("totalButton");
totalButton.addEventListener("click", function() {
    alert("El total de huevos es: " + eggCount);
});

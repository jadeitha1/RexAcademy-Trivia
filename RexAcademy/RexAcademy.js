document.getElementById("startBtn").addEventListener("click", () => {
  window.location.href = "temas.html";
});
function seleccionarTema(tema) {
  if (tema === 'software-libre') {
    window.location.href = 'niveles.html';
  } else {
    alert("Este tema aún está en mantenimiento. Vuelve pronto con un rugido feroz 🦴");
  }
}
function seleccionarNivel(nivel) {
  if (nivel === 1) {
    window.location.href = 'juego.html?nivel=1';
  } else {
    alert("Este nivel aún está en mantenimiento. ¡Vuelve pronto con un rugido feroz! 🦴");
  }
}


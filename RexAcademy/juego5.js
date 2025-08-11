// Preguntas y respuestas para nivel 5 - T-Rex (difícil y variado)
const preguntasOriginal = [
  {
    pregunta: "¿Qué característica distingue al software libre del software de código abierto?",
    opciones: [
      "El software libre enfatiza las libertades éticas y sociales, el código abierto se enfoca en el desarrollo colaborativo",
      "El software libre es siempre gratuito, el código abierto no",
      "El software libre solo funciona en Linux, el código abierto en cualquier SO",
      "No hay diferencias, son sinónimos"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Cuál es el propósito principal de la Licencia Pública General GNU (GPL)?",
    opciones: [
      "Garantizar que las libertades del software se mantengan en todas las versiones derivadas",
      "Permitir que el software sea usado solo en proyectos no comerciales",
      "Evitar que el software sea copiado o modificado",
      "Limitar el uso del software a usuarios certificados"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué es la 'viralidad' en licencias como la GPL?",
    opciones: [
      "Que las modificaciones deben mantenerse también bajo la misma licencia",
      "Que el software se puede propagar por correo electrónico",
      "Que el software puede infectar sistemas operativos",
      "Que el código se vuelve inaccesible tras ciertas modificaciones"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Cuál es la diferencia clave entre software libre y software propietario?",
    opciones: [
      "El software libre garantiza acceso al código fuente y libertades para modificar y distribuir",
      "El software propietario es siempre gratuito",
      "El software libre no puede ser vendido",
      "El software propietario es desarrollado por la comunidad"
    ],
    correcta: 0
  },
  {
    pregunta: "¿Qué herramienta de gestión de versiones es esencial en proyectos colaborativos de software libre?",
    opciones: ["Git", "SVN", "Dropbox", "OneDrive"],
    correcta: 0
  },
  {
    pregunta: "¿Quién fundó la Free Software Foundation (FSF)?",
    opciones: ["Richard Stallman", "Linus Torvalds", "Mark Shuttleworth", "Bill Gates"],
    correcta: 0
  }
];

// Mezcla las opciones de cada pregunta y actualiza índice correcta
function mezclarOpciones(preguntaObj) {
  const opciones = preguntaObj.opciones.map((op, i) => ({ op, i }));
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
  }
  const nuevaCorrecta = opciones.findIndex(o => o.i === preguntaObj.correcta);
  return {
    pregunta: preguntaObj.pregunta,
    opciones: opciones.map(o => o.op),
    correcta: nuevaCorrecta
  };
}

// Mezcla el orden de las preguntas
function mezclarPreguntas(array) {
  const copia = array.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Mezclar preguntas y luego las opciones de cada pregunta
const preguntasMezcladasOriginales = mezclarPreguntas(preguntasOriginal);
const preguntasMezcladas = preguntasMezcladasOriginales.map(p => mezclarOpciones(p));

// Variables y elementos DOM
let index = 0;
let vidas = 3;
let puntos = 0;
let respuestasCorrectas = 0;
let tiempoRestante = 15;
let temporizadorInterval;

const contenedor = document.getElementById("contenedor-pregunta");
const mensaje = document.getElementById("mensaje");
const puntosSpan = document.getElementById("puntos");
const finalizarBtn = document.getElementById("finalizar");

function cargarPregunta() {
  tiempoRestante = 15;
  const q = preguntasMezcladas[index];
  mensaje.textContent = "";

  contenedor.innerHTML = `
      <h2>${q.pregunta}</h2>
      ${q.opciones.map((op, i) => `<button onclick="responder(${i})" class="btn">${op}</button>`).join("")}
  `;

  iniciarTemporizador();
}

function iniciarTemporizador() {
  const barra = document.getElementById("barra-tiempo");
  const textoTiempo = document.getElementById("texto-tiempo");

  barra.style.width = "100%";
  barra.style.backgroundColor = "green";
  textoTiempo.textContent = `${tiempoRestante}s`;

  clearInterval(temporizadorInterval);
  temporizadorInterval = setInterval(() => {
    tiempoRestante--;
    barra.style.width = (tiempoRestante / 15) * 100 + "%";
    textoTiempo.textContent = `${tiempoRestante}s`;

    if (tiempoRestante <= 7) barra.style.backgroundColor = "orange";
    if (tiempoRestante <= 3) {
      barra.style.backgroundColor = "red";
      textoTiempo.textContent = "⚡ ¡Apúrate!";
    }

    if (tiempoRestante <= 0) {
      clearInterval(temporizadorInterval);
      textoTiempo.textContent = "⏳";
      responder(-1);
    }
  }, 1000);
}

function responder(opcionSeleccionada) {
  clearInterval(temporizadorInterval);

  const correcta = preguntasMezcladas[index].correcta;
  const botones = contenedor.querySelectorAll("button");
  botones.forEach(b => (b.disabled = true));

  if (opcionSeleccionada === correcta) {
    respuestasCorrectas++;
    mensaje.textContent = "¡Correcto! 👑 Has conquistado esta prueba.";
    puntos += 10;
    puntosSpan.textContent = puntos;
  } else {
    mensaje.textContent = "¡Incorrecto! 💀 Has perdido una garra.";
    vidas--;
    document.querySelectorAll(".garra")[vidas].style.opacity = 0.2;

    if (vidas === 0) {
      mensaje.textContent = "🦖 Fin del juego, T-Rex te ha vencido. Intenta otra vez.";
      contenedor.innerHTML = `
        <button onclick="location.reload()" class="btn">Reintentar Nivel</button>
        <button onclick="window.location.href='niveles.html'" class="btn">Volver al Mapa</button>
      `;
      return;
    }
  }

  setTimeout(() => {
    index++;
    if (index < preguntasMezcladas.length) {
      cargarPregunta();
    } else {
      contenedor.innerHTML = "";
      if (respuestasCorrectas === preguntasMezcladas.length) {
        mensaje.textContent = "¡Felicidades, eres leyenda Rex! 👑🦖";
        desbloquearNivel(6); // nivel secreto si quieres
      } else {
        mensaje.textContent = "No lograste superar el nivel, ¡intenta otra vez!";
        index = 0;
        vidas = 3;
        puntos = 0;
        respuestasCorrectas = 0;
        puntosSpan.textContent = puntos;

        setTimeout(() => {
          mensaje.textContent = "";
          cargarPregunta();
        }, 3000);
      }
    }
  }, 1500);
}

finalizarBtn.addEventListener("click", () => {
  window.location.href = "niveles.html";
});

function desbloquearNivel(nivel) {
  localStorage.setItem(`nivel${nivel}_desbloqueado`, "true");
  setTimeout(() => {
    window.location.href = "niveles.html";
  }, 1000);
}

cargarPregunta();

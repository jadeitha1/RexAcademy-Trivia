function mezclarPreguntas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const preguntasOriginales = [
    {
        pregunta: "¿Qué organización promueve el software libre a través de la Free Software Definition?",
        opciones: ["Mozilla Foundation", "GNU Project", "Free Software Foundation", "Apache Software"],
        correcta: 2
    },
    {
        pregunta: "¿Qué significa 'copyleft'?",
        opciones: [
            "Prohibir copiar software",
            "Devolver derechos a la empresa",
            "Permitir copiar, modificar y distribuir con la misma libertad",
            "Software ilegal"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Cuál es el núcleo del sistema operativo GNU/Linux?",
        opciones: ["Ubuntu", "Windows", "Kernel Linux", "Shell Bash"],
        correcta: 2
    },
    {
        pregunta: "¿Qué lenguaje de programación se usa mucho en proyectos de software libre?",
        opciones: ["Visual Basic", "Python", "C#", "COBOL"],
        correcta: 1
    },
    {
        pregunta: "¿Qué navegador es software libre?",
        opciones: ["Google Chrome", "Firefox", "Safari", "Opera"],
        correcta: 1
    },
    {
        pregunta: "¿Qué plataforma permite colaborar en proyectos de código abierto?",
        opciones: ["Facebook", "Zoom", "GitHub", "Netflix"],
        correcta: 2
    }
];

let index = 0;
let vidas = 3;
let puntos = 0;
let respuestasCorrectas = 0;
let tiempoRestante = 15;
let temporizadorInterval;

let preguntasMezcladas = mezclarPreguntas([...preguntasOriginales]);

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
    tiempoRestante = 15;
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

    const botones = document.querySelectorAll("#contenedor-pregunta button");
    botones.forEach((b) => (b.disabled = true));

    if (opcionSeleccionada === correcta) {
        respuestasCorrectas++;
        mensaje.textContent = "¡Correcto! 🦖 Sigues afilando tus garras.";
        puntos += 10;
        puntosSpan.textContent = puntos;
    } else {
        mensaje.textContent = "¡Incorrecto! Perdiste una garra... 🦴";
        vidas--;
        document.querySelectorAll(".garra")[vidas].style.opacity = 0.2;
        if (vidas === 0) {
            mensaje.textContent = "🦖 Has sido cazado. Intenta de nuevo.";

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

            if (vidas > 0 && puntos === preguntasMezcladas.length * 10) {
                mensaje.textContent = "🎉 ¡Completaste el nivel 2 sin errores!";
                desbloquearNivel(3);
            } else {
                mensaje.textContent = "❌ No lograste completar el nivel correctamente.";
                contenedor.innerHTML = `
                    <button onclick="location.reload()" class="btn">Reintentar Nivel</button>
                    <button onclick="window.location.href='niveles.html'" class="btn">Volver al Mapa</button>
                `;
            }
        }
    }, 1500);
}

function desbloquearNivel(nivel) {
    localStorage.setItem(`nivel${nivel}_desbloqueado`, "true");
    finalizarBtn.classList.remove("oculto");
}

finalizarBtn.addEventListener("click", () => {
    window.location.href = "niveles.html";
});

cargarPregunta();

function mezclarPreguntas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const preguntasOriginales = [
    {
        pregunta: "¿Cuál de estas libertades no forma parte de las 4 libertades del software libre?",
        opciones: [
            "Libertad de ejecutar el programa como se desee",
            "Libertad de modificar el código fuente",
            "Libertad de redistribuir copias modificadas",
            "Libertad de patentar el software como propio"
        ],
        correcta: 3
    },
    {
        pregunta: "¿Qué diferencia fundamental hay entre software libre y de código abierto?",
        opciones: [
            "El software libre prioriza la ética, el de código abierto la eficiencia",
            "Ambos son exactamente lo mismo",
            "El software libre es solo para Linux",
            "El de código abierto es ilegal"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué organización promueve activamente el uso de software libre?",
        opciones: ["FSF (Free Software Foundation)", "NSA", "Apple", "Microsoft"],
        correcta: 0
    },
    {
        pregunta: "¿Cuál es una desventaja potencial del software libre?",
        opciones: [
            "Puede no tener soporte comercial inmediato",
            "No permite modificaciones",
            "Siempre cuesta dinero",
            "Su código fuente no es visible"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué comando en GNU/Linux se usa para ver los permisos de un archivo?",
        opciones: ["chmod", "ls -l", "grep", "rm -r"],
        correcta: 1
    },
    {
        pregunta: "¿Cuál de estos entornos de escritorio es libre?",
        opciones: ["GNOME", "Windows 10", "macOS", "Unity (de Apple)"],
        correcta: 0
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

    const botones = contenedor.querySelectorAll("button");
    botones.forEach((b) => (b.disabled = true));

    if (opcionSeleccionada === correcta) {
        respuestasCorrectas++;
        mensaje.textContent = "¡Correcto! 🧠 ¡Estás dominando esta era!";
        puntos += 10;
        puntosSpan.textContent = puntos;
    } else {
        mensaje.textContent = "¡Incorrecto! ⚠️ Has perdido una garra.";
        vidas--;
        document.querySelectorAll(".garra")[vidas].style.opacity = 0.2;

        if (vidas === 0) {
            mensaje.textContent = "☠️ Has sido cazado. Intenta de nuevo.";
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
                mensaje.textContent = "¡Completaste el nivel 4 sin fallar ni una! 🦖🔥";
                desbloquearNivel(5);
            } else {
                mensaje.textContent = "No lograste responder todas correctamente. ¡Inténtalo de nuevo!";
                index = 0;
                vidas = 3;
                puntos = 0;
                respuestasCorrectas = 0;
                puntosSpan.textContent = puntos;

                preguntasMezcladas = mezclarPreguntas([...preguntasOriginales]);

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

window.onload = () => {
    cargarPregunta();
};


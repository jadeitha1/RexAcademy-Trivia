function mezclarPreguntas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const preguntasOriginales = [
    {
        pregunta: "¿Qué es el software libre?",
        opciones: [
            "Software que permite usar, estudiar, modificar y compartir libremente",
            "Software gratuito sin licencia",
            "Software con código cerrado",
            "Software ilegal"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Qué licencia es usada comúnmente en software libre?",
        opciones: ["GPL", "Trial", "Propietaria", "Microsoft License"],
        correcta: 0
    },
    {
        pregunta: "¿Quién fundó el proyecto GNU?",
        opciones: ["Bill Gates", "Richard Stallman", "Linus Torvalds", "Steve Jobs"],
        correcta: 1
    },
    {
        pregunta: "¿Qué ventaja tiene el software libre?",
        opciones: [
            "Permite a cualquiera modificar el código",
            "Solo lo puede usar una empresa",
            "No se puede distribuir",
            "Es más costoso"
        ],
        correcta: 0
    },
    {
        pregunta: "¿Cuál de estos NO es un sistema operativo libre?",
        opciones: ["Ubuntu", "Fedora", "Windows", "Debian"],
        correcta: 2
    },
    {
        pregunta: "¿Cuál de estos es un ejemplo de navegador libre?",
        opciones: ["Firefox", "Safari", "Internet Explorer", "Edge"],
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
const siguienteBtn = document.getElementById("siguiente");
const finalizarBtn = document.getElementById("finalizar");

function cargarPregunta() {
    tiempoRestante = 15; // Reiniciar tiempo

    const q = preguntasMezcladas[index];
    mensaje.textContent = "";
    siguienteBtn.classList.add("oculto");

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
    const correcta = preguntasMezcladas[index].correcta;  // <--- aquí usas preguntasMezcladas

    const botones = document.querySelectorAll("#contenedor-pregunta button");
    botones.forEach((b) => (b.disabled = true));

    if (opcionSeleccionada === correcta) {
        respuestasCorrectas++;
        mensaje.textContent = "¡Correcto! 🦕 Bien hecho.";
        puntos += 10;
        puntosSpan.textContent = puntos;
    } else {
        mensaje.textContent = "¡Incorrecto! 🦴 Has perdido una garra.";
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
        if (index < preguntasMezcladas.length) {  // mejor usar preguntasMezcladas.length aquí
            cargarPregunta();
        } else {
            contenedor.innerHTML = "";
            if (respuestasCorrectas === preguntasMezcladas.length) {
                mensaje.textContent = "¡Completaste el nivel 1 con todas correctas! 🎉";
                desbloquearNivel(2);
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

cargarPregunta();

function desbloquearNivel(nivel) {
    localStorage.setItem(`nivel${nivel}_desbloqueado`, "true");
    setTimeout(() => {
        window.location.href = "niveles.html";
    }, 1000);
}

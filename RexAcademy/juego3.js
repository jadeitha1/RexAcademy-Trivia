function mezclarPreguntas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const preguntasOriginales = [
    {
        pregunta: "¿Cuál es la diferencia principal entre software libre y software de código abierto?",
        opciones: [
            "No hay diferencia, son lo mismo",
            "Software libre enfatiza la libertad del usuario, mientras código abierto se enfoca en el modelo de desarrollo",
            "Software libre siempre es gratis y código abierto siempre es pagado",
            "Código abierto es ilegal en algunos países"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Cuál de estas licencias NO es considerada una licencia de software libre?",
        opciones: [
            "GPL (General Public License)",
            "Apache License",
            "Creative Commons Attribution-NonCommercial",
            "MIT License"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Qué significa 'copyleft' en el contexto de licencias de software libre?",
        opciones: [
            "Prohibición total de distribución",
            "Permitir que el software se use sin modificar",
            "La obligación de distribuir derivadas bajo la misma licencia",
            "Un tipo de licencia propietaria"
        ],
        correcta: 2
    },
    {
        pregunta: "¿Cuál es un beneficio clave del modelo de desarrollo colaborativo en software libre?",
        opciones: [
            "Menor calidad porque cualquiera puede cambiar el código",
            "Mayor innovación gracias a contribuciones globales",
            "Sólo se puede usar en proyectos pequeños",
            "No requiere documentación"
        ],
        correcta: 1
    },
    {
        pregunta: "¿Qué proyecto famoso está bajo licencia GPL y es un núcleo para muchos sistemas operativos?",
        opciones: ["Windows NT", "Linux Kernel", "macOS Darwin", "Android"],
        correcta: 1
    },
    {
        pregunta: "¿Cuál de estas afirmaciones sobre la Free Software Foundation (FSF) es correcta?",
        opciones: [
            "Promueve software propietario",
            "Fue fundada por Richard Stallman para promover software libre",
            "Es una empresa de software comercial",
            "Desarrolla hardware de código abierto"
        ],
        correcta: 1
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
                <button onclick="location.reload()" class="btn"> Reintentar Nivel</button>
                <button onclick="window.location.href='niveles.html'" class="btn"> Volver al Mapa</button>
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
                mensaje.textContent = "¡Completaste el nivel 3 con todas correctas! 🎉";
                desbloquearNivel(4);
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

function desbloquearNivel(nivel) {
    localStorage.setItem(`nivel${nivel}_desbloqueado`, "true");
    setTimeout(() => {
        window.location.href = "niveles.html";
    }, 1500);
}

finalizarBtn.addEventListener("click", () => {
    window.location.href = "niveles.html";
});

window.onload = () => {
    cargarPregunta();
};

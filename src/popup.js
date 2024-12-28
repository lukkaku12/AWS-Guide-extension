import "driver.css";
import { driver as Driver } from "driver.js";
import dotenv from "dotenv";

dotenv.config();

// Escuchar tanto el botón como la tecla Enter
document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("chat-input");
  const sendButton = document.getElementById("sendButton");
  const guideButton = document.getElementById("guideButton"); // Botón para activar la guía

  const handleUserInput = async () => {
    const userMessage = inputField.value.trim();
    if (!userMessage) {
      alert("Por favor, escribe un mensaje.");
      return;
    }

    // Mostrar mensaje del usuario
    appendMessage("Usuario: " + userMessage, "user");
    inputField.value = ""; // Limpiar el input

    // Enviar mensaje a la API
    const aiMessage = await sendMessageToAI(userMessage);

    // Mostrar respuesta de la IA
    appendMessage("IA: " + aiMessage, "ai");
  };


  // Activar guía manualmente desde un botón

  sendButton.addEventListener("click", handleUserInput);
  guideButton.addEventListener("click", () => {
    chrome.scripting.executeScript({
      target: { tabId: chrome.tabs.TAB_ID },
      files: ['content.js']
    });
  }); // Escuchar el clic del botón guía

  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleUserInput();
    }
  });
});

// Función para convertir Markdown a HTML (para negrita y enlaces)
function convertMarkdownToHTML(text) {
  let result = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );
  result = result.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  return result;
}

// Función para mostrar mensajes en el chat
function appendMessage(message, sender) {
  const chatOutput = document.getElementById("chat-output");
  const messageElement = document.createElement("div");

  messageElement.innerHTML = convertMarkdownToHTML(message);
  messageElement.classList.add(
    sender === "user" ? "user-message" : "ai-message"
  );

  chatOutput.appendChild(messageElement);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Función para enviar mensaje a OpenAI
export async function sendMessageToAI(message, retries = 3) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que ayuda con la plataforma de AWS, en todos sus servicios de manera óptima. Al dar la respuesta, sé concisa, clara y precisa.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error al conectar con OpenAI:", error);
    return "Hubo un error al procesar tu solicitud.";
  }
}

// Función para capturar elementos del DOM actual
function capturarElementosDOM() {
  return Array.from(document.querySelectorAll("button, input, a")).map(
    (el) => ({
      tag: el.tagName,
      text: el.innerText || el.value || "",
      classes: el.className,
      id: el.id,
      selector: el.id
        ? `#${el.id}`
        : el.className
            .split(" ")
            .map((c) => `.${c}`)
            .join(" "),
    })
  );
}

// Función para generar pasos dinámicos con OpenAI
async function generarPasosConIA() {
  const elementosPagina = capturarElementosDOM();
  console.log(elementosPagina);
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  try {
    const inputValue = document.getElementById("chat-input").value; // Obtener el valor del input

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que ayuda a crear guías interactivas basadas en la interfaz de usuario de una página web, específicamente para ser utilizadas con Driver.js.",
          },
          {
            role: "user",
            content: `
          El usuario ha ingresado el siguiente texto: "${inputValue}". 
          Ahora, genera una serie de pasos interactivos basados en estos elementos del DOM, considerando que el usuario quiere realizar la acción: "${inputValue}". 
          Cada paso debe seguir este formato:
          1. Descripción del paso (¿qué debe hacer el usuario?).
          2. Selector de elemento (¿qué elemento del DOM debe ser utilizado?).
          3. Acción esperada (¿qué ocurrirá después de realizar la acción?).`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error al generar pasos con IA:", error);
    return "Hubo un error al generar los pasos.";
  }
}

// Función para iniciar la guía interactiva
function startDriverGuide(pasos) {
  const driver = new Driver();
  driver.setSteps(pasos);
  driver.drive();
}
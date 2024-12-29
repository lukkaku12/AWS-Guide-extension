
import dotenv from "dotenv";
import { obtenerElementosPagina, startDriverGuide } from "./background";

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
  guideButton.addEventListener("click", async () => {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    //   const tabId = tabs[0].id;
    //   console.log("Tab ID:", tabId); // Verifica el tabId que se obtiene
  
    //   if (tabs[0].url.includes("aws")) {
    //     console.log("AWS Detected: Showing Guide");
  
    //     chrome.runtime.sendMessage({ action: "injectScript", tabId: tabId });
    //   }
    // });
    const elementosPagina = await obtenerElementosPagina();
    const DriverGuide = await generarPasosConIA(elementosPagina);
    console.log(DriverGuide)
    const pasos = JSON.parse(DriverGuide);
    console.log(pasos)
    startDriverGuide(pasos);
  });

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
export function capturarElementosDOM() {
  return Array.from(document.querySelectorAll("button, input, a")).map((el) => ({
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
  }));
}

function limpiarJSON(respuesta) {
  return respuesta.replace(/```json|```/g, "").trim();
}

async function generarPasosConIA(elementosPagina) {;
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
              "Eres un asistente experto en crear guías interactivas basadas en Driver.js. Responde siempre en formato JSON válido para su uso directo con Driver.js.",
          },
          {
            role: "user",
            content: `
              Basándote en los elementos siguientes: "${elementosPagina}"
              y en el texto proporcionado: "${inputValue}",
              genera pasos interactivos para Driver.js en el siguiente formato estricto:
              [
                {
                  "element": "selector del elemento en formato CSS",
                  "popover": {
                    "title": "Título descriptivo del paso",
                    "description": "Explicación clara de la acción que debe realizar el usuario."
                  }
                },
                {
                  "element": "otro selector",
                  "popover": {
                    "title": "Otro título",
                    "description": "Otra descripción"
                  }
                }
              ]
              No proporciones ninguna otra información, explicación o texto adicional.
            `,
          },
        ],
      }),
    });

    const data = await response.json();
    
    return limpiarJSON(data.choices[0].message.content.trim());
  } catch (error) {
    console.error("Error al generar pasos con IA:", error);
    return "Hubo un error al generar los pasos.";
  }
}

// Función para iniciar la guía interactiva

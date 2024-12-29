import { capturarElementosDOM } from "./popup";
import { driver as Driver } from "driver.js";
import "driver.css";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "injectScript") {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        files: ['content.js'],
      });

      chrome.scripting.insertCSS({
        target: { tabId: message.tabId },
        files: ['styles.css']
      }).catch((err) => {
        console.error('Error al inyectar el CSS:', err);
      });
    }
  });

  export function obtenerElementosPagina() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
  
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            function: capturarElementosDOM,
          },
          (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
              return;
            }
            const elementosCapturados = result[0]?.result || [];
            resolve(elementosCapturados);
          }
        );
      });
    });
  }
  

 export function startDriverGuide(pasos) {



    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['driver.js']
      });
      () => {
        console.log("no ha funcionado aun el script");
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            func: function (steps) {
              console.log("Driver.js cargado correctamente");
const driver = new Driver();
              console.log("Pasos recibidos:", steps); 
              driver.setSteps(steps);
              driver.drive();
            },
            args: [pasos], // Pasar los pasos como argumento
          },
          () => {
            console.log("Driver.js ejecutado correctamente");
          }
        );

      }
  
    });
  }
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
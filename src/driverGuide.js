export function handleGuideActivation() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;

    if (!tabId) {
      console.error('No se encontró una pestaña activa.');
      return;
    }

    // Inyecta el script de Driver.js en la página activa
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ['src/driver.js'], // Ruta correcta al archivo driver.js
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(`Error al inyectar driver.js: ${chrome.runtime.lastError.message}`);
          return;
        }

        // Ahora inyectamos los pasos después de cargar driver.js
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            // Crear y configurar el recorrido con Driver.js
            const driver = new Driver();

            driver.setSteps([
              {
                element: '#google-login-button',
                popover: {
                  title: 'Google Login',
                  description: 'Haz clic aquí para iniciar sesión con Google.',
                  position: 'bottom',
                },
              },
              {
                element: '#email-input',
                popover: {
                  title: 'Email Input',
                  description: 'Ingresa tu email.',
                  position: 'bottom',
                },
              },
              {
                element: '#password-input',
                popover: {
                  title: 'Password Input',
                  description: 'Ingresa tu contraseña.',
                  position: 'bottom',
                },
              },
              {
                element: '#submit-button',
                popover: {
                  title: 'Submit Button',
                  description: 'Haz clic para iniciar sesión.',
                  position: 'bottom',
                },
              },
            ]);

            // Iniciar el recorrido
            driver.drive();
          },
        });
      }
    );
  });
}
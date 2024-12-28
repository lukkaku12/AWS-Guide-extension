function inyectarElementosDePrueba() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Obtener el ID de la pestaña activa
      const tabId = tabs[0].id;
  
      // Usar la nueva API de chrome.scripting.executeScript
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
          // Crear los elementos de prueba en la página activa
          const pageDocument = window.document;
  
          const divGoogleLoginButton = pageDocument.createElement('div');
          divGoogleLoginButton.id = 'google-login-button';
          divGoogleLoginButton.style.width = '150px';
          divGoogleLoginButton.style.height = '40px';
          divGoogleLoginButton.style.backgroundColor = 'blue';
          divGoogleLoginButton.style.position = 'absolute';
          divGoogleLoginButton.style.top = '100px';
          divGoogleLoginButton.style.left = '100px';
          divGoogleLoginButton.innerText = 'Iniciar sesión con Google';
          pageDocument.body.appendChild(divGoogleLoginButton);
  
          const divEmailInput = pageDocument.createElement('div');
          divEmailInput.id = 'email-input';
          divEmailInput.style.width = '200px';
          divEmailInput.style.height = '30px';
          divEmailInput.style.backgroundColor = 'green';
          divEmailInput.style.position = 'absolute';
          divEmailInput.style.top = '200px';
          divEmailInput.style.left = '100px';
          divEmailInput.innerText = 'Email';
          pageDocument.body.appendChild(divEmailInput);
  
          const divPasswordInput = pageDocument.createElement('div');
          divPasswordInput.id = 'password-input';
          divPasswordInput.style.width = '200px';
          divPasswordInput.style.height = '30px';
          divPasswordInput.style.backgroundColor = 'red';
          divPasswordInput.style.position = 'absolute';
          divPasswordInput.style.top = '300px';
          divPasswordInput.style.left = '100px';
          divPasswordInput.innerText = 'Contraseña';
          pageDocument.body.appendChild(divPasswordInput);
  
          const divSubmitButton = pageDocument.createElement('div');
          divSubmitButton.id = 'submit-button';
          divSubmitButton.style.width = '150px';
          divSubmitButton.style.height = '40px';
          divSubmitButton.style.backgroundColor = 'purple';
          divSubmitButton.style.position = 'absolute';
          divSubmitButton.style.top = '400px';
          divSubmitButton.style.left = '100px';
          divSubmitButton.innerText = 'Iniciar sesión';
          pageDocument.body.appendChild(divSubmitButton);
        }
      });
    });
  }
import { driver as Driver} from 'driver.js'; 
import 'driver.css'; 

if (!window.location.href.startsWith('chrome-extension://')) {
  alert('Content script cargado en la página');

  document.body.style.backgroundColor = "orange";

  const elementsHTML = `
    <div id="google-login-button" style="
      width: 200px; height: 40px; background-color: blue; 
      position: absolute; top: 100px; left: 100px; 
      color: #fff; display: flex; align-items: center; 
      justify-content: center; font-size: 14px;">
      Iniciar sesión con Google
    </div>
    <div id="email-input" style="
      width: 200px; height: 40px; background-color: green; 
      position: absolute; top: 160px; left: 100px; 
      color: #fff; display: flex; align-items: center; 
      justify-content: center; font-size: 14px;">
      Email
    </div>
    <div id="password-input" style="
      width: 200px; height: 40px; background-color: red; 
      position: absolute; top: 220px; left: 100px; 
      color: #fff; display: flex; align-items: center; 
      justify-content: center; font-size: 14px;">
      Contraseña
    </div>
    <div id="submit-button" style="
      width: 200px; height: 40px; background-color: purple; 
      position: absolute; top: 280px; left: 100px; 
      color: #fff; display: flex; align-items: center; 
      justify-content: center; font-size: 14px;">
      Iniciar sesión
    </div>
    <div style="
      width: 230px; position: fixed; height: max-content; 
      background: #000; bottom: 0; right: 0; z-index: 9000000000000; 
      color: #fff; padding: 10px; display: flex; 
      align-items: center; justify-content: center; font-size: 14px;">
      Elementos inyectados exitosamente
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', elementsHTML);

  // Inicia Driver.js después de insertar los elementos
  loadDriver();
} else {
  console.log('El content script no se ejecuta en páginas de la extensión.');
}

// Función para cargar Driver.js
function loadDriver() {
  console.log('Iniciando Driver.js');
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

  driver.drive();
}
// Utilidad para detectar si el dispositivo es móvil
export function detectMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Comprobar si es un dispositivo móvil basado en el User Agent
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return true;
  }
  
  // Comprobar basado en el tamaño de la ventana (opcional, como respaldo)
  if (window.innerWidth <= 800 && window.innerHeight <= 600) {
    return true;
  }
  
  
  return false;
}
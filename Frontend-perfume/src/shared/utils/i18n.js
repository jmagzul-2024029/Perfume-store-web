const exactMessageMap = {
  'No encontrado': 'No encontrado',
  'Validation errors': 'Hay errores de validación en los datos ingresados.',
  'Creado exitosamente': 'Creado exitosamente.',
  'Actualizado exitosamente': 'Actualizado exitosamente.',
  'Datos obtenidos exitosamente': 'Datos obtenidos exitosamente.',
};

export const translateApiMessage = (message = '') => {
  if (!message) return 'Ocurrió un error inesperado.';
  if (exactMessageMap[message]) return exactMessageMap[message];

  const lower = message.toLowerCase();
  if (lower.includes('must be a valid email')) return 'Debes ingresar un correo electrónico válido.';
  if (lower.includes('email') && lower.includes('not found')) return 'Correo electrónico no reconocido.';
  if (lower.includes('invalid credentials')) return 'Credenciales inválidas.';
  if (lower.includes('token')) return 'Tu sesión no es válida o expiró. Inicia sesión nuevamente.';
  if (lower.includes('not found')) return 'No encontrado.';
  if (lower.includes('already exists')) return 'El registro ya existe.';
  if (lower.includes('already')) return 'Esta operación ya fue realizada anteriormente.';
  if (lower.includes('required')) return 'Faltan campos obligatorios.';
  if (lower.includes('server')) return 'Ocurrió un error interno del servidor.';

  return message;
};

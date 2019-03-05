export function parseErrorResponse(error) {
  if (typeof error.error === 'object') {
    return Object.keys(error.error)[0];
  }

  return error.error;
}

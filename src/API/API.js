
export async function canAddRow(schemaForBackend) {
  const { token } = schemaForBackend;
  if (!token) {
    return;
  }
  return new Promise(resolve => setTimeout(function () {
    resolve(true);
  }, 3000));
}
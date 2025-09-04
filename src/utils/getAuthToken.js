export const getAuthToken = () => {
  const authData = sessionStorage.getItem('pb_auth') ||
    localStorage.getItem('pb_auth');

  if (!authData) return ''

  try {
    const parsedData = JSON.parse(authData)
    return parsedData?.token || ''
  } catch {
    return ''
  }
}
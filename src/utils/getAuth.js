export const getAuthToken = () => {
  try {
    const authData = sessionStorage.getItem('pb_auth') ||
      localStorage.getItem('pb_auth');

    const parsedData = JSON.parse(authData)

    if (!authData) return ''

    return parsedData?.token || ''
  } catch {
    return ''
  }
}
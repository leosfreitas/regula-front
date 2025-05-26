export const config = { 
  apiBaseUrl: window.location.origin === 'http://localhost:5173'
    ? "http://localhost:8000"
    : "https://regula-back-805c0d9fbbe1.herokuapp.com/"
}

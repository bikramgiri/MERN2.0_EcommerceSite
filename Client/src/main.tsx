import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'
// import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Provider store={store}>
     {/* <Router> */}
       <ThemeProvider>
         <App />
         <Toaster
            position="top-right"
            toastOptions={{
              duration: 2000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 2000,
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />
       </ThemeProvider>
    {/* </Router> */}
  </Provider>
  </StrictMode>,
)

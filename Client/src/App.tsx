import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'

function App() {
  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
    </Routes>
    </BrowserRouter>
    </Provider>
    </>
  )
}

export default App

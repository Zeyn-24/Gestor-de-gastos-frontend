import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import AddExpense from './pages/AddExpense'
import EditExpense from './pages/EditExpense'

function App() {

  return (
    <>
      <Router>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          className="text-xl z-60"
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add-expense' element={<AddExpense />} />
          <Route path='/edit-expense/:id' element={<EditExpense />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
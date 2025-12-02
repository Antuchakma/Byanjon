import HomePage from "./pages/HomePage"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
    <Routes>
    <Route path="/" element={<HomePage/>}/>
    </Routes>
    </Router>
    </>
  )
}

export default App

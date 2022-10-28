
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Manual from "./components/ManualForm.js/Manual.js";
import NavBar from "./components/NavBar.js/NavBar.js";
import Transaction from './components/Transaction.js'

function App() {
  return (

    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Transaction />} />
        <Route path="/manualTr" element={<Manual />} />
      </Routes>
    </BrowserRouter>

  );

}

export { App };
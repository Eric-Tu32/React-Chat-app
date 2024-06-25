import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage"
import RoomPage from "./pages/RoomPage/RoomPage";

function App() {
  return (
    <>
      <div className="container">
          <Routes>
              <Route path='/' element={<HomePage />}></Route>
              <Route path="/room/:roomId" element={<RoomPage/>}></Route>
          </Routes>
      </div>
    </>
  )
}

export default App

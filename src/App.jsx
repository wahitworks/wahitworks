import Header from "./components/header/Header.jsx";
import { Outlet } from "react-router-dom";
import Topbtn from "./components/topBtn/topBtn.jsx";

function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <Topbtn />
      </main>
    </>
  );
}

export default App;

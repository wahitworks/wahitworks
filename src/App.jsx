import Header from "./components/header/Header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/footer/Footer.jsx";

function App() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

    </>
  );
}

export default App;

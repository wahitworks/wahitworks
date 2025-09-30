import Header from "./components/header/Header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/footer/Footer.jsx";

function App() {
  return (
    <>
      <header>
        <Header></Header>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
}

export default App;

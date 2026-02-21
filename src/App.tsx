import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";
import { ArtworkTable } from "./components/ArtworkTable";
import "primereact/resources/themes/lara-light-indigo/theme.css";


function App() {
  return (
    <div className="App">
      <header className="appheader">
        <h1 className="head_title">
          Art Institute of Chicago
        </h1>
        <p className="header2">
          Browse and manage artworks with pagination
        </p>
      </header>
      <main>
        <ArtworkTable />
      </main>
      <footer className="appheader">
        <p>Developed by Mustakeem</p>
        <p>Internship Assignment – React DataTable Implementation
        </p>
      </footer>
    </div>
  );
}

export default App;

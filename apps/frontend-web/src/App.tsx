import "./App.css";
import { Link } from "react-router-dom";
import { links } from "./SiteMap";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Itinerary Planner</h1>
        <Link className="App-link" to={links.summary}>
          Start Planning Your Next Travel
        </Link>
      </header>
    </div>
  );
}

export default App;

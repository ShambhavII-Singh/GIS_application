import './App.css';
import { Navbar, Hero, MapContainer, About } from './containers';
import BusStopsDelhi from './components/BusStopsDelhi';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <MapContainer />
      <About />
    </div>
  );
}

export default App;

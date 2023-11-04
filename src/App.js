import './App.css';
import { Navbar, Hero } from './containers';
import BusStopsDelhi from './containers/BusStopsDelhi';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <BusStopsDelhi />
    </div>
  );
}

export default App;

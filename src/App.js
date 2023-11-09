import './App.css';
import { Navbar, Hero, About } from './containers';
import BusStopsDelhi from './containers/BusStopsDelhi';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <BusStopsDelhi />
      {/* <About /> */}
    </div>
  );
}

export default App;

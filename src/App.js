import './App.css';
import { Navbar } from './containers';
import BusStopsDelhi from './containers/BusStopsDelhi';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BusStopsDelhi />
    </div>
  );
}

export default App;

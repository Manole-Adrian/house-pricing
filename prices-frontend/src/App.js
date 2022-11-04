import React from 'react'
import Pret from "./components/Pret/Pret"
import Intrebari from "./components/Intrebari/Intrebari"
import "./App.css";

function App() {

  const [price,setPrice] = React.useState(null)
  return (
    <main>
      <div className="background">
        <Pret price={price} />
        <Intrebari setPrice={setPrice} />
      </div>
    </main>
  );
}

export default App;

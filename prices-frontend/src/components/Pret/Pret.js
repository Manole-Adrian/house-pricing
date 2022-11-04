import React from "react";
import "./Pret.css";

import Reel from 'react-reel'

export default function Pret(props) {
  let columns = Math.floor(document.body.clientWidth / 50);
  let rows = Math.floor(document.body.clientHeight / 50);

  return (
    <section className="pretContainer">
      {props.price === null && (
        <h1 className="afla"> Afla pretul casei tale de vis!</h1>
      )}
      {props.price !== null && (
        
             <Reel text={props.price.toString()} />
             
      )}
    </section>
  );
}

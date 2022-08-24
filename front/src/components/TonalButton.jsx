import React from "react";
import "./TonalButton.css";

export default function TonalButton(props) {
  return (
    <div className={props.className} type="button">
      <p className="label-text">{props.text}</p>
    </div>
  );
}

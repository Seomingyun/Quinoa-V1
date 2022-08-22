import React from "react";
import TonalButton from "./TonalButton";
import "./TonalButton.css";

export default function TonalButtons() {
  return (
    <div>
      <TonalButton className="enabled" text="enabled"></TonalButton>
      <TonalButton className="hovered" text="hovered"></TonalButton>
      <TonalButton className="pressed" text="hovered"></TonalButton>
    </div>
  );
}

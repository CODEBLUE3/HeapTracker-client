import React, { useState } from "react";
import styled from "styled-components";

const Toggle = styled.span.attrs((props) => ({
  background: props.checked ? "#E8E8E8" : "#6EF088",
}))`
  display: flex;
  width: 40px;
  height: 20px;

  border-radius: 10px;
  background: ${(props) => props.background};
  transition: background-color 1s ease;
`;

const Node = styled.span.attrs((props) => ({
  transform: props.checked ? "translateX(0px)" : "translateX(20px)",
  color: props.checked ? "#1E90FF" : "#1E90FF",
}))`
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;

  border-radius: 100%;
  background: ${(props) => props.color};
  transform: ${(props) => props.transform};
  transition: transform 0.5s ease;
`;

export default function ToggleButton({ click }) {
  const [toggle, setToggle] = useState(true);

  const handleToggle = () => {
    setToggle(!toggle);
    click(!toggle);
  };

  return (
    <Toggle defaultChecked="false" checked={toggle} onClick={handleToggle}>
      <Node checked={toggle} />
    </Toggle>
  );
}

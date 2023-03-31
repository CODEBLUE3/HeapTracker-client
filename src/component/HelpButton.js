import React, { useState, useRef } from "react";
import styled from "styled-components";
import { style } from "../styles/styleCode";

const POSITION_UNIT = "px";
const MODAL_TOP_POSTION_OFFSET = 30;

const QuestionButton = styled.button`
  font-size: 0.7rem;

  padding: 0px;
  margin: 0px 10px;

  border: 2px solid ${(props) => props.theme.defaultFont};
  border-radius: ${style.HelpButtonRadius};
  background-color: ${(props) => props.theme.background};
`;

const HelpModal = styled.div`
  position: absolute;
  display: none;

  padding: 4px;

  font-size: 1rem;
  border: 2px solid ${(props) => props.theme.defaultFont};

  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.defaultFont};
`;

export default function HelpButton({ modalId, info }) {
  const [isShown, setIsShown] = useState(false);
  const modalRef = useRef();

  const handleMouseEnter = (e) => {
    if (modalRef.current.id === modalId) {
      modalRef.current.style.top =
        e.target.offsetTop - MODAL_TOP_POSTION_OFFSET + POSITION_UNIT;
      setIsShown(true);
    }
  };
  const handleMouseLeave = (e) => {
    if (modalRef.current.id === modalId) {
      setIsShown(false);
    }
  };

  return (
    <>
      <QuestionButton
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        ❔
      </QuestionButton>

      <HelpModal
        ref={modalRef}
        id={modalId}
        style={{ display: isShown ? "block" : "none" }}
      >
        {info}
      </HelpModal>
    </>
  );
}

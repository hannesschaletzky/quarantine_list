import styled, { keyframes } from "styled-components";

export const Button = styled.button`
  appearance: button;
  background-color: #439500;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: din-round, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.8px;
  line-height: 20px;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 13px 16px;
  text-align: center;
  text-transform: uppercase;
  touch-action: manipulation;
  transform: translateZ(0);
  transition: filter 0.2s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;
`;

export const Input = styled.input`
  text-align: center;
  border-radius: 8px;
  border: none;
  padding: 8px;
  font-family: din-round, sans-serif;
`;

interface Props {
  left: number;
  y: number;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const move = keyframes`
  0% {
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
  }
  66% {
    top: 0;
    left: 800px;
    width: 100px;
    height: 100px;
  }
  67% {
    top: 0;
    left: 800px;
    width: 200px;
    height: 200px;
  }
  100% {
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
  }
`;

export const Virus = styled.div<Props>`
  position: absolute;
  font-size: 45px;
  top: 5%;
  left: ${({ left }) => left}%;
  animation: ${rotate} 2s linear infinite, ${move} 5s linear infinite;
  z-index: -1;
`;

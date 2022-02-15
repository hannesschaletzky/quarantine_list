import styled from "styled-components";

export const Button = styled.button`
  /* background-color: lightgray;
  border-radius: 8px;
  color: black;
  box-shadow: 2px 2px black; */

  appearance: button;
  background-color: #1899d6;
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
  outline: 1px solid lightgray;
  border-radius: 8px;
  padding: 8px;
  font-family: din-round, sans-serif;
`;

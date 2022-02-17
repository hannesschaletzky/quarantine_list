import styled, { Keyframes, keyframes } from "styled-components";

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

//
//  VIRUS
//
enum Side {
  left,
  top,
  right,
  bottom,
}

const getRndSide = () => {
  switch (getRndPct(0, 3)) {
    case "0%":
      return Side.left;
    case "1%":
      return Side.top;
    case "2%":
      return Side.right;
    case "3%":
      return Side.bottom;
    default:
      return Side.right;
  }
};

const getRndPct = (min: number = 0, max: number = 95): string => {
  return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
};

// create side bouncing point
const get = (
  side: Side,
  per: string,
  val: string = getRndPct(0, 95)
): string => {
  switch (side) {
    case Side.left:
      return `${per}% {
        top: ${val};
        left: 0;
      }`;
    case Side.top:
      return `${per}% {
        top: 0;
        left: ${val};
      }`;
    case Side.right:
      return `${per}% {
        top: ${val};
        left: 95%;
      }`;
    case Side.bottom:
      return `${per}% {
        top: 93%;
        left: ${val};
      }`;
  }
};

export const moveInCircles = (
  side: Side = getRndSide(),
  start: string = getRndPct()
) => {
  console.log(start);
  switch (side) {
    case Side.left:
      return keyframes`
        ${get(Side.left, "0", start)}
        ${get(Side.top, "25")}
        ${get(Side.right, "50")}
        ${get(Side.bottom, "75")}
        ${get(Side.left, "100", start)}
      `;
    case Side.top:
      return keyframes`
        ${get(Side.top, "0", start)}
        ${get(Side.right, "25")}
        ${get(Side.bottom, "50")}
        ${get(Side.left, "75")}
        ${get(Side.top, "100", start)}
      `;
    case Side.right:
      return keyframes`
        ${get(Side.right, "0", start)}
        ${get(Side.bottom, "25")}
        ${get(Side.left, "50")}
        ${get(Side.top, "75")}
        ${get(Side.right, "100", start)}
      `;
    case Side.bottom:
      return keyframes`
        ${get(Side.bottom, "0", start)}
        ${get(Side.left, "25")}
        ${get(Side.top, "50")}
        ${get(Side.right, "75")}
        ${get(Side.bottom, "100", start)}
      `;
  }
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface Virus {
  moveKF: Keyframes; // moving: keyframe
  moveS: number; // moving: seconds
  rotS: number; // rotation: seconds
}

export const Virus = styled.div<Virus>`
  position: absolute;
  font-size: 45px;
  z-index: -1;
  animation: ${rotate} ${({ rotS }) => rotS}s linear infinite,
    ${({ moveKF }) => moveKF} ${({ moveS }) => moveS}s linear infinite;
`;

import styled, { Keyframes, keyframes } from "styled-components";

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

// move in circle (clockwise or not) with a given starting side and starting distance from corner
export const moveInCircles = (
  clockWise: boolean = true,
  side: Side = getRndSide(),
  start: string = getRndPct()
) => {
  // determine start
  switch (side) {
    case Side.left:
      return keyframes`
        ${get(Side.left, "0", start)}
        ${get(clockWise ? Side.top : Side.bottom, "25")}
        ${get(Side.right, "50")}
        ${get(clockWise ? Side.bottom : Side.top, "75")}
        ${get(Side.left, "100", start)}
      `;
    case Side.top:
      return keyframes`
        ${get(Side.top, "0", start)}
        ${get(clockWise ? Side.right : Side.left, "25")}
        ${get(Side.bottom, "50")}
        ${get(clockWise ? Side.left : Side.right, "75")}
        ${get(Side.top, "100", start)}
      `;
    case Side.right:
      return keyframes`
        ${get(Side.right, "0", start)}
        ${get(clockWise ? Side.bottom : Side.top, "25")}
        ${get(Side.left, "50")}
        ${get(clockWise ? Side.top : Side.bottom, "75")}
        ${get(Side.right, "100", start)}
      `;
    case Side.bottom:
      return keyframes`
        ${get(Side.bottom, "0", start)}
        ${get(clockWise ? Side.left : Side.right, "25")}
        ${get(Side.top, "50")}
        ${get(clockWise ? Side.right : Side.left, "75")}
        ${get(Side.bottom, "100", start)}
      `;
  }
};

export const rotateClockWise = (clockWise: boolean = false): Keyframes => {
  if (clockWise) {
    return keyframes`
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    `;
  }
  return keyframes`
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  `;
};

interface Virus {
  moveKF: Keyframes; // moving: keyframe
  moveS: number; // moving: seconds
  rotKF: Keyframes; // rotation: keyfram
  rotS: number; // rotation: seconds
}

export const Virus = styled.div<Virus>`
  position: absolute;
  font-size: 45px;
  z-index: 1;
  animation: ${({ rotKF }) => rotKF} ${({ rotS }) => rotS}s linear infinite,
    ${({ moveKF }) => moveKF} ${({ moveS }) => moveS}s linear infinite;
`;

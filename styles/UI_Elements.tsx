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

const getRndPct = (min: number, max: number): string => {
  return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
};

export enum Side {
  left,
  top,
  right,
  bottom,
}

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

const rndFrame = (side: Side) => {
  const start = getRndPct(0, 95);
  // circle has to start/end at same spot
  switch (side) {
    case Side.left:
      return `
        ${get(Side.left, "0", start)}
        ${get(Side.top, "25")}
        ${get(Side.right, "50")}
        ${get(Side.bottom, "75")}
        ${get(Side.left, "100", start)}
      `;
    case Side.top:
      return `
        ${get(Side.top, "0", start)}
        ${get(Side.right, "25")}
        ${get(Side.bottom, "50")}
        ${get(Side.left, "75")}
        ${get(Side.top, "100", start)}
      `;
    case Side.right:
      return `
        ${get(Side.right, "0", start)}
        ${get(Side.bottom, "25")}
        ${get(Side.left, "50")}
        ${get(Side.top, "75")}
        ${get(Side.right, "100", start)}
      `;
    case Side.bottom:
      return `
        ${get(Side.bottom, "0", start)}
        ${get(Side.left, "25")}
        ${get(Side.top, "50")}
        ${get(Side.right, "75")}
        ${get(Side.bottom, "100", start)}
      `;
  }
};

const moveInCircles = (side: Side) => keyframes`${rndFrame(side)}`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Virus = styled.div`
  position: absolute;
  font-size: 45px;
  z-index: -1;
`;

export const VirusLeft = styled(Virus)`
  top: 5%;
  animation: ${rotate} 2s linear infinite,
    ${moveInCircles(Side.left)} 10s linear infinite;
`;

export const VirusTop = styled(Virus)`
  top: 0%;
  animation: ${rotate} 2s linear infinite,
    ${moveInCircles(Side.top)} 10s linear infinite;
`;

export const VirusRight = styled(Virus)`
  top: 5%;
  animation: ${rotate} 2s linear infinite,
    ${moveInCircles(Side.right)} 10s linear infinite;
`;

export const VirusBottom = styled(Virus)`
  top: 93%;
  animation: ${rotate} 2s linear infinite,
    ${moveInCircles(Side.bottom)} 10s linear infinite;
`;

// const moveInCircles = keyframes`

//   /* ${getLeft("0%")} */
//   // left
//   0% {
//     top: ${getRndPct()};
//     left: 0;
//   }
//   // top
//   20% {
//     top: 0%;
//     left: 40%;
//   }
//   // right
//   40% {
//     top: 60%;
//     left: 100%;
//   }
//   // bottom
//   60% {
//     top: 100%;
//     left: 20%;
//   }
//   //must be equal to 0% value
//   100% {
//     top: 20%;
//     left: 0;
//   }
// `;

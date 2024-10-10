import React from "react";
import svgPath1 from "../../assets/1.svg";
import svgPath2 from "../../assets/2.svg";
import svgPath3 from "../../assets/3.svg";
import svgPath4 from "../../assets/4.svg";
import svgPath5 from "../../assets/5.svg";
import svgPath6 from "../../assets/6.svg";
import svgPath7 from "../../assets/7.svg";
import svgPath8 from "../../assets/8.svg";
import svgPath9 from "../../assets/9.svg";
import svgPath10 from "../../assets/10.svg";
import svgPath11 from "../../assets/11.svg";
import svgPath12 from "../../assets/12.svg";

const Loading = () => {
  // Tableau contenant tous les chemins des SVG
  const svgPaths = [
    svgPath1,
    svgPath2,
    svgPath3,
    svgPath4,
    svgPath5,
    svgPath6,
    svgPath7,
    svgPath8,
    svgPath9,
    svgPath10,
    svgPath11,
    svgPath12,
  ];

  const randomSvgPath = svgPaths[Math.floor(Math.random() * svgPaths.length)];

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes rotateSvg {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(15deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-15deg); }
            100% { transform: rotate(0deg); }
          }

          .svg-animation {
            width: 100px;
            height: 100px;
            animation: rotateSvg 2s infinite linear;
          }
        `}
      </style>

      <div style={styles.svgContainer}>
        <img src={randomSvgPath} alt="Loading" className="svg-animation" />
      </div>
      <h1 style={styles.text}>Waiting...</h1>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  text: {
    fontSize: "24px",
    color: "#555",
    marginTop: "20px",
  },
  svgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    height: "100px",
  },
};

export default Loading;

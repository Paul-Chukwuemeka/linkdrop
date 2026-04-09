"use client";

import { useEffect, useState, useCallback } from "react";

const UNIT = 40;

const Background = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    function handleResize() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }, 0);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const cols = Math.floor(dimensions.width / UNIT);
  const rows = Math.floor(dimensions.height / UNIT);

  const handleMouseMove = useCallback(
    (clientX: number, clientY: number) => {
      if (cols <= 0 || rows <= 0) return;

      const col = Math.floor(clientX / UNIT);
      const row = Math.floor(clientY / UNIT);
      if (col >= 0 && row >= 0 && col < cols && row < rows) {
        setHoveredIndex(row * cols + col);
      }
    },
    [cols, rows],
  );

  useEffect(() => {
    function onMove(e: MouseEvent) {
      handleMouseMove(e.clientX, e.clientY);
    }
    function onLeave() {
      setHoveredIndex(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [handleMouseMove]);

  function isNeighbor(i: number, hovered: number | null) {
    if (hovered === null) return false;
    const hovRow = Math.floor(hovered / cols);
    const hovCol = hovered % cols;
    const curRow = Math.floor(i / cols);
    const curCol = i % cols;
    return Math.abs(curRow - hovRow) <= 1 && Math.abs(curCol - hovCol) <= 1;
  }

  return (
    <div
      className="pointer-events-none  absolute gap-1 inset-0 grid bg-white text-white"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => {
        const hovered = i === hoveredIndex;
        const neighbor = isNeighbor(i, hoveredIndex) && !hovered;

        return (
          <button
            key={i}
            className="flex border duration-300 border-black items-center justify-center"
            style={{
              transform: hovered
                ? "scale(1.3)"
                : neighbor
                  ? "scale(0.7)"
                  : "scale(1)",
              backgroundColor: hovered ? "black" : neighbor ? "gray" : "white",
              borderRadius: hovered ? "50%" : neighbor ? "30%" : "0"
            }}
          >

          </button>
        );
      })}
      <div className="w-full backdrop-blur-[7px] h-full absolute"></div>
    </div>
  );
};
export default Background;

// import { useEffect, useRef, useCallback } from "react";
// const UNIT = 40;
// const boxWidth = 35;
// const Background = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mousePosition = useRef<{ x: number; y: number } | null>(null);
//   const animFrameRef = useRef<number>(0);

//   const draw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const { width, height } = canvas;
//     const rows = Math.floor(width / UNIT);
//     const cols = Math.floor(height / UNIT);

//     ctx.clearRect(0, 0, width, height);

//     const mouse = mousePosition.current;
//     let radius = 40;
//     let color = "#ffffff";
//     for (let row = 0; row < rows; row++) {
//       for (let col = 0; col < cols; col++) {
//         const cx = col * UNIT + UNIT / 2;
//         const cy = row * UNIT + UNIT / 2;

//         if (mouse) {
//           const hovCol = Math.floor(mouse.x / UNIT);
//           const hovRow = Math.floor(mouse.y / UNIT);
//           const dc = Math.abs(col - hovCol);
//           const dr = Math.abs(row - hovRow);

//           const dist = Math.max(dc, dr);

//           if (dist === 0) {
//             radius = boxWidth * 1.2;
//             color = "#000000";
//           } else if (dist === 1) {
//             radius = boxWidth * 0.8;
//             color = "#6b7280";
//           }
//         }
//         ctx.beginPath();
//         const size = boxWidth * 2;
//         ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
//         ctx.fillStyle = color;
//       }
//     }

//     animFrameRef.current = requestAnimationFrame(draw);
//   }, []);

//   useEffect(() => {
//     animFrameRef.current = requestAnimationFrame(draw);
//     return () => cancelAnimationFrame(animFrameRef.current);
//   }, [draw]);
//     useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     function handleResize() {
//       if (!canvas) return;
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     }

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//     useEffect(() => {
//     function onMove(e: MouseEvent) {
//       mousePosition.current = { x: e.clientX, y: e.clientY };
//     }
//     function onLeave() {
//       mousePosition.current = null;
//     }

//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseleave", onLeave);
//     return () => {
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseleave", onLeave);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 pointer-events-none w-full border h-full"
//     ></canvas>
//   );
// };

// export default Background;

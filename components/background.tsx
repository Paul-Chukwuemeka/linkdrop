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
      className="pointer-events-none absolute gap-[2px] inset-0 grid"
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
            className="flex border duration-300 items-center justify-center"
            style={{
              transform: hovered
                ? "scale(1.3)"
                : neighbor
                  ? "scale(0.7)"
                  : "scale(1)",
              backgroundColor: hovered
                ? "#243010"
                : neighbor
                  ? "#d6dcc8"
                  : "#eae5d8",
              borderRadius: hovered ? "50%" : neighbor ? "30%" : "4px",
              borderColor: "#d8d3c6",
            }}
          />
        );
      })}
      <div className="w-full backdrop-blur-[8px] h-full absolute bg-[var(--cream)]/60" />
    </div>
  );
};
export default Background;

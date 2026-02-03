"use client";

import { useMemo } from "react";
import { Html } from "@react-three/drei";
import { CATEGORIES } from "@/lib/categories";

interface CategoryAnchorsProps {
  positions: Record<string, [number, number, number]>;
}

export function CategoryAnchors({ positions }: CategoryAnchorsProps) {
  const anchors = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const pos = positions[cat.id] ?? [0, 0, 0];
      return { ...cat, position: pos };
    });
  }, [positions]);

  return (
    <>
      {anchors.map(({ id, label, color, position }) => (
        <group key={id} position={position}>
          <Html
            center
            style={{
              pointerEvents: "none",
              color,
              fontSize: "1.25rem",
              fontWeight: 700,
              opacity: 0.85,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              textShadow: `0 0 20px ${color}`,
            }}
          >
            {label}
          </Html>
        </group>
      ))}
    </>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { NebulaPoint } from "@/lib/db/local-data";
import { getCategoryColor } from "@/lib/categories";

interface TimelineExtractionProps {
  points: NebulaPoint[];
  onClose: () => void;
  onSelectPoint: (point: NebulaPoint) => void;
}

export function TimelineExtraction({
  points,
  onClose,
  onSelectPoint,
}: TimelineExtractionProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { positions, colors, sorted } = useMemo(() => {
    const n = points.length;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const spacing = 0.35;
    const startX = -((n - 1) * spacing) / 2;

    const sorted = [...points].sort((a, b) => a.timestamp - b.timestamp);

    sorted.forEach((s, i) => {
      positions[i * 3] = startX + i * spacing;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0.5;

      const c = new THREE.Color(getCategoryColor(s.category));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });

    return { positions, colors, sorted };
  }, [points]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0,
        delta * 2
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 2]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={points.length}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {sorted.map((s, i) => {
        const n = points.length;
        const spacing = 0.35;
        const startX = -((n - 1) * spacing) / 2;
        const x = startX + i * spacing;
        return (
          <group key={s.id} position={[x, 0, 0.6]}>
            <Html
              center
              style={{
                pointerEvents: "auto",
                cursor: s.type === "crystal" ? "pointer" : "default",
                background: "rgba(5,5,5,0.9)",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                whiteSpace: "nowrap",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#e5e5e5",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPoint(s);
              }}
            >
              {s.title ?? s.content.slice(0, 12)}
            </Html>
          </group>
        );
      })}
    </group>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { NebulaPoint } from "@/lib/db/local-data";
import { getCategoryColor } from "@/lib/categories";
import { CategoryAnchors } from "./CategoryAnchors";
import { StardustPoints } from "./StardustPoints";
import { TimelineExtraction } from "./TimelineExtraction";

// 7 大分类在 3D 空间中的锚点位置
const CATEGORY_POSITIONS: Record<string, [number, number, number]> = {
  GROWTH: [-4, 2.5, -2],   // 左上 - 绿色
  FAMILY: [4, 2, -2],      // 右上 - 紫色
  CAREER: [3, 0, -1.5],    // 右中 - 蓝色
  LEISURE: [-3.5, 0.5, -1],// 左中 - 黄色
  SOCIAL: [4, -1.5, -1.5], // 右下 - 粉色
  HEALTH: [-2, -2.5, -1],  // 左下 - 红色
  WEALTH: [1.5, -2, -1],   // 中下 - 金色
};

interface NebulaSceneProps {
  points: NebulaPoint[];
  projectPoints: NebulaPoint[];
  activeProjectId: string | null;
  searchQuery: string;
  onSelectPoint: (point: NebulaPoint) => void;
}

export function NebulaScene({
  points,
  projectPoints,
  activeProjectId,
  onSelectPoint,
}: NebulaSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const inTimelineMode = activeProjectId != null && projectPoints.length > 0;

  useFrame((_, delta) => {
    if (groupRef.current && !inTimelineMode) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      {/* 环境光照 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color="#1a5f6b" />

      {/* 星云主体 */}
      <group ref={groupRef}>
        <CategoryAnchors positions={CATEGORY_POSITIONS} />
        {!inTimelineMode ? (
          <StardustPoints
            points={points}
            categoryPositions={CATEGORY_POSITIONS}
            hoverable
          />
        ) : null}
      </group>

      {/* 时间线抽取模式 */}
      {inTimelineMode && (
        <TimelineExtraction
          points={projectPoints}
          onClose={() => {}}
          onSelectPoint={onSelectPoint}
        />
      )}
    </>
  );
}

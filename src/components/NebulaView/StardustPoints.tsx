"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { NebulaPoint } from "@/lib/db/local-data";
import { getCategoryColor } from "@/lib/db/local-data";

interface StardustPointsProps {
  points: NebulaPoint[];
  hoverable?: boolean;
}

// 自定义着色器 - 模拟有机发光粒子效果
const vertexShader = `
  attribute float size;
  attribute float importance;
  attribute float randomOffset;
  
  varying vec3 vColor;
  varying float vImportance;
  varying float vRandomOffset;
  
  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vColor = color;
    vImportance = importance;
    vRandomOffset = randomOffset;
    
    vec3 pos = position;
    
    // 添加微妙的呼吸效果 - 基于时间和随机偏移
    float breathe = sin(uTime * 2.0 + randomOffset * 10.0) * 0.02;
    pos += normal * breathe;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // 大小随距离衰减，并随时间脉冲
    float pulse = sin(uTime * 3.0 + randomOffset * 10.0) * 0.2 + 0.8;
    
    // 重要性影响大小
    float baseSize = size * (0.5 + importance * 0.5);
    gl_PointSize = baseSize * uPixelRatio * (300.0 / -mvPosition.z) * pulse;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vImportance;
  varying float vRandomOffset;
  
  uniform float uTime;

  void main() {
    // 计算到点中心的距离
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // 创建柔和的光晕效果 - 径向渐变
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // 核心更亮，边缘柔和
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    
    // 根据重要性调整亮度
    float brightness = 0.3 + vImportance * 0.7;
    
    // 添加微妙的闪烁效果
    float twinkle = sin(uTime * 5.0 + vRandomOffset * 20.0) * 0.1 + 0.9;
    
    vec3 finalColor = vColor * brightness * twinkle;
    float alpha = glow * 0.7;
    
    // 核心更亮 - 增加发光感
    finalColor += vec3(core * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function StardustPoints({
  points,
  hoverable = false,
}: StardustPointsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  // 淡入动画
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { positions, colors, sizes, randomOffsets, importances } = useMemo(() => {
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);
    const sizes = new Float32Array(points.length);
    const randomOffsets = new Float32Array(points.length);
    const importances = new Float32Array(points.length);

    points.forEach((s, i) => {
      // 使用预计算的位置（如果有）
      if (s.position) {
        positions[i * 3] = s.position[0];
        positions[i * 3 + 1] = s.position[1];
        positions[i * 3 + 2] = s.position[2];
      } else {
        // 如果没有预计算位置，使用球面分布
        const phi = Math.acos(-1 + (2 * i) / points.length);
        const theta = Math.sqrt(points.length * Math.PI) * phi;
        const radius = 8 + Math.random() * 4 + (1 - s.importance) * 2;

        positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
        positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = radius * Math.cos(phi);
      }

      const hex = getCategoryColor(s.category);
      const c = new THREE.Color(hex);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // 96%是小粒子(1.5-2.5)，4%是较大的"恒星"(4-6)
      const isStar = Math.random() < 0.04;
      sizes[i] = isStar 
        ? 4.0 + Math.random() * 2.0  // 大恒星
        : 1.5 + Math.random() * 1.0; // 小粒子

      // 随机偏移用于脉冲相位
      randomOffsets[i] = Math.random();
      importances[i] = s.importance;
    });

    return { positions, colors, sizes, randomOffsets, importances };
  }, [points]);

  // 更新着色器时间
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const hoveredPoint = useMemo(
    () => (hoveredId ? points.find((s) => s.id === hoveredId) : null),
    [hoveredId, points]
  );

  // 计算淡入透明度
  const fadeInOpacity = fadeIn ? 1 : 0;

  if (points.length === 0) return null;

  return (
    <>
      <points
        ref={pointsRef}
        onPointerOver={(e) => {
          if (hoverable) {
            e.stopPropagation();
            const idx = e.index;
            if (idx !== undefined && points[idx]) {
              setHoveredId(points[idx].id);
            }
          }
        }}
        onPointerOut={() => {
          if (hoverable) {
            setHoveredId(null);
          }
        }}
      >
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
          <bufferAttribute
            attach="attributes-size"
            count={points.length}
            array={sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-randomOffset"
            count={points.length}
            array={randomOffsets}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-importance"
            count={points.length}
            array={importances}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          }}
        />
      </points>

      {/* 高亮选中的点 */}
      {hoverable && hoveredPoint && (
        <mesh position={hoveredPoint.position || [0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial
            color={getCategoryColor(hoveredPoint.category)}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {hoverable && hoveredPoint && (
        <Html
          position={[
            (hoveredPoint.position?.[0] ?? 0) + 0.5,
            (hoveredPoint.position?.[1] ?? 0) + 0.5,
            (hoveredPoint.position?.[2] ?? 0) + 0.5,
          ]}
          style={{
            pointerEvents: "none",
            background: "rgba(10, 10, 15, 0.9)",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            maxWidth: "220px",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            opacity: fadeInOpacity,
            transition: "opacity 0.5s ease-out",
          }}
        >
          <div className="font-medium text-white/95 mb-1">
            {hoveredPoint.title}
          </div>
          <div className="text-white/60 text-[11px] leading-relaxed">
            {hoveredPoint.content}
          </div>
          <div className="text-white/40 text-[10px] mt-2 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getCategoryColor(hoveredPoint.category) }}
            />
            <span>{hoveredPoint.category}</span>
            <span className="ml-auto">
              {(hoveredPoint.importance * 100).toFixed(0)}% 重要度
            </span>
          </div>
        </Html>
      )}
    </>
  );
}

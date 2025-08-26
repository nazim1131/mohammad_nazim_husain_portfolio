import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Box, Torus } from "@react-three/drei";
import * as THREE from "three";

interface FloatingGeometryProps {
  position: [number, number, number];
  type: "sphere" | "box" | "torus";
  size?: number;
  color?: string;
  speed?: number;
}

export const FloatingGeometry = ({ 
  position, 
  type, 
  size = 1, 
  color = "#E5212E", 
  speed = 1 
}: FloatingGeometryProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useMemo(() => position, [position]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      
      // Floating animation
      meshRef.current.position.y = initialPosition[1] + Math.sin(time) * 0.5;
      
      // Rotation animation
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      
      // Subtle breathing effect
      const scale = 1 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const material = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.2}
      transparent
      opacity={0.8}
      roughness={0.3}
      metalness={0.7}
    />
  );

  const renderGeometry = () => {
    switch (type) {
      case "sphere":
        return (
          <Sphere ref={meshRef} position={[initialPosition[0], initialPosition[1], initialPosition[2]]} args={[size]}>
            {material}
          </Sphere>
        );
      case "box":
        return (
          <Box ref={meshRef} position={[initialPosition[0], initialPosition[1], initialPosition[2]]} args={[size, size, size]}>
            {material}
          </Box>
        );
      case "torus":
        return (
          <Torus ref={meshRef} position={[initialPosition[0], initialPosition[1], initialPosition[2]]} args={[size, size * 0.4, 16, 32]}>
            {material}
          </Torus>
        );
      default:
        return null;
    }
  };

  return renderGeometry();
};
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { FloatingGeometry } from "./FloatingGeometry";

// Light Blue Palette
const BLUE      = "#1e90ff"; // primary light blue (DodgerBlue)
const BLUE_DEEP = "#1b64c2"; // deeper blue
const BLUE_BRT  = "#64b3ff"; // bright blue for highlights

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas dpr={[1, 2]} performance={{ min: 0.5 }} className="opacity-60">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />

          {/* Lighting */}
          <ambientLight intensity={0.25} color={BLUE_BRT} />
          <pointLight position={[10, 10, 10]} intensity={1.0} color={BLUE_BRT} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color={BLUE_DEEP} />

          {/* Environment */}
          <Environment preset="night" />

          {/* Floating Geometries */}
          <FloatingGeometry
            position={[-3, 2, -2]}
            type="sphere"
            size={0.8}
            color={BLUE_BRT}
            speed={0.8}
          />
          <FloatingGeometry
            position={[3, -1, -3]}
            type="box"
            size={1.2}
            color={BLUE_DEEP}
            speed={1.2}
          />
          <FloatingGeometry
            position={[0, 3, -4]}
            type="torus"
            size={1}
            color={BLUE_BRT}
            speed={0.6}
          />
          <FloatingGeometry
            position={[-2, -2, -1]}
            type="sphere"
            size={0.6}
            color={BLUE}
            speed={1.4}
          />
          <FloatingGeometry
            position={[4, 1, -5]}
            type="box"
            size={0.8}
            color={BLUE_BRT}
            speed={0.9}
          />

          {/* Controls (disabled for performance) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};



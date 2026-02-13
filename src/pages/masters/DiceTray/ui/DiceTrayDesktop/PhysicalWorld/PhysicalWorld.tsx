import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';

type Vec3 = [number, number, number];

interface PhysicsWorldProps {
  children: React.ReactNode;
  trayCenter?: Vec3;
  traySize?: { width: number; depth: number };
  wallHeight?: number;
  wallThickness?: number;
  floorY?: number;
  debug?: boolean;
  cornerCut?: number;
  overlap?: number;
}

export const PhysicsWorld = ({
  children,
  trayCenter = [0, 0, 0],
  traySize = { width: 14, depth: 10 },
  wallHeight = 3.0,
  wallThickness = 0.8,
  floorY = -0.2,
  debug = true,
  cornerCut = 1.8,
  overlap = 0.06,
}: PhysicsWorldProps) => {
  const [cx, , cz] = trayCenter;

  const halfW = traySize.width / 2;
  const halfD = traySize.depth / 2;

  const innerHalfW = halfW - wallThickness / 2;
  const innerHalfD = halfD - wallThickness / 2;

  const cut = Math.min(cornerCut, innerHalfW - 0.2, innerHalfD - 0.2);

  const wallY = floorY + wallHeight / 2;

  const mainXLen = traySize.width - 2 * cut;
  const mainZLen = traySize.depth - 2 * cut;

  const diagLen = Math.SQRT2 * cut;

  const hxMainX = Math.max(0.001, mainXLen / 2 + overlap);
  const hzMainZ = Math.max(0.001, mainZLen / 2 + overlap);
  const halfT = wallThickness / 2;
  const halfH = wallHeight / 2;

  const hxDiag = Math.max(0.001, diagLen / 2 + overlap);

  const zFrontCenter = cz - (innerHalfD - cut / 2);
  const zBackCenter = cz + (innerHalfD - cut / 2);
  const xLeftCenter = cx - (innerHalfW - cut / 2);
  const xRightCenter = cx + (innerHalfW - cut / 2);

  const xDiag = innerHalfW - cut / 2;
  const zDiag = innerHalfD - cut / 2;

  return (
    <div className="absolute inset-0 z-80 pointer-events-none w-screen h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 14.2, 5], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[8, 15, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Physics gravity={[0, -25, 0]} timeStep={1 / 60}>
          {/* Пол */}
          <RigidBody type="fixed" position={[cx, floorY, cz]} colliders={false}>
            <CuboidCollider args={[halfW, wallThickness / 2, halfD]} />
          </RigidBody>

          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider position={[cx, wallY, zFrontCenter]} args={[hxMainX, halfH, halfT]} />
            <CuboidCollider position={[cx, wallY, zBackCenter]} args={[hxMainX, halfH, halfT]} />

            <CuboidCollider position={[xLeftCenter, wallY, cz]} args={[halfT, halfH, hzMainZ]} />
            <CuboidCollider position={[xRightCenter, wallY, cz]} args={[halfT, halfH, hzMainZ]} />
            {(
              [
                { sx: 1, sz: 1, rotY: Math.PI / 4 },
                { sx: 1, sz: -1, rotY: -Math.PI / 4 },
                { sx: -1, sz: 1, rotY: -Math.PI / 4 },
                { sx: -1, sz: -1, rotY: Math.PI / 4 },
              ] as const
            ).map((c, i) => (
              <CuboidCollider
                key={i}
                position={[cx + c.sx * xDiag, wallY, cz + c.sz * zDiag]}
                rotation={[0, c.rotY, 0]}
                args={[hxDiag, halfH, halfT]}
              />
            ))}
          </RigidBody>

          {debug && <OrbitControls enabled enableZoom={false} />}
          {children}
        </Physics>
      </Canvas>
    </div>
  );
};

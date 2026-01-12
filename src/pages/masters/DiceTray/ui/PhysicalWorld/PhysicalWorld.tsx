import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
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
}

export const PhysicsWorld = ({
  children,
  trayCenter = [0, 0, 0],
  traySize = { width: 10, depth: 8 },
  wallHeight = 2.4,
  wallThickness = 0.3,
  floorY = -0.2,
  debug = true,
  cornerCut = 1.6,
}: PhysicsWorldProps) => {
  const [cx, _cy, cz] = trayCenter;

  const halfW = traySize.width / 2;
  const halfD = traySize.depth / 2;
  const cut = Math.min(cornerCut, halfW - 0.2, halfD - 0.2);

  const wallY = floorY + wallHeight / 2;

  const mainXLen = traySize.width - 2 * cut;
  const mainZLen = traySize.depth - 2 * cut;

  const diagLen = Math.sqrt(2) * cut;

  const mainColor = debug ? '#60a5fa' : '#000000';
  const diagColor = debug ? '#f59e0b' : '#000000';
  const mainOpacity = 0;
  const diagOpacity = 0;

  return (
    <div className="absolute inset-0 z-80 pointer-events-none w-screen h-screen">
      <Canvas
        shadows
        camera={{
          position: [0, 14.2, 5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
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
        <pointLight position={[-5, 6, 4]} intensity={0.8} />
        <pointLight position={[5, 3, -4]} intensity={0.6} />

        <Physics gravity={[0, -25, 0]} timeStep={1 / 60}>
          <RigidBody type="fixed" position={[cx, floorY, cz]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[traySize.width, traySize.depth]} />
              <meshStandardMaterial transparent opacity={0} color={debug ? '#22c55e' : '#000000'} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[cx - halfW, wallY, cz]}>
            <mesh castShadow>
              <boxGeometry args={[wallThickness, wallHeight, mainZLen]} />
              <meshStandardMaterial transparent opacity={mainOpacity} color={mainColor} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[cx + halfW, wallY, cz]}>
            <mesh castShadow>
              <boxGeometry args={[wallThickness, wallHeight, mainZLen]} />
              <meshStandardMaterial transparent opacity={mainOpacity} color={mainColor} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[cx, wallY, cz - halfD]}>
            <mesh castShadow>
              <boxGeometry args={[mainXLen, wallHeight, wallThickness]} />
              <meshStandardMaterial transparent opacity={mainOpacity} color={mainColor} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[cx, wallY, cz + halfD]}>
            <mesh castShadow>
              <boxGeometry args={[mainXLen, wallHeight, wallThickness]} />
              <meshStandardMaterial transparent opacity={mainOpacity} color={mainColor} />
            </mesh>
          </RigidBody>
          {(() => {
            const corners: Array<{ sx: 1 | -1; sz: 1 | -1 }> = [
              { sx: 1, sz: -1 },
              { sx: 1, sz: 1 },
              { sx: -1, sz: -1 },
              { sx: -1, sz: 1 },
            ];

            return corners.map(({ sx, sz }, idx) => {
              const x = cx + sx * (halfW - cut / 2);
              const z = cz + sz * (halfD - cut / 2);
              const angle = Math.atan2(sz, sx);
              const rotY = angle + Math.PI / 2;

              return (
                <RigidBody
                  key={`diag-${idx}`}
                  type="fixed"
                  position={[x, wallY, z]}
                  rotation={[0, rotY, 0]}
                >
                  <mesh castShadow>
                    <boxGeometry args={[diagLen, wallHeight, wallThickness]} />
                    <meshStandardMaterial transparent opacity={diagOpacity} color={diagColor} />
                  </mesh>
                </RigidBody>
              );
            });
          })()}
          <OrbitControls enabled={false} />
          {children}
        </Physics>
      </Canvas>
    </div>
  );
};

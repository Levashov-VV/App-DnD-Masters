// import { Canvas } from '@react-three/fiber';
// import { Physics, RigidBody } from '@react-three/rapier';
// import * as THREE from 'three';
// import { DiceTrayFloor } from './DiceTrayFloor';

// interface PhysicsWorldProps {
//   children: React.ReactNode;
//   diceResults: Record<string, number>;
// }

// export const PhysicsWorld = ({ children, diceResults }: PhysicsWorldProps) => {
//   return (
//     <div className="absolute inset-0 z-60 pointer-events-none">
//       <Canvas
//         camera={{ position: [0, 20, 50], fov: 45 }}
//         gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
//         style={{ background: 'transparent' }}
//       >
//         <Physics gravity={[0, -15, 0]}>
//           {/* Прозрачный пол на уровне DiceTray */}
//           <DiceTraySurface />
          
//           {/* Кубики */}
//           {children}
          
//           {/* Освещение */}
//           <ambientLight intensity={0.6} />
//           <directionalLight position={[10, 20, 10]} intensity={1.2} />
//           <pointLight position={[-10, 10, -10]} intensity={0.5} />
//         </Physics>
//       </Canvas>
      
//       {/* Результаты бросков */}
//       {Object.keys(diceResults).length > 0 && (
//         <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-70">
//           {Object.entries(diceResults).map(([type, value]) => (
//             <div key={type}>{type.toUpperCase()}: {value}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
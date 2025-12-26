// import { RigidBody, RapierRigidBody } from '@react-three/rapier';
// import { useRef, useEffect } from 'react';
// import { Dice } from '../DicesSection/MulipleDicesSection/DiceLoader';
// import * as THREE from 'three';
// import type { DiceType, DiceSetColor } from '../DicesSection/MulipleDicesSection/DiceMeshes';

// interface PhysicalDiceProps {
//   type: DiceType;
//   colorSet: DiceSetColor;
//   isRolling: boolean;
//   onResult: (type: DiceType, value: number) => void;
// }

// const FACE_MAPS: Record<DiceType, number[]> = {
//   d4: [1, 2, 3, 4],
//   d6: [1, 2, 3, 4, 5, 6],
//   d8: [1, 2, 3, 4, 5, 6, 7, 8],
//   d10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
//   d12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   d20: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
//   d100: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
// };

// export function PhysicalDice({ type, colorSet, isRolling, onResult }: PhysicalDiceProps) {
//   const rigidBodyRef = useRef<RapierRigidBody>(null);
//   const meshRef = useRef<THREE.Mesh>(null);
//   const velocityRef = useRef<[number, number, number]>([0, 0, 0]);

//   const getDiceValue = (quaternion: THREE.Quaternion): number => {
//     const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);
//     const faces = FACE_MAPS[type];

//     const dotY = up.y;
//     return faces[Math.floor(((dotY + 1) / 2) * faces.length)] || 1;
//   };

//   useEffect(() => {
//     if (isRolling && rigidBodyRef.current) {
//       const force = [
//         (Math.random() - 0.5) * 20,
//         15 + Math.random() * 10,
//         (Math.random() - 0.5) * 20,
//       ];
//       rigidBodyRef.current.applyImpulse(force, true);
//     }
//   }, [isRolling]);

//   return (
//     <RigidBody
//       ref={rigidBodyRef}
//       type="dynamic"
//       colliders="hull"
//       restitution={0.7}
//     //   friction={0.5}
//       gravityScale={1}
//       position={[0, 10, 0]}
//     >
//       <Dice type={type} colorSet={colorSet} position={[0, 0, 0]} scale={1.2} />
//     </RigidBody>
//   );
// }

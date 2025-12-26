// // GlobalDice.tsx
// import { RigidBody, RapierRigidBody } from '@react-three/rapier';
// import { useEffect, useRef } from 'react';
// import { Dice } from '../DicesSection/MulipleDicesSection/DiceLoader';
// import * as THREE from 'three';
// import type { DiceType, DiceSetColor } from '../DicesSection/MulipleDicesSection/DiceMeshes';

// interface GlobalDiceProps {
//   type: DiceType;
//   colorSet: DiceSetColor;
//   position: [number, number, number];
//   onResult: (type: DiceType, value: number) => void;
// }

// export const GlobalDice = ({ type, colorSet, position, onResult }: GlobalDiceProps) => {
//   const rigidBodyRef = useRef<RapierRigidBody>(null);
//   const hasReported = useRef(false);

//   const getDiceValue = (quaternion: THREE.Quaternion): number => {
//     const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);
//     const faces = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
//     const index = Math.round((1 - up.y) / 2 * (faces.length - 1));
//     return faces[index] || 1;
//   };

//   useEffect(() => {
//     if (rigidBodyRef.current && !hasReported.current) {
//       const force = [
//         (Math.random() - 0.5) * 10,
//         8 + Math.random() * 5,
//         (Math.random() - 0.5) * 10
//       ];
//       rigidBodyRef.current.applyImpulse(force, true);
//     }
//   }, []);

//   useEffect(() => {
//     const rigidBody = rigidBodyRef.current;
//     if (!rigidBody) return;

//     const unsubscribeSleep = rigidBody.onSleep(() => {
//       if (hasReported.current) return;
//       hasReported.current = true;
      
//       const quaternion = rigidBody.rotation();
//       const value = getDiceValue(new THREE.Quaternion(
//         quaternion.x, quaternion.y, quaternion.z, quaternion.w
//       ));
      
//       setTimeout(() => {
//         onResult(type, value);
//         rigidBody.wakeUp();
//       }, 1000);
//     });

//     return () => unsubscribeSleep();
//   }, [type, onResult]);

//   return (
//     <RigidBody
//       ref={rigidBodyRef}
//       type="dynamic"
//       colliders="hull"
//       restitution={0.7}
//       friction={0.5}
//       position={position}
//     >
//       <Dice type={type} colorSet={colorSet} position={[0, 0, 0]} scale={1.5} />
//     </RigidBody>
//   );
// };

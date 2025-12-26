import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { diceSets } from './DiceMeshes';
import type { DiceType, DiceSetColor } from './DiceMeshes';

interface DiceProps {
  position: [number, number, number];
  scale?: number;
  type: DiceType;
  colorSet: DiceSetColor;
}

export const Dice = ({ position, scale = 1.2, type, colorSet }: DiceProps) => {
  const groupRef = useRef<THREE.Group>(null);
const scene = (useGLTF('/models/dice.glb') as any).scene as THREE.Group;

  useEffect(() => {
    const set = diceSets[colorSet];
    const targetName = set[type];
    let diceModel: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]> | null =
      null;

    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.name === targetName) {
        diceModel = child.clone();
      }
    });

    if (diceModel && groupRef.current) {
      diceModel.position.set(...position);
      diceModel.scale.setScalar(scale);

      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(diceModel);
    }
  }, [scene, position, scale, type, colorSet]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.5;
      groupRef.current.rotation.y += delta * 0.7;
      groupRef.current.rotation.z += delta * 0.3;
    }
  });

  return <group ref={groupRef} />;
};

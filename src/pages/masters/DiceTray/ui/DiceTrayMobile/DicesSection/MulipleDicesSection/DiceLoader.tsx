import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { diceSets } from './DiceMeshes';
import type { DiceType, DiceSetColor } from '../../types/rollTypes';
import { assetUrl } from '@/shared/utils/assetUrl';

const DICE_MODEL_URL = assetUrl('/models/dice.glb');

interface DiceProps {
  position: [number, number, number];
  scale?: number;
  type: DiceType;
  colorSet: DiceSetColor;
  autoRotate?: boolean;
  meshRef?: { current: THREE.Mesh | null };
}

export const Dice = ({ scale = 1, type, colorSet, autoRotate = true, meshRef }: DiceProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const diceMeshRef = useRef<THREE.Mesh | null>(null);
  const { scene } = useGLTF(DICE_MODEL_URL);


  useEffect(() => {
    const set = diceSets[colorSet];
    const targetName = set[type];

    const clonedScene = scene.clone(true) as THREE.Group;

    let diceModel: THREE.Mesh | null = null;
    clonedScene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.name === targetName) {
        diceModel = child.clone() as THREE.Mesh;
      }
    });

    if (!diceModel || !groupRef.current) return;

    const mesh = diceModel as THREE.Mesh;

    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.setScalar(scale);

    diceMeshRef.current = mesh;
    if (meshRef) meshRef.current = mesh;

    groupRef.current.add(mesh);
  }, [scene, scale, type, colorSet, meshRef]);


  useFrame((_, delta) => {
    if (!autoRotate || !groupRef.current) return;
    groupRef.current.rotation.x += delta * 0.5;
    groupRef.current.rotation.y += delta * 0.7;
    groupRef.current.rotation.z += delta * 0.3;
  });

  useGLTF.preload(DICE_MODEL_URL);

  return <group ref={groupRef} />;
};

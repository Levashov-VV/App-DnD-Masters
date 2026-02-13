import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { Dice } from '../DicesSection/MulipleDicesSection/DiceLoader';
import type { DiceSetColor, DiceType } from '../types/rollTypes';

import { buildD4SensorPointsLocal } from './dice4/diceSensorsD4';
import { D4_INDEX_TO_VALUE } from './dice4/diceMappings';

import { buildD6SensorPointsLocal } from './dice6/diceSensorsD6';
import { D6_INDEX_TO_VALUE } from './dice6/diceMappings';

import { buildD8SensorPointsLocal } from './dice8/diceSensorsD8';
import { D8_INDEX_TO_VALUE } from './dice8/diceMappings';

import { buildD10SensorPointsLocal } from './dice10/diceSensorsD10';
import { D10_INDEX_TO_VALUE } from './dice10/diceMappings';

import { buildD100SensorPointsLocal } from './dice100/diceSensorsD100';
import { D100_INDEX_TO_VALUE } from './dice100/diceMappings';

import { buildD20SensorPointsLocal } from './dice20/diceSensors';
import { D20_INDEX_TO_VALUE } from './dice20/diceMappings';

import { buildD12SensorPointsLocal } from './dice12/diceSensorsD12';
import { D12_INDEX_TO_VALUE } from './dice12/diceMappings';

type Phase = 'dynamic' | 'present';

interface RollingDiceProps {
  type: DiceType;
  colorSet: DiceSetColor;
  rotation: [number, number, number];
  onResult: (value: number) => void;
}

type DiceConfig = {
  buildPoints: (mesh: THREE.Mesh) => THREE.Vector3[];
  indexToValue: Record<number, number> | number[];
};

function getDiceConfig(type: DiceType): DiceConfig | null {
  switch (type) {
    case 'd20':
      return {
        buildPoints: (mesh) => buildD20SensorPointsLocal(mesh, 20),
        indexToValue: D20_INDEX_TO_VALUE,
      };
    case 'd12':
      return {
        buildPoints: (mesh) => buildD12SensorPointsLocal(mesh),
        indexToValue: D12_INDEX_TO_VALUE,
      };
    case 'd100':
      return {
        buildPoints: (mesh) => buildD100SensorPointsLocal(mesh),
        indexToValue: D100_INDEX_TO_VALUE,
      };
    case 'd10':
      return {
        buildPoints: (mesh) => buildD10SensorPointsLocal(mesh),
        indexToValue: D10_INDEX_TO_VALUE,
      };
    case 'd8':
      return {
        buildPoints: (mesh) => buildD8SensorPointsLocal(mesh),
        indexToValue: D8_INDEX_TO_VALUE,
      };
    case 'd6':
      return {
        buildPoints: (mesh) => buildD6SensorPointsLocal(mesh),
        indexToValue: D6_INDEX_TO_VALUE,
      };
    case 'd4':
      return {
        buildPoints: (mesh) => buildD4SensorPointsLocal(mesh),
        indexToValue: D4_INDEX_TO_VALUE,
      };
    default:
      return null;
  }
}

export const RollingDice = ({ type, colorSet, rotation, onResult }: RollingDiceProps) => {
  const { camera } = useThree();

  // Визуальный масштаб
  const SCALE_BY_TYPE: Record<DiceType, number> = useMemo(
    () => ({
      d20: 1.1,
      d12: 0.9,
      d10: 0.9,
      d100: 0.9,
      d8: 0.9,
      d6: 0.7,
      d4: 0.85,
    }),
    []
  );

  const diceScale = SCALE_BY_TYPE[type] ?? 1;

  // Физика
  const BASE_IMPULSE_XZ = 8;
  const BASE_IMPULSE_Y = 12;
  const BASE_TORQUE = 50;

  const IMPULSE_SCALE_BY_TYPE: Record<DiceType, number> = useMemo(
    () => ({
      d20: 0.5,
      d12: 0.5,
      d10: 0.5,
      d100: 0.5,
      d8: 0.3,
      d6: 0.2,
      d4: 0.05,
    }),
    []
  );

  const TORQUE_SCALE_BY_TYPE: Record<DiceType, number> = useMemo(
    () => ({
      d20: 0.2,
      d12: 0.2,
      d10: 0.2,
      d100: 0.2,
      d8: 0.15,
      d6: 0.1,
      d4: 0.05,
    }),
    []
  );

  const ANGULAR_DAMPING: Record<DiceType, number> = useMemo(
    () => ({
      d20: 1.5,
      d12: 1.5,
      d10: 1.2,
      d100: 1.2,
      d8: 1.2,
      d6: 1.5,
      d4: 1.8,
    }),
    []
  );

  const rbRef = useRef<RapierRigidBody | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const [phase, setPhase] = useState<Phase>('dynamic');
  const [presentSeed] = useState(0);

  const startTime = useRef(0);
  const stableFrames = useRef(0);
  const hasLocked = useRef(false);

  const present = useRef<null | {
    pos: THREE.Vector3;
    fromQuat: THREE.Quaternion;
    toQuat: THREE.Quaternion;
    t: number;
  }>(null);

  const cfg = useMemo(() => getDiceConfig(type), [type]);
  const sensorPointsLocalRef = useRef<THREE.Vector3[]>([]);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const yawAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const tmpDir = useRef(new THREE.Vector3());
  const tmpForward = useRef(new THREE.Vector3());
  const tmpToCam = useRef(new THREE.Vector3());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpYawQuat = useRef(new THREE.Quaternion());
  const tmpToQuat = useRef(new THREE.Quaternion());

  const tmpEuler = useRef(new THREE.Euler());
  const tmpStartQuat = useRef(new THREE.Quaternion());

  useEffect(() => {
    sensorPointsLocalRef.current = [];
    if (!cfg) return;

    let raf = 0;
    const waitMeshAndBuild = () => {
      const mesh = meshRef.current;
      if (!mesh) {
        raf = requestAnimationFrame(waitMeshAndBuild);
        return;
      }
      sensorPointsLocalRef.current = cfg.buildPoints(mesh);
    };

    waitMeshAndBuild();
    return () => cancelAnimationFrame(raf);
  }, [cfg]);

  const getTopSensorIndex = (quat: THREE.Quaternion) => {
    let bestDot = -Infinity;
    let bestIndex = 0;

    const pts = sensorPointsLocalRef.current;
    for (let i = 0; i < pts.length; i++) {
      tmpDir.current.copy(pts[i]).normalize().applyQuaternion(quat);
      const d = tmpDir.current.dot(up);
      if (d > bestDot) {
        bestDot = d;
        bestIndex = i;
      }
    }
    return { bestIndex, bestDot };
  };

  const calcYawToFaceCamera = (quat: THREE.Quaternion, dicePos: THREE.Vector3) => {
    const forward = tmpForward.current;
    const toCam = tmpToCam.current;

    forward.set(0, 0, 1).applyQuaternion(quat);
    forward.y = 0;
    forward.normalize();

    toCam.subVectors(camera.position, dicePos);
    toCam.y = 0;
    toCam.normalize();

    const sin = new THREE.Vector3().crossVectors(forward, toCam).dot(up);
    const cos = forward.dot(toCam);
    return Math.atan2(sin, cos);
  };

  useEffect(() => {
    hasLocked.current = false;
    stableFrames.current = 0;
    present.current = null;
    startTime.current = performance.now();

    const t = setTimeout(() => {
      setPhase('dynamic');

      if (!rbRef.current) return;
      rbRef.current.setTranslation({ x: 0, y: 8, z: 0 }, true);

      tmpEuler.current.set(rotation[0], rotation[1], rotation[2]);
      tmpStartQuat.current.setFromEuler(tmpEuler.current);

      rbRef.current.setRotation(
        {
          x: tmpStartQuat.current.x,
          y: tmpStartQuat.current.y,
          z: tmpStartQuat.current.z,
          w: tmpStartQuat.current.w,
        },
        true
      );

      const sImp = IMPULSE_SCALE_BY_TYPE[type] ?? 1;
      const sTq = TORQUE_SCALE_BY_TYPE[type] ?? 1;

      rbRef.current.applyImpulse(
        {
          x: (Math.random() - 0.5) * BASE_IMPULSE_XZ * sImp,
          y: BASE_IMPULSE_Y * sImp,
          z: (Math.random() - 0.5) * BASE_IMPULSE_XZ * sImp,
        },
        true
      );

      rbRef.current.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * BASE_TORQUE * sTq,
          y: (Math.random() - 0.5) * BASE_TORQUE * sTq,
          z: (Math.random() - 0.5) * BASE_TORQUE * sTq,
        },
        true
      );
    }, 100);

    return () => clearTimeout(t);
  }, [rotation, type, IMPULSE_SCALE_BY_TYPE, TORQUE_SCALE_BY_TYPE]);

  useFrame(() => {
    if (phase !== 'dynamic') return;
    if (!rbRef.current || hasLocked.current) return;
    if (!cfg) return;
    if (sensorPointsLocalRef.current.length === 0) return;

    const elapsed = (performance.now() - startTime.current) / 1000;
    const vel = rbRef.current.linvel();
    const ang = rbRef.current.angvel();
    const linLen = Math.hypot(vel.x, vel.y, vel.z);
    const angLen = Math.hypot(ang.x, ang.y, ang.z);

    const settled = elapsed > 0.8 && linLen < 0.12 && angLen < 0.35;
    stableFrames.current = settled ? stableFrames.current + 1 : 0;
    if (stableFrames.current < 20) return;

    hasLocked.current = true;
    rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, false);
    rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, false);

    const p = rbRef.current.translation();
    const r = rbRef.current.rotation();

    tmpPos.current.set(p.x, p.y, p.z);
    tmpQuat.current.set(r.x, r.y, r.z, r.w).normalize();

    const { bestIndex: topIndex, bestDot } = getTopSensorIndex(tmpQuat.current);

    const value = Array.isArray(cfg.indexToValue)
      ? (cfg.indexToValue[topIndex] ?? 0)
      : (cfg.indexToValue[topIndex] ?? 0);

    onResult(value);

    const yaw = calcYawToFaceCamera(tmpQuat.current, tmpPos.current);
    tmpYawQuat.current.setFromAxisAngle(yawAxis, yaw);
    tmpToQuat.current.copy(tmpYawQuat.current).multiply(tmpQuat.current);
  });

  useFrame((_, delta) => {
    if (phase !== 'present') return;
    if (!rbRef.current || !present.current) return;

    const { pos, fromQuat, toQuat } = present.current;
    rbRef.current.setNextKinematicTranslation({ x: pos.x, y: pos.y, z: pos.z });

    present.current.t = Math.min(1, present.current.t + delta / 0.4);
    tmpQuat.current.copy(fromQuat).slerp(toQuat, present.current.t);
    rbRef.current.setNextKinematicRotation(tmpQuat.current);
  });

  const rigidType = phase === 'dynamic' ? ('dynamic' as const) : ('kinematicPosition' as const);

  return (
    <RigidBody
      ccd
      key={presentSeed}
      ref={rbRef}
      type={rigidType}
      colliders="hull"
      restitution={0.7}
      friction={0.2}
      linearDamping={0.05}
      angularDamping={ANGULAR_DAMPING[type] ?? 0.1}
      canSleep
    >
      <Dice
        type={type}
        colorSet={colorSet}
        position={[0, 0, 0]}
        scale={diceScale}
        autoRotate={false}
        meshRef={meshRef}
      />
    </RigidBody>
  );
};

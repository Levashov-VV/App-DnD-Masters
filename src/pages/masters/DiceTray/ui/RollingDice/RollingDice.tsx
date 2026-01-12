import { RigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { Dice } from '../DicesSection/MulipleDicesSection/DiceLoader'
import type { DiceSetColor, DiceType } from '../types/rollTypes'

import { buildD20SensorPointsLocal } from './dice20/diceSensors'
import { D20_INDEX_TO_VALUE } from './dice20/diceMappings'

import { buildD12SensorPointsLocal } from './dice12/diceSensorsD12'
import { D12_INDEX_TO_VALUE } from './dice12/diceMappings'

type Phase = 'dynamic' | 'present'

interface RollingDiceProps {
  type: DiceType
  colorSet: DiceSetColor
  rotation: [number, number, number]
  onResult: (value: number) => void
}

type DiceConfig = {
  buildPoints: (mesh: THREE.Mesh) => THREE.Vector3[]
  indexToValue: Record<number, number>
}

function getDiceConfig(type: DiceType): DiceConfig | null {
  switch (type) {
    case 'd20':
      return {
        buildPoints: (mesh) => buildD20SensorPointsLocal(mesh, 20),
        indexToValue: D20_INDEX_TO_VALUE,
      }
    case 'd12':
      return {
        buildPoints: (mesh) => buildD12SensorPointsLocal(mesh),
        indexToValue: D12_INDEX_TO_VALUE,
      }
    default:
      return null
  }
}

export const RollingDice = ({ type, colorSet, rotation, onResult }: RollingDiceProps) => {
  const { camera } = useThree()

  const rbRef = useRef<any>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)

  const [phase, setPhase] = useState<Phase>('dynamic')
  const [presentSeed, setPresentSeed] = useState(0)

  const startTime = useRef(0)
  const stableFrames = useRef(0)
  const hasLocked = useRef(false)

  const present = useRef<null | {
    pos: THREE.Vector3
    fromQuat: THREE.Quaternion
    toQuat: THREE.Quaternion
    t: number
  }>(null)

  const [sensorPointsLocal, setSensorPointsLocal] = useState<THREE.Vector3[]>([])
  const sensorsCacheRef = useRef<THREE.Vector3[] | null>(null)

  const cfg = useMemo(() => getDiceConfig(type), [type]) // мемоизируем по type [web:305]

  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const tmpDir = useMemo(() => new THREE.Vector3(), [])
  const tmpForward = useMemo(() => new THREE.Vector3(), [])
  const tmpToCam = useMemo(() => new THREE.Vector3(), [])
  const tmpPos = useMemo(() => new THREE.Vector3(), [])
  const tmpQuat = useMemo(() => new THREE.Quaternion(), [])
  const yawAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const tmpYawQuat = useMemo(() => new THREE.Quaternion(), [])
  const tmpToQuat = useMemo(() => new THREE.Quaternion(), [])

  // (1) строим сенсоры под текущий type
  useEffect(() => {
    sensorsCacheRef.current = null
    setSensorPointsLocal([])

    if (!cfg) return

    let raf = 0
    const waitMeshAndBuild = () => {
      const mesh = meshRef.current
      if (!mesh) {
        raf = requestAnimationFrame(waitMeshAndBuild)
        return
      }

      // кэшируем именно под текущий type (мы его сбросили выше)
      const pts = cfg.buildPoints(mesh)
      sensorsCacheRef.current = pts
      setSensorPointsLocal(pts)
    }

    waitMeshAndBuild()
    return () => cancelAnimationFrame(raf)
  }, [cfg])

  const getTopSensorIndex = (quat: THREE.Quaternion) => {
    let bestDot = -Infinity
    let bestIndex = 0

    for (let i = 0; i < sensorPointsLocal.length; i++) {
      tmpDir.copy(sensorPointsLocal[i]).normalize().applyQuaternion(quat)
      const d = tmpDir.dot(up)
      if (d > bestDot) {
        bestDot = d
        bestIndex = i
      }
    }
    return bestIndex
  }

  const calcYawToFaceCamera = (quat: THREE.Quaternion, dicePos: THREE.Vector3) => {
    tmpForward.set(0, 0, 1).applyQuaternion(quat)
    tmpForward.y = 0
    tmpForward.normalize()

    tmpToCam.subVectors(camera.position, dicePos)
    tmpToCam.y = 0
    tmpToCam.normalize()

    const sin = new THREE.Vector3().crossVectors(tmpForward, tmpToCam).dot(up)
    const cos = tmpForward.dot(tmpToCam)
    return Math.atan2(sin, cos)
  }

  // (2) старт броска при смене rotation (как у тебя было)
  useEffect(() => {
    hasLocked.current = false
    stableFrames.current = 0
    present.current = null
    startTime.current = performance.now()
    setPhase('dynamic')

    const t = setTimeout(() => {
      if (!rbRef.current) return

      rbRef.current.setTranslation({ x: 0, y: 8, z: 0 }, true)
      rbRef.current.setRotation(rotation, true, true)

      rbRef.current.applyImpulse(
        { x: (Math.random() - 0.5) * 8, y: 12, z: (Math.random() - 0.5) * 8 },
        true
      )
      rbRef.current.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * 50,
          y: (Math.random() - 0.5) * 50,
          z: (Math.random() - 0.5) * 50,
        },
        true
      )
    }, 100)

    return () => clearTimeout(t)
  }, [rotation])

  // (3) детект “успокоился” + вычисление результата
  useFrame(() => {
    if (phase !== 'dynamic') return
    if (!rbRef.current || hasLocked.current) return
    if (!cfg) return
    if (sensorPointsLocal.length === 0) return

    const elapsed = (performance.now() - startTime.current) / 1000
    const vel = rbRef.current.linvel()
    const ang = rbRef.current.angvel()
    const linLen = Math.hypot(vel.x, vel.y, vel.z)
    const angLen = Math.hypot(ang.x, ang.y, ang.z)

    const settled = elapsed > 0.8 && linLen < 0.12 && angLen < 0.35
    stableFrames.current = settled ? stableFrames.current + 1 : 0
    if (stableFrames.current < 20) return

    hasLocked.current = true
    rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)

    const p = rbRef.current.translation()
    const r = rbRef.current.rotation()

    tmpPos.set(p.x, p.y, p.z)
    tmpQuat.set(r.x, r.y, r.z, r.w)

    const topIndex = getTopSensorIndex(tmpQuat)
    const value = cfg.indexToValue[topIndex] ?? 0
    onResult(value)

    const yaw = calcYawToFaceCamera(tmpQuat, tmpPos)
    tmpYawQuat.setFromAxisAngle(yawAxis, yaw)
    tmpToQuat.copy(tmpYawQuat).multiply(tmpQuat)

    present.current = {
      pos: tmpPos.clone(),
      fromQuat: tmpQuat.clone(),
      toQuat: tmpToQuat.clone(),
      t: 0,
    }

    setPresentSeed((s) => s + 1)
    setPhase('present')
  })

  // (4) презентация (плавный доворот)
  useFrame((_, delta) => {
    if (phase !== 'present') return
    if (!rbRef.current || !present.current) return

    const { pos, fromQuat, toQuat } = present.current
    rbRef.current.setNextKinematicTranslation({ x: pos.x, y: pos.y, z: pos.z })

    present.current.t = Math.min(1, present.current.t + delta / 0.4)
    tmpQuat.copy(fromQuat).slerp(toQuat, present.current.t)
    rbRef.current.setNextKinematicRotation(tmpQuat)
  })

  const rigidType = phase === 'dynamic' ? ('dynamic' as const) : ('kinematicPosition' as const)

  return (
    <RigidBody
      key={presentSeed}
      ref={rbRef}
      type={rigidType}
      colliders="hull"
      restitution={0.7}
      friction={0.2}
      linearDamping={0.05}
      angularDamping={0.1}
    >
      <Dice
        type={type}
        colorSet={colorSet}
        position={[0, 0, 0]}
        scale={1.4}
        autoRotate={false}
        meshRef={meshRef}
      />
    </RigidBody>
  )
}

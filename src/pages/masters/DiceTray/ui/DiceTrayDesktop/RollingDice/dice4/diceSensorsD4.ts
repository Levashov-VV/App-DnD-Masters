import * as THREE from 'three';

const quantKey = (v: THREE.Vector3, eps = 1e-5) =>
  `${Math.round(v.x / eps)}|${Math.round(v.y / eps)}|${Math.round(v.z / eps)}`;

const pickFarthest = (points: THREE.Vector3[], chosen: THREE.Vector3[]) => {
  let best = points[0];
  let bestScore = -Infinity;
  for (const p of points) {
    let minD2 = Infinity;
    for (const c of chosen) minD2 = Math.min(minD2, p.distanceToSquared(c));
    if (minD2 > bestScore) {
      bestScore = minD2;
      best = p;
    }
  }
  return best;
};

export const buildD4SensorPointsLocal = (mesh: THREE.Mesh): THREE.Vector3[] => {
  const geom = mesh.geometry;
  if (!(geom instanceof THREE.BufferGeometry)) return [];

  const posAttrUnknown = geom.getAttribute('position');
  if (!posAttrUnknown || !(posAttrUnknown instanceof THREE.BufferAttribute)) return [];
  const posAttr = posAttrUnknown;

  const bbox = new THREE.Box3().setFromBufferAttribute(posAttr);
  const center = bbox.getCenter(new THREE.Vector3());
  const radius = bbox.getSize(new THREE.Vector3()).length() * 0.35;

  const unique: THREE.Vector3[] = [];
  const seen = new Set<string>();
  const v = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i).sub(center);
    const key = quantKey(v);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(v.clone());
    }
  }
  if (unique.length < 4) return [];
  unique.sort((a, b) => b.lengthSq() - a.lengthSq());
  const chosen: THREE.Vector3[] = [unique[0]];

  while (chosen.length < 4) chosen.push(pickFarthest(unique, chosen));

  return chosen.map((p) => p.clone().normalize().multiplyScalar(radius));
};

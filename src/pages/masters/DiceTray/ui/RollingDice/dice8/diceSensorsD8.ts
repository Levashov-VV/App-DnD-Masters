import * as THREE from 'three';

type KMeansResult = { centers: THREE.Vector3[] };

const pickRandom = (arr: THREE.Vector3[]) => arr[Math.floor(Math.random() * arr.length)].clone();

const kmeansUnitVectors = (points: THREE.Vector3[], k: number, iters = 12): KMeansResult => {
  if (points.length === 0) return { centers: [] };

  const centers: THREE.Vector3[] = [];
  const maxInitTries = k * 50;
  let tries = 0;

  while (centers.length < k && tries < maxInitTries) {
    tries++;
    const c = pickRandom(points).normalize();
    if (!centers.some((x) => x.dot(c) > 0.999)) centers.push(c);
  }
  while (centers.length < k) centers.push(pickRandom(points).normalize());

  const assignments = new Array(points.length).fill(0);

  for (let iter = 0; iter < iters; iter++) {
    for (let i = 0; i < points.length; i++) {
      let best = 0;
      let bestDot = -Infinity;
      for (let j = 0; j < centers.length; j++) {
        const d = points[i].dot(centers[j]);
        if (d > bestDot) {
          bestDot = d;
          best = j;
        }
      }
      assignments[i] = best;
    }

    const sum = Array.from({ length: k }, () => new THREE.Vector3());
    const cnt = new Array(k).fill(0);

    for (let i = 0; i < points.length; i++) {
      sum[assignments[i]].add(points[i]);
      cnt[assignments[i]]++;
    }

    for (let j = 0; j < k; j++) {
      centers[j] = cnt[j] === 0 ? pickRandom(points).normalize() : sum[j].normalize();
    }
  }

  centers.sort((a, b) => b.y - a.y || b.z - a.z || b.x - a.x);
  return { centers };
};

const triangleNormal = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
  const ab = b.clone().sub(a);
  const ac = c.clone().sub(a);
  return ab.cross(ac).normalize();
};

export const buildD8SensorPointsLocal = (mesh: THREE.Mesh): THREE.Vector3[] => {
  const faces = 8;
  const geom = mesh.geometry;
  if (!(geom instanceof THREE.BufferGeometry)) return [];

  const posAttrUnknown = geom.getAttribute('position');
  if (!posAttrUnknown) return [];
  if (!(posAttrUnknown instanceof THREE.BufferAttribute)) return [];

  const posAttr = posAttrUnknown;

  const bbox = new THREE.Box3().setFromBufferAttribute(posAttr);
  const center = bbox.getCenter(new THREE.Vector3());
  const radius = bbox.getSize(new THREE.Vector3()).length() * 0.35;

  const indexAttr = geom.getIndex();

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  const normals: THREE.Vector3[] = [];

  const triCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
  const maxTris = 3000;
  const triStep = Math.max(1, Math.floor(triCount / maxTris));

  for (let t = 0; t < triCount; t += triStep) {
    let ia: number, ib: number, ic: number;

    if (indexAttr) {
      ia = indexAttr.getX(t * 3 + 0);
      ib = indexAttr.getX(t * 3 + 1);
      ic = indexAttr.getX(t * 3 + 2);
    } else {
      ia = t * 3 + 0;
      ib = t * 3 + 1;
      ic = t * 3 + 2;
    }

    a.fromBufferAttribute(posAttr, ia).sub(center);
    b.fromBufferAttribute(posAttr, ib).sub(center);
    c.fromBufferAttribute(posAttr, ic).sub(center);

    const n = triangleNormal(a, b, c);
    if (n.lengthSq() > 1e-8) normals.push(n);
  }

  if (normals.length === 0) return [];
  const { centers } = kmeansUnitVectors(normals, faces, 8);

  return centers.map((u) => u.clone().multiplyScalar(radius));
};

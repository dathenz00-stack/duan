import * as THREE from 'three';

export function createKeratinLayerGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'keratin-layer';
  group.userData = { partId: 'keratin-layer' };

  const keratinCoreMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#7C4D25'),
    roughness: 0.72,
    metalness: 0.08,
  });

  const keratinFiberMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9A6334'),
    roughness: 0.65,
    metalness: 0.1,
  });

  const activeSiteMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B87D4B'),
    roughness: 0.5,
    metalness: 0.12,
  });

  // Central packed keratin bed cylinder
  const bedGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.52, 32);
  const bedMesh = new THREE.Mesh(bedGeo, keratinCoreMat);
  bedMesh.castShadow = true;
  bedMesh.receiveShadow = true;
  group.add(bedMesh);

  // Interwoven keratin fiber coils on the outer & upper surface
  const coilCount = 10;
  for (let i = 0; i < coilCount; i++) {
    const yOffset = -0.21 + (i / (coilCount - 1)) * 0.42;
    const torusGeo = new THREE.TorusGeometry(0.545, 0.02, 8, 36);
    const coil = new THREE.Mesh(torusGeo, i % 2 === 0 ? keratinFiberMat : activeSiteMat);
    coil.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.06 : -0.06);
    coil.rotation.y = i * 0.4;
    coil.position.y = yOffset;
    group.add(coil);
  }

  // Micro-granule / active disulfide node clusters around the perimeter
  const nodeGeo = new THREE.SphereGeometry(0.032, 10, 10);
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const row = (i % 3) - 1;
    const node = new THREE.Mesh(nodeGeo, activeSiteMat);
    node.position.set(
      Math.cos(angle) * 0.545,
      row * 0.14,
      Math.sin(angle) * 0.545
    );
    group.add(node);
  }

  // Separator mesh ring between layers
  const separatorGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.03, 32);
  const separatorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#CBD5E1'),
    roughness: 0.35,
    metalness: 0.6,
  });
  const topSep = new THREE.Mesh(separatorGeo, separatorMat);
  topSep.position.y = 0.27;
  group.add(topSep);

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'keratin-layer' };
    }
  });

  return group;
}

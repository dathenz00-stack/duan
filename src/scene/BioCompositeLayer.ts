import * as THREE from 'three';

export function createBioCompositeLayerGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'biocomposite-layer';
  group.userData = { partId: 'biocomposite-layer' };

  // Dual-phase matrix: Green-tinted bio-composite core + golden cellulose-keratin lattice
  const matrixMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#275E43'),
    roughness: 0.62,
    metalness: 0.1,
  });

  const scaffoldRibbonMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B5854B'),
    roughness: 0.74,
    metalness: 0.06,
  });

  const supportPlateMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#94A3B8'),
    roughness: 0.3,
    metalness: 0.75,
  });

  // Main composite cylinder
  const compGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.5, 32);
  const compMesh = new THREE.Mesh(compGeo, matrixMat);
  compMesh.castShadow = true;
  compMesh.receiveShadow = true;
  group.add(compMesh);

  // Dual-phase structural lattice bands wrapping the bio-composite core
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const ribGeo = new THREE.BoxGeometry(0.035, 0.48, 0.035);
    const rib = new THREE.Mesh(ribGeo, scaffoldRibbonMat);
    rib.position.set(Math.cos(angle) * 0.538, 0, Math.sin(angle) * 0.538);
    rib.rotation.y = -angle;
    group.add(rib);
  }

  // Horizontal interlocking rings
  [-0.16, 0, 0.16].forEach((y) => {
    const ringGeo = new THREE.TorusGeometry(0.548, 0.022, 10, 32);
    const ring = new THREE.Mesh(ringGeo, scaffoldRibbonMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  });

  // Bottom stainless steel perforated collector plate
  const plateGeo = new THREE.CylinderGeometry(0.565, 0.565, 0.04, 32);
  const bottomPlate = new THREE.Mesh(plateGeo, supportPlateMat);
  bottomPlate.position.y = -0.27;
  group.add(bottomPlate);

  const topPlate = new THREE.Mesh(plateGeo, supportPlateMat);
  topPlate.position.y = 0.27;
  group.add(topPlate);

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'biocomposite-layer' };
    }
  });

  return group;
}

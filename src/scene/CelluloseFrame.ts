import * as THREE from 'three';

export function createCelluloseFrameGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'cellulose-frame';
  group.userData = { partId: 'cellulose-frame' };

  const primaryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D4AF7A'),
    roughness: 0.78,
    metalness: 0.05,
  });

  const secondaryFiberMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C2955B'),
    roughness: 0.85,
    metalness: 0.02,
  });

  // Main porous core cylinder (semi-open cutaway appearance via torus rings + lattice struts)
  const coreGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.46, 28, 4, false);
  const coreMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#DEC092'),
    roughness: 0.82,
    metalness: 0.04,
    transparent: true,
    opacity: 0.82,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.castShadow = true;
  coreMesh.receiveShadow = true;
  group.add(coreMesh);

  // Horizontal porous vascular rings representing luffa cross-section network
  const ringHeights = [-0.18, -0.06, 0.06, 0.18];
  ringHeights.forEach((y, idx) => {
    const ringGeo = new THREE.TorusGeometry(0.545, 0.024, 10, 32);
    const ring = new THREE.Mesh(ringGeo, idx % 2 === 0 ? primaryMat : secondaryFiberMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);

    // Internal radial spokes (vascular bundles of luffa sponge)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + idx * 0.25;
      const spokeGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.04, 8);
      const spoke = new THREE.Mesh(spokeGeo, secondaryFiberMat);
      spoke.position.y = y;
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = angle;
      group.add(spoke);
    }
  });

  // Helical & vertical fibrous struts around circumference
  const strutCount = 14;
  for (let i = 0; i < strutCount; i++) {
    const angle = (i / strutCount) * Math.PI * 2;
    const strutGeo = new THREE.CylinderGeometry(0.018, 0.02, 0.48, 8);
    const strut = new THREE.Mesh(strutGeo, primaryMat);
    strut.position.set(Math.cos(angle) * 0.535, 0, Math.sin(angle) * 0.535);
    strut.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.14;
    group.add(strut);
  }

  // Top distribution sieve ring
  const topCapGeo = new THREE.RingGeometry(0.15, 0.56, 32);
  const topCap = new THREE.Mesh(topCapGeo, secondaryFiberMat);
  topCap.rotation.x = -Math.PI / 2;
  topCap.position.y = 0.235;
  group.add(topCap);

  // Tag all child meshes for raycasting
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'cellulose-frame' };
    }
  });

  return group;
}

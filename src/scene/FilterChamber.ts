import * as THREE from 'three';

export function createFilterChamberGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'filter-chamber';
  group.userData = { partId: 'filter-chamber' };

  // Transparent Acrylic Cylinder
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E6F4F8'),
    transparent: true,
    opacity: 0.32,
    roughness: 0.12,
    metalness: 0.05,
    transmission: 0.45,
    reflectivity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const flangeMetalMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#CBD5E1'),
    roughness: 0.28,
    metalness: 0.78,
  });

  const gasketMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#174D35'),
    roughness: 0.6,
    metalness: 0.1,
  });

  // Outer transparent PMMA tube
  const tubeGeo = new THREE.CylinderGeometry(0.64, 0.64, 2.05, 40, 1, true);
  const tubeMesh = new THREE.Mesh(tubeGeo, glassMat);
  group.add(tubeMesh);

  // Top & bottom CNC aluminum flanges
  const flangeGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.12, 36);
  const topFlange = new THREE.Mesh(flangeGeo, flangeMetalMat);
  topFlange.position.y = 1.05;
  topFlange.castShadow = true;
  group.add(topFlange);

  const bottomFlange = new THREE.Mesh(flangeGeo, flangeMetalMat);
  bottomFlange.position.y = -1.05;
  bottomFlange.castShadow = true;
  group.add(bottomFlange);

  // O-ring seals
  const sealGeo = new THREE.TorusGeometry(0.65, 0.03, 12, 36);
  const topSeal = new THREE.Mesh(sealGeo, gasketMat);
  topSeal.rotation.x = Math.PI / 2;
  topSeal.position.y = 0.98;
  group.add(topSeal);

  const bottomSeal = new THREE.Mesh(sealGeo, gasketMat);
  bottomSeal.rotation.x = Math.PI / 2;
  bottomSeal.position.y = -0.98;
  group.add(bottomSeal);

  // 4 stainless tie-rods around the chamber
  const rodGeo = new THREE.CylinderGeometry(0.022, 0.022, 2.22, 12);
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + Math.PI / 4;
    const rod = new THREE.Mesh(rodGeo, flangeMetalMat);
    rod.position.set(Math.cos(angle) * 0.69, 0, Math.sin(angle) * 0.69);
    group.add(rod);
  }

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'filter-chamber' };
    }
  });

  return group;
}

export function createOuterHousingGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'outer-housing';
  group.userData = { partId: 'outer-housing' };

  const baseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1E293B'),
    roughness: 0.45,
    metalness: 0.55,
  });

  const pillarMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#94A3B8'),
    roughness: 0.35,
    metalness: 0.7,
  });

  const accentTrimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#174D35'),
    roughness: 0.5,
    metalness: 0.2,
  });

  // Heavy laboratory base platform
  const basePlateGeo = new THREE.BoxGeometry(3.4, 0.16, 2.2);
  const basePlate = new THREE.Mesh(basePlateGeo, baseMat);
  basePlate.position.set(0.15, -1.35, 0);
  basePlate.receiveShadow = true;
  basePlate.castShadow = true;
  group.add(basePlate);

  // Green trim border on base
  const trimGeo = new THREE.BoxGeometry(3.44, 0.04, 2.24);
  const trimMesh = new THREE.Mesh(trimGeo, accentTrimMat);
  trimMesh.position.set(0.15, -1.26, 0);
  group.add(trimMesh);

  // Two vertical structural support columns holding the filter chamber
  [-0.86, 0.86].forEach((xPos) => {
    const colGeo = new THREE.BoxGeometry(0.12, 2.6, 0.16);
    const col = new THREE.Mesh(colGeo, pillarMat);
    col.position.set(xPos, -0.02, -0.25);
    col.castShadow = true;
    group.add(col);

    // Collar clamp arm
    const armGeo = new THREE.BoxGeometry(0.28, 0.1, 0.32);
    const topArm = new THREE.Mesh(armGeo, pillarMat);
    topArm.position.set(xPos * 0.82, 0.85, -0.1);
    group.add(topArm);

    const botArm = new THREE.Mesh(armGeo, pillarMat);
    botArm.position.set(xPos * 0.82, -0.55, -0.1);
    group.add(botArm);
  });

  // Top bridge arch
  const archGeo = new THREE.BoxGeometry(1.9, 0.1, 0.22);
  const arch = new THREE.Mesh(archGeo, accentTrimMat);
  arch.position.set(0, 1.32, -0.25);
  arch.castShadow = true;
  group.add(arch);

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'outer-housing' };
    }
  });

  return group;
}

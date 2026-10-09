import * as THREE from 'three';

function createTubeAlongPoints(
  points: THREE.Vector3[],
  radius: number,
  material: THREE.Material
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
  const geo = new THREE.TubeGeometry(curve, 40, radius, 14, false);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  return mesh;
}

export function createPipeSystemGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'pipe-system';
  group.userData = { partId: 'pipe-system' };

  const steelPipeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#CBD5E1'),
    roughness: 0.25,
    metalness: 0.82,
  });

  const recirculationPipeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#38BDF8'),
    roughness: 0.2,
    metalness: 0.15,
    transparent: true,
    opacity: 0.65,
  });

  const pumpBodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#334155'),
    roughness: 0.45,
    metalness: 0.5,
  });

  const valveBodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#174D35'),
    roughness: 0.4,
    metalness: 0.35,
  });

  // Peristaltic Feed Pump on Left Side
  const pumpBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.38, 0.42), pumpBodyMat);
  pumpBase.position.set(-1.15, -1.06, 0.35);
  pumpBase.castShadow = true;
  group.add(pumpBase);

  const pumpRotor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.12, 24),
    steelPipeMat
  );
  pumpRotor.rotation.x = Math.PI / 2;
  pumpRotor.position.set(-1.15, -1.02, 0.58);
  group.add(pumpRotor);

  // 1. Inlet Pipe: From left intake -> pump -> up left riser -> into top flange (0, 1.15, 0)
  const inletPoints = [
    new THREE.Vector3(-1.55, -1.05, 0.35),
    new THREE.Vector3(-1.15, -1.05, 0.35),
    new THREE.Vector3(-1.15, 0.65, 0.35),
    new THREE.Vector3(-1.15, 1.48, 0.15),
    new THREE.Vector3(-0.35, 1.52, 0),
    new THREE.Vector3(0, 1.28, 0),
  ];
  group.add(createTubeAlongPoints(inletPoints, 0.052, steelPipeMat));

  // 2. Outlet Pipe: From bottom flange (0, -0.92, 0) -> forward/right -> 3-way solenoid valve -> right outlet port
  const outletPoints = [
    new THREE.Vector3(0, -0.92, 0),
    new THREE.Vector3(0, -1.12, 0.42),
    new THREE.Vector3(0.68, -1.12, 0.42),
    new THREE.Vector3(1.15, -1.12, 0.42),
  ];
  group.add(createTubeAlongPoints(outletPoints, 0.052, steelPipeMat));

  // 3-Way Solenoid Diverter Valve at (0.52, -1.12, 0.42)
  const valveBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.24), valveBodyMat);
  valveBox.position.set(0.52, -1.04, 0.42);
  group.add(valveBox);

  // 3. Recirculation Loop: From 3-way valve (0.52, -1.12, 0.42) -> front arc -> back to pump intake (-1.15, -0.6, 0.35)
  const recircPoints = [
    new THREE.Vector3(0.52, -1.12, 0.42),
    new THREE.Vector3(0.52, -1.12, 0.78),
    new THREE.Vector3(-0.35, -1.12, 0.78),
    new THREE.Vector3(-1.15, -1.12, 0.78),
    new THREE.Vector3(-1.15, -0.75, 0.35),
  ];
  group.add(createTubeAlongPoints(recircPoints, 0.042, recirculationPipeMat));

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'pipe-system' };
    }
  });

  return group;
}

export function createSensorNodesGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sensor-nodes';
  group.userData = { partId: 'sensor-nodes' };

  const sensorBodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0F766E'),
    roughness: 0.35,
    metalness: 0.4,
  });

  const gaugeRimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E2E8F0'),
    roughness: 0.25,
    metalness: 0.8,
  });

  const dialFaceMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F8FAFC'),
    roughness: 0.2,
    metalness: 0.05,
  });

  // Upstream Flow & Pressure Sensor on Left Riser (-1.15, 0.45, 0.35)
  const upSensor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.24), sensorBodyMat);
  upSensor.position.set(-1.15, 0.45, 0.35);
  upSensor.castShadow = true;
  group.add(upSensor);

  const upGaugeRim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.07, 24),
    gaugeRimMat
  );
  upGaugeRim.rotation.x = Math.PI / 2;
  upGaugeRim.position.set(-1.15, 0.78, 0.42);
  group.add(upGaugeRim);

  const upGaugeFace = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.075, 24),
    dialFaceMat
  );
  upGaugeFace.rotation.x = Math.PI / 2;
  upGaugeFace.position.set(-1.15, 0.78, 0.425);
  group.add(upGaugeFace);

  // Downstream Quality & Flow Sensor at Outlet Line (0.2, -1.12, 0.42)
  const downSensor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.24), sensorBodyMat);
  downSensor.position.set(0.18, -1.12, 0.42);
  downSensor.castShadow = true;
  group.add(downSensor);

  const downProbe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.22, 16),
    gaugeRimMat
  );
  downProbe.position.set(0.18, -0.95, 0.42);
  group.add(downProbe);

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'sensor-nodes' };
    }
  });

  return group;
}

export function createSmartControllerGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'smart-controller';
  group.userData = { partId: 'smart-controller' };

  const consoleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#174D35'),
    roughness: 0.42,
    metalness: 0.3,
  });

  const panelBezelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0F172A'),
    roughness: 0.3,
    metalness: 0.5,
  });

  const screenMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#38BDF8'),
  });

  // Slanted Microcontroller Console Housing at [1.35, -0.55, 0.35]
  const bodyGeo = new THREE.BoxGeometry(0.62, 0.76, 0.44);
  const bodyMesh = new THREE.Mesh(bodyGeo, consoleMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Display Bezel
  const bezelGeo = new THREE.BoxGeometry(0.5, 0.34, 0.04);
  const bezelMesh = new THREE.Mesh(bezelGeo, panelBezelMat);
  bezelMesh.position.set(0, 0.14, 0.22);
  group.add(bezelMesh);

  // Illuminated OLED Screen
  const screenGeo = new THREE.PlaneGeometry(0.44, 0.26);
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0.14, 0.245);
  group.add(screenMesh);

  // Physical tactile control buttons on front panel
  const btnGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16);
  const btnColors = ['#4D9667', '#45A9C7', '#E2E8F0'];
  btnColors.forEach((hex, idx) => {
    const btnMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.3 });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(-0.14 + idx * 0.14, -0.14, 0.22);
    group.add(btn);
  });

  // Mounting pedestal connecting controller to base
  const standGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.55, 16);
  const standMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#64748B'),
    roughness: 0.4,
    metalness: 0.7,
  });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.set(0, -0.55, 0);
  group.add(stand);

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.userData = { partId: 'smart-controller' };
    }
  });

  return group;
}

export class WaterFlowParticleSystem {
  public mesh: THREE.InstancedMesh;
  private count = 56;
  private dummy = new THREE.Object3D();
  private offsets: number[] = [];
  private radii: number[] = [];
  private angles: number[] = [];

  private inletCurve: THREE.CatmullRomCurve3;
  private outletCurve: THREE.CatmullRomCurve3;
  private recircCurve: THREE.CatmullRomCurve3;

  constructor() {
    const geo = new THREE.SphereGeometry(0.032, 10, 10);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38BDF8'),
      emissive: new THREE.Color('#0284C7'),
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.1,
    });

    this.mesh = new THREE.InstancedMesh(geo, mat, this.count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < this.count; i++) {
      this.offsets.push(i / this.count);
      this.radii.push(0.08 + (i % 5) * 0.085);
      this.angles.push((i * 1.37) % (Math.PI * 2));
    }

    this.inletCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, -1.05, 0.35),
      new THREE.Vector3(-1.15, -1.05, 0.35),
      new THREE.Vector3(-1.15, 0.65, 0.35),
      new THREE.Vector3(-1.15, 1.48, 0.15),
      new THREE.Vector3(-0.35, 1.52, 0),
      new THREE.Vector3(0, 1.18, 0),
    ]);

    this.outletCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.82, 0),
      new THREE.Vector3(0, -1.12, 0.42),
      new THREE.Vector3(0.52, -1.12, 0.42),
      new THREE.Vector3(1.15, -1.12, 0.42),
    ]);

    this.recircCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.52, -1.12, 0.42),
      new THREE.Vector3(0.52, -1.12, 0.78),
      new THREE.Vector3(-0.35, -1.12, 0.78),
      new THREE.Vector3(-1.15, -1.12, 0.78),
      new THREE.Vector3(-1.15, -0.75, 0.35),
    ]);
  }

  public update(
    elapsedTime: number,
    activeSegment: 'all' | 'inlet' | 'pretreatment' | 'bio-core' | 'sensors' | 'outlet' | 'recirculation',
    visible: boolean
  ) {
    this.mesh.visible = visible;
    if (!visible) return;

    const colorRaw = new THREE.Color('#7DD3FC');
    const colorFiltering = new THREE.Color('#38BDF8');
    const colorOut = new THREE.Color('#22D3EE');

    for (let i = 0; i < this.count; i++) {
      const t = (this.offsets[i] + elapsedTime * 0.22) % 1;
      let pos = new THREE.Vector3();

      if (activeSegment === 'inlet') {
        pos.copy(this.inletCurve.getPointAt(t));
        this.mesh.setColorAt(i, colorRaw);
      } else if (activeSegment === 'pretreatment') {
        const y = 1.1 - t * 0.55;
        const r = this.radii[i];
        const a = this.angles[i] + elapsedTime * 1.2;
        pos.set(Math.cos(a) * r, y, Math.sin(a) * r);
        this.mesh.setColorAt(i, colorRaw);
      } else if (activeSegment === 'bio-core') {
        const y = 0.85 - t * 1.55;
        const r = this.radii[i];
        const a = this.angles[i] + y * 2.5 + elapsedTime * 0.8;
        pos.set(Math.cos(a) * r, y, Math.sin(a) * r);
        this.mesh.setColorAt(i, colorFiltering);
      } else if (activeSegment === 'sensors' || activeSegment === 'outlet') {
        pos.copy(this.outletCurve.getPointAt(t));
        this.mesh.setColorAt(i, colorOut);
      } else if (activeSegment === 'recirculation') {
        pos.copy(this.recircCurve.getPointAt(t));
        this.mesh.setColorAt(i, colorFiltering);
      } else {
        // Full continuous journey across the machine
        if (t < 0.32) {
          const localT = t / 0.32;
          pos.copy(this.inletCurve.getPointAt(localT));
          this.mesh.setColorAt(i, colorRaw);
        } else if (t < 0.72) {
          const localT = (t - 0.32) / 0.4;
          const y = 1.1 - localT * 1.9;
          const r = this.radii[i];
          const a = this.angles[i] + localT * 4.0;
          pos.set(Math.cos(a) * r, y, Math.sin(a) * r);
          this.mesh.setColorAt(i, colorFiltering);
        } else {
          const localT = (t - 0.72) / 0.28;
          pos.copy(this.outletCurve.getPointAt(localT));
          this.mesh.setColorAt(i, colorOut);
        }
      }

      this.dummy.position.copy(pos);
      this.dummy.scale.setScalar(1);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  public dispose() {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((m) => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
  }
}

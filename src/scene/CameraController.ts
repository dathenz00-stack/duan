import * as THREE from 'three';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public currentTarget = new THREE.Vector3(0, 0.1, 0);
  private desiredPosition = new THREE.Vector3(3.8, 2.1, 4.4);
  private desiredTarget = new THREE.Vector3(0, 0.1, 0);

  // Spherical coordinates for manual user orbit around desiredTarget
  private spherical = new THREE.Spherical();
  private isDragging = false;
  private prevPointer = { x: 0, y: 0 };
  private isAnimatingPreset = false;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.camera.position.copy(this.desiredPosition);
    this.camera.lookAt(this.currentTarget);
    this.syncSphericalFromVector(this.desiredPosition, this.desiredTarget);
  }

  private syncSphericalFromVector(pos: THREE.Vector3, target: THREE.Vector3) {
    const offset = pos.clone().sub(target);
    this.spherical.setFromVector3(offset);
  }

  public flyTo(position: [number, number, number], target: [number, number, number], immediate = false) {
    this.desiredPosition.set(position[0], position[1], position[2]);
    this.desiredTarget.set(target[0], target[1], target[2]);
    this.syncSphericalFromVector(this.desiredPosition, this.desiredTarget);

    if (immediate) {
      this.camera.position.copy(this.desiredPosition);
      this.currentTarget.copy(this.desiredTarget);
      this.camera.lookAt(this.currentTarget);
      this.isAnimatingPreset = false;
    } else {
      this.isAnimatingPreset = true;
    }
  }

  public resetToOverview(immediate = false) {
    this.flyTo([3.8, 2.1, 4.4], [0, 0.1, 0], immediate);
  }

  public onPointerDown(clientX: number, clientY: number) {
    this.isDragging = true;
    this.isAnimatingPreset = false;
    this.prevPointer = { x: clientX, y: clientY };
  }

  public onPointerMove(clientX: number, clientY: number) {
    if (!this.isDragging) return;
    const dx = clientX - this.prevPointer.x;
    const dy = clientY - this.prevPointer.y;
    this.prevPointer = { x: clientX, y: clientY };

    this.spherical.theta -= dx * 0.0065;
    this.spherical.phi = THREE.MathUtils.clamp(
      this.spherical.phi - dy * 0.0065,
      0.25,
      Math.PI * 0.72
    );

    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.desiredPosition.copy(this.desiredTarget).add(offset);
  }

  public onPointerUp() {
    this.isDragging = false;
  }

  public onWheel(deltaY: number) {
    this.isAnimatingPreset = false;
    this.spherical.radius = THREE.MathUtils.clamp(
      this.spherical.radius + deltaY * 0.003,
      1.6,
      7.5
    );
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.desiredPosition.copy(this.desiredTarget).add(offset);
  }

  public update(dt: number, reducedMotion = false) {
    const damping = reducedMotion ? 1.0 : Math.min(1, dt * 6.5);
    this.camera.position.lerp(this.desiredPosition, damping);
    this.currentTarget.lerp(this.desiredTarget, damping);
    this.camera.lookAt(this.currentTarget);

    if (
      this.isAnimatingPreset &&
      this.camera.position.distanceTo(this.desiredPosition) < 0.02
    ) {
      this.isAnimatingPreset = false;
    }
  }
}

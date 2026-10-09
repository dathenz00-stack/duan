import * as THREE from 'three';
import { MACHINE_COMPONENTS, MachinePartMetadata } from '../data/machineComponents';
import { createCelluloseFrameGroup } from './CelluloseFrame';
import { createKeratinLayerGroup } from './KeratinLayer';
import { createBioCompositeLayerGroup } from './BioCompositeLayer';
import { createFilterChamberGroup, createOuterHousingGroup } from './FilterChamber';
import {
  createPipeSystemGroup,
  createSensorNodesGroup,
  createSmartControllerGroup,
  WaterFlowParticleSystem,
} from './PipeSystem';

export interface LayerVisibilityState {
  'cellulose-frame': boolean;
  'keratin-layer': boolean;
  'biocomposite-layer': boolean;
}

export class SmartBioTrapMachineModel {
  public rootGroup = new THREE.Group();
  public partGroups = new Map<string, THREE.Group>();
  public waterFlow: WaterFlowParticleSystem;

  private targetExplodeFactor = 0;
  private currentExplodeFactor = 0;

  constructor() {
    const partsMap: Record<string, THREE.Group> = {
      'outer-housing': createOuterHousingGroup(),
      'filter-chamber': createFilterChamberGroup(),
      'cellulose-frame': createCelluloseFrameGroup(),
      'keratin-layer': createKeratinLayerGroup(),
      'biocomposite-layer': createBioCompositeLayerGroup(),
      'pipe-system': createPipeSystemGroup(),
      'sensor-nodes': createSensorNodesGroup(),
      'smart-controller': createSmartControllerGroup(),
    };

    MACHINE_COMPONENTS.forEach((meta) => {
      const grp = partsMap[meta.id];
      if (grp) {
        grp.position.set(meta.basePosition[0], meta.basePosition[1], meta.basePosition[2]);
        this.partGroups.set(meta.id, grp);
        this.rootGroup.add(grp);
      }
    });

    this.waterFlow = new WaterFlowParticleSystem();
    this.rootGroup.add(this.waterFlow.mesh);
  }

  public setExploded(isExploded: boolean, immediate = false) {
    this.targetExplodeFactor = isExploded ? 1 : 0;
    if (immediate) {
      this.currentExplodeFactor = this.targetExplodeFactor;
      this.applyPartPositions();
    }
  }

  public setBioLayerVisibility(visibility: LayerVisibilityState) {
    (Object.keys(visibility) as Array<keyof LayerVisibilityState>).forEach((layerId) => {
      const grp = this.partGroups.get(layerId);
      if (grp) {
        grp.visible = visibility[layerId];
      }
    });
  }

  public setHighlightedParts(activePartIds: string[] | null) {
    this.partGroups.forEach((grp, partId) => {
      const isSelected =
        !activePartIds || activePartIds.length === 0 || activePartIds.includes(partId);

      grp.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
          if (activePartIds && activePartIds.length > 0 && activePartIds.includes(partId)) {
            obj.material.emissive.setHex(0x174d35);
            obj.material.emissiveIntensity = 0.28;
          } else {
            obj.material.emissive.setHex(0x000000);
            obj.material.emissiveIntensity = 0;
          }
          // Subtle dimming for unselected parts when inspecting a specific module
          if (partId !== 'filter-chamber') {
            obj.material.transparent = !isSelected || partId === 'cellulose-frame';
            obj.material.opacity = isSelected ? (partId === 'cellulose-frame' ? 0.88 : 1.0) : 0.35;
          }
        }
      });
    });
  }

  private applyPartPositions() {
    MACHINE_COMPONENTS.forEach((meta: MachinePartMetadata) => {
      const grp = this.partGroups.get(meta.id);
      if (!grp) return;
      const f = this.currentExplodeFactor;
      grp.position.set(
        meta.basePosition[0] + meta.explodedOffset[0] * f,
        meta.basePosition[1] + meta.explodedOffset[1] * f,
        meta.basePosition[2] + meta.explodedOffset[2] * f
      );
    });
  }

  public getPartWorldAnchor(meta: MachinePartMetadata): THREE.Vector3 {
    const grp = this.partGroups.get(meta.id);
    const pos = grp ? grp.position.clone() : new THREE.Vector3(...meta.basePosition);
    pos.add(new THREE.Vector3(...meta.labelAnchorOffset));
    return pos;
  }

  public update(
    dt: number,
    elapsedTime: number,
    flowSegment: 'all' | 'inlet' | 'pretreatment' | 'bio-core' | 'sensors' | 'outlet' | 'recirculation',
    showWaterFlow: boolean,
    reducedMotion: boolean
  ) {
    const lerpSpeed = reducedMotion ? 1.0 : Math.min(1, dt * 6.0);
    if (Math.abs(this.currentExplodeFactor - this.targetExplodeFactor) > 0.001) {
      this.currentExplodeFactor = THREE.MathUtils.lerp(
        this.currentExplodeFactor,
        this.targetExplodeFactor,
        lerpSpeed
      );
      this.applyPartPositions();
    }

    // Hide particle stream when exploded so it doesn't float in mid-air
    const canShowFlow = showWaterFlow && this.currentExplodeFactor < 0.2 && !reducedMotion;
    this.waterFlow.update(elapsedTime, flowSegment, canShowFlow);
  }

  public dispose() {
    this.rootGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
    this.waterFlow.dispose();
  }
}

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  MACHINE_COMPONENTS,
  MachinePartMetadata,
} from '../data/machineComponents';
import { BIO_MATERIALS_DATA } from '../data/materialInformation';
import { SmartBioTrapMachineModel, LayerVisibilityState } from '../scene/MachineModel';
import { CameraController } from '../scene/CameraController';
import { ComponentLabels, ProjectedPin } from './ComponentLabels';
import {
  Maximize2,
  RotateCcw,
  FileCode2,
  ChevronRight,
  Layers,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface ProductViewer3DProps {
  selectedPartId: string | null;
  highlightedPartIds: string[] | null;
  isExploded: boolean;
  showLabels: boolean;
  showWaterFlow: boolean;
  activeFlowSegment:
    | 'all'
    | 'inlet'
    | 'pretreatment'
    | 'bio-core'
    | 'sensors'
    | 'outlet'
    | 'recirculation';
  reducedMotion: boolean;
  use2DFallback: boolean;
  layerVisibility: LayerVisibilityState;
  cameraPresetOverride?: {
    position: [number, number, number];
    target: [number, number, number];
  } | null;
  onSelectPart: (partId: string | null) => void;
  onResetOverview: () => void;
  onToggleExploded: () => void;
  compactMode?: boolean;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  selectedPartId,
  highlightedPartIds,
  isExploded,
  showLabels,
  showWaterFlow,
  activeFlowSegment,
  reducedMotion,
  use2DFallback,
  layerVisibility,
  cameraPresetOverride,
  onSelectPart,
  onResetOverview,
  onToggleExploded,
  compactMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<SmartBioTrapMachineModel | null>(null);
  const cameraCtrlRef = useRef<CameraController | null>(null);

  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isLoading3D, setIsLoading3D] = useState<boolean>(true);
  const [pins, setPins] = useState<ProjectedPin[]>([]);
  const [showGlbGuideModal, setShowGlbGuideModal] = useState<boolean>(false);

  // Latest state refs for animation loop access without re-creating WebGL context
  const stateRef = useRef({
    selectedPartId,
    isExploded,
    showLabels,
    showWaterFlow,
    activeFlowSegment,
    reducedMotion,
  });

  useEffect(() => {
    stateRef.current = {
      selectedPartId,
      isExploded,
      showLabels,
      showWaterFlow,
      activeFlowSegment,
      reducedMotion,
    };
  }, [
    selectedPartId,
    isExploded,
    showLabels,
    showWaterFlow,
    activeFlowSegment,
    reducedMotion,
  ]);

  const selectedMeta: MachinePartMetadata | undefined = MACHINE_COMPONENTS.find(
    (m) => m.id === selectedPartId
  );

  const matchedBioMaterial = BIO_MATERIALS_DATA.find(
    (b) => b.targetPartId === selectedPartId
  );

  // Sync Exploded state to 3D model
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setExploded(isExploded, reducedMotion);
    }
  }, [isExploded, reducedMotion]);

  // Sync Bio-Layer visibility
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setBioLayerVisibility(layerVisibility);
    }
  }, [layerVisibility]);

  // Sync Highlighted parts
  useEffect(() => {
    if (!modelRef.current) return;
    if (highlightedPartIds && highlightedPartIds.length > 0) {
      modelRef.current.setHighlightedParts(highlightedPartIds);
    } else if (selectedPartId) {
      modelRef.current.setHighlightedParts([selectedPartId]);
    } else {
      modelRef.current.setHighlightedParts(null);
    }
  }, [selectedPartId, highlightedPartIds]);

  // Sync Camera target when selectedPartId or cameraPresetOverride changes
  useEffect(() => {
    if (!cameraCtrlRef.current) return;
    if (cameraPresetOverride) {
      cameraCtrlRef.current.flyTo(
        cameraPresetOverride.position,
        cameraPresetOverride.target,
        reducedMotion
      );
      return;
    }

    if (selectedPartId) {
      const partMeta = MACHINE_COMPONENTS.find((c) => c.id === selectedPartId);
      if (partMeta) {
        const expFactor = isExploded ? 1 : 0;
        const targetPos: [number, number, number] = [
          partMeta.cameraTarget[0] + partMeta.explodedOffset[0] * expFactor,
          partMeta.cameraTarget[1] + partMeta.explodedOffset[1] * expFactor,
          partMeta.cameraTarget[2] + partMeta.explodedOffset[2] * expFactor,
        ];
        const camPos: [number, number, number] = [
          partMeta.cameraPosition[0] + partMeta.explodedOffset[0] * expFactor * 0.6,
          partMeta.cameraPosition[1] + partMeta.explodedOffset[1] * expFactor * 0.6,
          partMeta.cameraPosition[2] + partMeta.explodedOffset[2] * expFactor * 0.6,
        ];
        cameraCtrlRef.current.flyTo(camPos, targetPos, reducedMotion);
      }
    } else {
      if (isExploded) {
        cameraCtrlRef.current.flyTo([4.6, 2.4, 5.4], [0.2, 0.2, 0.2], reducedMotion);
      } else {
        cameraCtrlRef.current.resetToOverview(reducedMotion);
      }
    }
  }, [selectedPartId, isExploded, cameraPresetOverride, reducedMotion]);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    if (use2DFallback) {
      setIsLoading3D(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      setIsLoading3D(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F3F5EE');
    scene.fog = new THREE.FogExp2('#F3F5EE', 0.045);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    const cameraCtrl = new CameraController(camera);
    cameraCtrlRef.current = cameraCtrl;

    // Studio Three-Point Lighting
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFFBEB', 1.65);
    keyLight.position.set(4.5, 6.5, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#E0F2FE', 0.75);
    fillLight.position.set(-5.0, 3.0, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#D1FAE5', 0.65);
    rimLight.position.set(0, 4.0, -5.0);
    scene.add(rimLight);

    // Subtle Laboratory Studio Floor Pedestal
    const floorGeo = new THREE.CircleGeometry(4.2, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E8ECE2'),
      roughness: 0.9,
      metalness: 0.02,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.44;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle calibration ring on studio floor
    const ringGeo = new THREE.RingGeometry(2.35, 2.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#174D35'),
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.435;
    scene.add(ringMesh);

    // Instantiate Smart Bio-Trap 3D Concept Model
    const machineModel = new SmartBioTrapMachineModel();
    modelRef.current = machineModel;
    scene.add(machineModel.rootGroup);

    setIsLoading3D(false);

    // Raycasting setup for click-to-zoom inside
    const raycaster = new THREE.Raycaster();
    const pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos.x = e.clientX;
      pointerDownPos.y = e.clientY;
      cameraCtrl.onPointerDown(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      cameraCtrl.onPointerMove(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: PointerEvent) => {
      cameraCtrl.onPointerUp();
      const moveDist = Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y
      );
      // Only trigger raycast selection if user clicked without dragging
      if (moveDist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          machineModel.rootGroup.children,
          true
        );
        const hit = intersects.find(
          (i) => i.object.visible && i.object.userData?.partId
        );
        if (hit && hit.object.userData?.partId) {
          onSelectPart(hit.object.userData.partId);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow zoom only when cursor is inside canvas and prevent page jump if needed
      e.preventDefault();
      cameraCtrl.onWheel(e.deltaY);
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglSupported(false);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domElem.addEventListener('wheel', handleWheel, { passive: false });
    domElem.addEventListener('webglcontextlost', handleContextLost);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animFrameId: number;
    const clock = new THREE.Clock();
    let frameCounter = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      cameraCtrl.update(dt, st.reducedMotion);
      machineModel.update(
        dt,
        elapsed,
        st.activeFlowSegment,
        st.showWaterFlow,
        st.reducedMotion
      );

      renderer.render(scene, camera);

      // Project 3D anchors to 2D screen pins every 2 frames for smooth performance
      frameCounter++;
      if (st.showLabels && frameCounter % 2 === 0 && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const nextPins: ProjectedPin[] = MACHINE_COMPONENTS.map((meta) => {
          const grp = machineModel.partGroups.get(meta.id);
          const isGroupVisible = grp ? grp.visible : true;
          const worldPos = machineModel.getPartWorldAnchor(meta);
          const projected = worldPos.clone().project(camera);
          const x = (projected.x * 0.5 + 0.5) * w;
          const y = (-(projected.y * 0.5) + 0.5) * h;
          const inFrustum =
            isGroupVisible &&
            projected.z < 1 &&
            x > 24 &&
            x < w - 24 &&
            y > 24 &&
            y < h - 24;

          return {
            id: meta.id,
            x,
            y,
            visible: inFrustum,
            meta,
          };
        });
        setPins(nextPins);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      domElem.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domElem.removeEventListener('wheel', handleWheel);
      domElem.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('resize', handleResize);
      machineModel.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [use2DFallback]);

  const handleSelectFrom2D = useCallback(
    (partId: string) => {
      onSelectPart(partId);
    },
    [onSelectPart]
  );

  const show2DView = use2DFallback || !webglSupported;

  return (
    <div className="relative w-full rounded-2xl border border-[#174D35]/15 bg-[#F3F5EE] overflow-hidden shadow-xs">
      {/* Top Status & Breadcrumb HUD Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white/90 backdrop-blur-xs border-b border-[#174D35]/10 text-xs">
        <div className="flex items-center gap-1.5 text-[#112218] font-medium overflow-x-auto">
          <button
            type="button"
            onClick={onResetOverview}
            className="text-[#174D35] hover:underline font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            Thiết bị hoàn chỉnh
          </button>
          {selectedMeta && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-700 font-semibold whitespace-nowrap shrink-0">
                {selectedMeta.breadcrumb.replace('Thiết bị → ', '')}
              </span>
            </>
          )}
          {!selectedMeta && isExploded && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#174D35] font-semibold whitespace-nowrap shrink-0">
                Chế độ Tách cấu trúc (Exploded View)
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <span className="hidden sm:inline">
            Mô hình 3D trực quan hóa khái niệm (Concept Visualization)
          </span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <button
            type="button"
            onClick={() => setShowGlbGuideModal(true)}
            className="inline-flex items-center gap-1 text-[#174D35] font-semibold hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Hướng dẫn gắn file GLB/GLTF
          </button>
        </div>
      </div>

      {/* Main Viewport Stage + Side Inspector Split */}
      <div
        className={`grid grid-cols-1 ${
          compactMode ? 'lg:grid-cols-1' : 'lg:grid-cols-12'
        }`}
      >
        {/* 3D Canvas or 2D Schematic Fallback */}
        <div
          className={`relative ${
            compactMode ? 'h-[440px]' : 'h-[520px] lg:h-[600px] lg:col-span-8'
          } select-none`}
        >
          {isLoading3D && !show2DView && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F3F5EE] text-[#174D35]">
              <div className="w-8 h-8 border-2 border-[#174D35] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium">
                Đang khởi tạo mô hình 3D SMART BIO-TRAP...
              </p>
            </div>
          )}

          {!show2DView ? (
            <>
              <div
                ref={mountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                aria-label="Không gian tương tác 3D hệ thống lọc nước SMART BIO-TRAP"
              />
              <ComponentLabels
                pins={pins}
                selectedPartId={selectedPartId}
                showLabels={showLabels}
                isExploded={isExploded}
                onSelectPart={(id) => onSelectPart(id)}
              />
            </>
          ) : (
            /* 2D Interactive Cross-Section Schematic Fallback */
            <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-[#F7F8F2] lab-grid-bg overflow-y-auto">
              <div className="text-center max-w-lg mb-2">
                <p className="text-xs font-mono-tabular uppercase tracking-wider text-[#174D35]">
                  SƠ ĐỒ MẶT CẮT KỸ THUẬT 2D (2D INTERACTIVE SCHEMATIC FALLBACK)
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Nhấn vào từng bộ phận trên sơ đồ để xem thông tin cấu tạo và vai trò trong hệ thống.
                </p>
              </div>

              <svg
                viewBox="0 0 720 420"
                className="w-full max-w-2xl h-auto max-h-[380px] bg-white rounded-xl border border-slate-200 p-3"
                role="img"
                aria-label="Sơ đồ mặt cắt 2D hệ thống lọc nước SMART BIO-TRAP"
              >
                {/* Outer Frame */}
                <rect
                  x="210"
                  y="30"
                  width="260"
                  height="350"
                  rx="12"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="cursor-pointer hover:stroke-[#174D35]"
                  onClick={() => handleSelectFrom2D('outer-housing')}
                />
                {/* Filter Chamber Cylinder */}
                <rect
                  x="250"
                  y="55"
                  width="180"
                  height="290"
                  rx="8"
                  fill="#E6F4F8"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  className="cursor-pointer"
                  onClick={() => handleSelectFrom2D('filter-chamber')}
                />
                {/* Layer 1: Luffa Cellulose */}
                {layerVisibility['cellulose-frame'] && (
                  <g
                    className="cursor-pointer"
                    onClick={() => handleSelectFrom2D('cellulose-frame')}
                  >
                    <rect
                      x="262"
                      y="78"
                      width="156"
                      height="70"
                      rx="6"
                      fill="#DEC092"
                      stroke="#8B5A2B"
                      strokeWidth="2"
                    />
                    <text
                      x="340"
                      y="112"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill="#112218"
                    >
                      Tầng 1: Khung Cellulose
                    </text>
                    <text
                      x="340"
                      y="130"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#475569"
                    >
                      (Xơ mướp Luffa 3D)
                    </text>
                  </g>
                )}
                {/* Layer 2: Hair Keratin */}
                {layerVisibility['keratin-layer'] && (
                  <g
                    className="cursor-pointer"
                    onClick={() => handleSelectFrom2D('keratin-layer')}
                  >
                    <rect
                      x="262"
                      y="160"
                      width="156"
                      height="78"
                      rx="6"
                      fill="#9A6334"
                      stroke="#5A3515"
                      strokeWidth="2"
                    />
                    <text
                      x="340"
                      y="196"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill="#FFFFFF"
                    >
                      Tầng 2: Lớp Keratin
                    </text>
                    <text
                      x="340"
                      y="214"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#FDE68A"
                    >
                      (Tóc thải đã xử lý hoạt hóa)
                    </text>
                  </g>
                )}
                {/* Layer 3: Dual Bio-Composite */}
                {layerVisibility['biocomposite-layer'] && (
                  <g
                    className="cursor-pointer"
                    onClick={() => handleSelectFrom2D('biocomposite-layer')}
                  >
                    <rect
                      x="262"
                      y="250"
                      width="156"
                      height="75"
                      rx="6"
                      fill="#174D35"
                      stroke="#0F3322"
                      strokeWidth="2"
                    />
                    <text
                      x="340"
                      y="286"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill="#FFFFFF"
                    >
                      Tầng 3: Bio-Composite
                    </text>
                    <text
                      x="340"
                      y="304"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#A7F3D0"
                    >
                      (Hệ vật liệu kép liên kết)
                    </text>
                  </g>
                )}

                {/* Piping & Pump Left */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelectFrom2D('pipe-system')}
                >
                  <path
                    d="M 70 330 L 140 330 L 140 40 L 340 40 L 340 55"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="6"
                  />
                  <rect
                    x="95"
                    y="305"
                    width="65"
                    height="45"
                    rx="6"
                    fill="#334155"
                  />
                  <text
                    x="127"
                    y="332"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#FFFFFF"
                  >
                    Bơm cấp
                  </text>
                  {/* Outlet & Recirculation */}
                  <path
                    d="M 340 345 L 340 375 L 510 375"
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="6"
                  />
                  <path
                    d="M 430 375 L 430 398 L 140 398 L 140 350"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="4"
                    strokeDasharray="6 4"
                  />
                  <text
                    x="285"
                    y="412"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#0284C7"
                  >
                    Nhánh ống tuần hoàn (Recirculation Loop)
                  </text>
                </g>

                {/* Sensor Array */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelectFrom2D('sensor-nodes')}
                >
                  <rect
                    x="115"
                    y="155"
                    width="50"
                    height="36"
                    rx="5"
                    fill="#0F766E"
                  />
                  <text
                    x="140"
                    y="177"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#FFFFFF"
                  >
                    Cảm biến
                  </text>
                </g>

                {/* Smart Controller Right */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelectFrom2D('smart-controller')}
                >
                  <rect
                    x="515"
                    y="195"
                    width="155"
                    height="125"
                    rx="10"
                    fill="#174D35"
                  />
                  <rect
                    x="530"
                    y="212"
                    width="125"
                    height="50"
                    rx="4"
                    fill="#0F172A"
                  />
                  <text
                    x="592"
                    y="241"
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="monospace"
                    fill="#38BDF8"
                  >
                    SMART CONTROL
                  </text>
                  <text
                    x="592"
                    y="292"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#FFFFFF"
                  >
                    Bộ điều khiển
                  </text>
                </g>
              </svg>
            </div>
          )}

          {/* Bottom Floating Quick Controls Overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-[#174D35]/15 px-3 py-1.5 rounded-lg text-xs text-slate-600 shadow-xs">
              <span>Chuột trái: Xoay 360°</span>
              <span aria-hidden="true">·</span>
              <span>Con lăn: Phóng to/Thu nhỏ</span>
              <span aria-hidden="true">·</span>
              <span>Nhấn linh kiện: Zoom cận cảnh</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleExploded}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/95 text-[#174D35] border border-[#174D35]/25 hover:bg-[#174D35] hover:text-white transition-colors shadow-xs cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                {isExploded ? 'Thu gọn máy' : 'Tách cấu trúc'}
              </button>
              <button
                type="button"
                onClick={onResetOverview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#174D35] text-white hover:bg-[#113826] transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Góc nhìn tổng quan
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Component Detail & Microstructure Panel (hidden in compactMode) */}
        {!compactMode && (
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#174D35]/15 bg-white p-6 flex flex-col justify-between">
            {selectedMeta ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono-tabular text-[#4D9667] uppercase tracking-wider">
                    CHI TIẾT BỘ PHẬN ĐANG CHỌN
                  </div>
                  <h3 className="text-lg font-bold text-[#112218] mt-1">
                    {selectedMeta.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedMeta.breadcrumb}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5 text-sm">
                  <div>
                    <span className="font-semibold text-[#174D35] block text-xs uppercase tracking-wide">
                      Vai trò trong hệ thống:
                    </span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">
                      {selectedMeta.role}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-[#174D35] block text-xs uppercase tracking-wide">
                      Mô tả kỹ thuật:
                    </span>
                    <p className="text-slate-600 mt-0.5 text-xs leading-relaxed">
                      {selectedMeta.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F8F2] border border-[#174D35]/10 text-xs space-y-1">
                    <div className="font-semibold text-[#112218]">
                      Đặc điểm vật liệu / Cấu hình:
                    </div>
                    <div className="text-slate-600">{selectedMeta.materialSpec}</div>
                  </div>
                </div>

                {/* State D: Microstructure Reference Photo when inspecting a Bio-Material Layer */}
                {matchedBioMaterial && (
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#174D35]">
                        Ảnh tham chiếu vi cấu trúc thực tế
                      </span>
                      <span className="text-slate-400 font-mono-tabular">
                        Tầng lọc #{matchedBioMaterial.layerNumber}
                      </span>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 aspect-4/3">
                      <img
                        src={matchedBioMaterial.imagePath}
                        alt={matchedBioMaterial.imageAlt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      * Lưu ý khoa học: Hình trên là ảnh chụp trực quan mẫu vật liệu sinh học trong phòng thí nghiệm để đối chiếu với khối hình học 3D minh họa bên trái.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono-tabular text-[#174D35] uppercase tracking-wider">
                    CHẾ ĐỘ KHÁM PHÁ CẤU TẠO 3D
                  </div>
                  <h3 className="text-lg font-bold text-[#112218] mt-1">
                    Chọn một bộ phận để phóng to & phân tích
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Nhấn trực tiếp vào mô hình 3D hoặc chọn nhanh từng phân hệ dưới đây để camera tự động di chuyển đến vị trí tương ứng.
                  </p>
                </div>

                <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {MACHINE_COMPONENTS.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => onSelectPart(part.id)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200/80 hover:border-[#174D35] hover:bg-[#F7F8F2] transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#112218] group-hover:text-[#174D35] truncate">
                          {part.shortLabel}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {part.materialSpec}
                        </div>
                      </div>
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#174D35] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <Info className="w-4 h-4 text-[#4D9667] shrink-0 mt-0.5" />
              <span>
                Mô hình 3D đang hiển thị là mô hình concept phân lớp phục vụ thuyết trình nguyên lý; có thể thay thế bằng file CAD/GLTF thực tế của nhóm.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal Guide for Replacing Concept 3D Model with Real GLB/GLTF */}
      {showGlbGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#174D35]">
                Hướng dẫn thay thế mô hình Concept bằng file 3D GLB/GLTF thực tế
              </h4>
              <button
                type="button"
                onClick={() => setShowGlbGuideModal(false)}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                Kiến trúc mã nguồn trong thư mục <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">src/scene/MachineModel.ts</code> và <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">src/data/machineComponents.ts</code> đã định nghĩa sẵn các ID bộ phận ổn định. Để thay bằng bản vẽ CAD thực tế (SolidWorks / Fusion 360 / Blender):
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>
                  Xuất mô hình 3D của nhóm sang định dạng <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.glb</code> và đặt tên các Object/Mesh theo ID trong <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">machineComponents.ts</code>: <code className="font-mono">outer-housing</code>, <code className="font-mono">filter-chamber</code>, <code className="font-mono">cellulose-frame</code>, <code className="font-mono">keratin-layer</code>, <code className="font-mono">biocomposite-layer</code>, <code className="font-mono">pipe-system</code>, <code className="font-mono">sensor-nodes</code>, <code className="font-mono">smart-controller</code>.
                </li>
                <li>
                  Đặt file vào <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">public/models/smart-biotrap.glb</code>.
                </li>
                <li>
                  Sử dụng <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">GLTFLoader</code> từ <code className="font-mono">three/examples/jsm/loaders/GLTFLoader.js</code> để nạp từng node vào <code className="font-mono">this.partGroups</code>. Toàn bộ tính năng Click-to-Zoom, Exploded View và nhãn 3D sẽ tự động hoạt động mà không cần viết lại giao diện.
                </li>
              </ol>
              <div className="p-3 rounded-lg bg-[#F7F8F2] border border-[#174D35]/15 flex items-center gap-2 text-[#174D35]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Tất cả tọa độ <code className="font-mono">basePosition</code> và <code className="font-mono">explodedOffset</code> đều tách biệt trong file dữ liệu để nhóm dễ dàng hiệu chỉnh.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

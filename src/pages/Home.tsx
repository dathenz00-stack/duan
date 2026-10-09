import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { ExplodedViewControls } from '../components/ExplodedViewControls';
import { ProductViewer3D } from '../components/ProductViewer3D';
import { WaterFlowSimulation } from '../components/WaterFlowSimulation';
import { MaterialCards } from '../components/MaterialCards';
import { SmartDashboard } from '../components/SmartDashboard';
import { ResultsSection } from '../components/ResultsSection';
import {
  ComponentGroup,
  MACHINE_COMPONENTS,
} from '../data/machineComponents';
import { WATER_JOURNEY_STEPS } from '../data/processSteps';
import { LayerVisibilityState } from '../scene/MachineModel';

export const Home: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<ComponentGroup>('overview');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [highlightedPartIds, setHighlightedPartIds] = useState<string[] | null>(
    null
  );
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showWaterFlow, setShowWaterFlow] = useState<boolean>(true);
  const [activeFlowSegment, setActiveFlowSegment] = useState<
    | 'all'
    | 'inlet'
    | 'pretreatment'
    | 'bio-core'
    | 'sensors'
    | 'outlet'
    | 'recirculation'
  >('all');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [use2DFallback, setUse2DFallback] = useState<boolean>(false);
  const [cameraPresetOverride, setCameraPresetOverride] = useState<{
    position: [number, number, number];
    target: [number, number, number];
  } | null>(null);

  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>({
    'cellulose-frame': true,
    'keratin-layer': true,
    'biocomposite-layer': true,
  });

  // Respect system prefers-reduced-motion on initial load
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }
  }, []);

  const scrollToExplorer = (initialPartId?: string) => {
    if (initialPartId) {
      handleSelectPart(initialPartId);
    }
    document
      .getElementById('explorer-3d')
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const scrollToWaterJourney = () => {
    document
      .getElementById('water-journey')
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleSelectPart = (partId: string | null) => {
    setCameraPresetOverride(null);
    setHighlightedPartIds(null);
    setSelectedPartId(partId);
    if (!partId) {
      setActiveGroup('overview');
      setActiveFlowSegment('all');
      return;
    }
    const found = MACHINE_COMPONENTS.find((c) => c.id === partId);
    if (found) {
      setActiveGroup(found.group);
    }
  };

  const handleSelectGroup = (group: ComponentGroup, targetPartId: string) => {
    setCameraPresetOverride(null);
    setHighlightedPartIds(null);
    setActiveGroup(group);
    if (group === 'overview') {
      setSelectedPartId(null);
      setActiveFlowSegment('all');
    } else {
      setSelectedPartId(targetPartId);
    }
  };

  const handleResetOverview = () => {
    setCameraPresetOverride(null);
    setHighlightedPartIds(null);
    setSelectedPartId(null);
    setActiveGroup('overview');
    setIsExploded(false);
    setActiveFlowSegment('all');
    setLayerVisibility({
      'cellulose-frame': true,
      'keratin-layer': true,
      'biocomposite-layer': true,
    });
  };

  const handleToggleBioLayer = (layerId: keyof LayerVisibilityState) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  // State D: Zoom directly to the 3 Bio-Filtration Layers inside the chamber
  const handleInspectCoreLayers = () => {
    setIsExploded(false);
    setActiveGroup('bio-filter');
    setSelectedPartId('keratin-layer');
    setHighlightedPartIds([
      'cellulose-frame',
      'keratin-layer',
      'biocomposite-layer',
    ]);
    setCameraPresetOverride({
      position: [1.85, 0.35, 2.05],
      target: [0, 0.2, 0],
    });
  };

  // Sync from Section 6 Water Journey Step to the 3D Viewer
  const handleSyncWaterStepTo3D = (
    stepIndex: number,
    zoomToStage: boolean,
    flowSegment:
      | 'inlet'
      | 'pretreatment'
      | 'bio-core'
      | 'sensors'
      | 'outlet'
      | 'recirculation'
  ) => {
    const step = WATER_JOURNEY_STEPS[stepIndex];
    setIsExploded(false);
    setShowWaterFlow(true);
    setActiveFlowSegment(flowSegment);
    setHighlightedPartIds(step.activePartIds);
    setSelectedPartId(step.activePartIds[0] || null);

    if (zoomToStage) {
      setCameraPresetOverride({
        position: step.cameraPosition,
        target: step.cameraTarget,
      });
    } else {
      setCameraPresetOverride({
        position: [3.8, 2.1, 4.4],
        target: [0, 0.1, 0],
      });
    }
  };

  // Jump from Material Card to 3D Layer Inspection
  const handleInspectMaterialLayerIn3D = (partId: string) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [partId as keyof LayerVisibilityState]: true,
    }));
    handleSelectPart(partId);
    document
      .getElementById('explorer-3d')
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F2] text-[#112218]">
      {/* Fixed/Sticky Top Bar following strict 3-zone contract */}
      <Navbar onExploreStructure={() => scrollToExplorer()} />

      <main className="flex-1">
        {/* SECTION 4: HERO SECTION */}
        <HeroSection
          reducedMotion={reducedMotion}
          onExploreStructure={(partId) => scrollToExplorer(partId)}
          onStartWaterJourney={scrollToWaterJourney}
        />

        {/* SECTION 5: CLICK TO ZOOM INSIDE — INTERACTIVE 3D EXPLORER */}
        <section
          id="explorer-3d"
          className="py-12 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-5"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono-tabular font-semibold text-[#174D35] uppercase tracking-wider">
                KHÁM PHÁ CẤU TRÚC 3D · CLICK TO ZOOM INSIDE & EXPLODED VIEW
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#112218]">
                Cấu Tạo Bên Trong Hệ Thống SMART BIO-TRAP
              </h2>
              <p className="text-sm text-slate-600 max-w-3xl">
                Chuyển đổi linh hoạt giữa 4 trạng thái: (A) Tổng quan máy hoàn chỉnh · (B) Nhấn vào bộ phận để Zoom cận cảnh · (C) Tách cấu trúc (Exploded View) · (D) Bật/tắt và soi từng lớp vật liệu lọc sinh học.
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Trạng thái hiện tại:{' '}
              <strong className="text-[#174D35]">
                {isExploded
                  ? 'Trạng thái C — Tách cấu trúc (Exploded View)'
                  : selectedPartId
                  ? 'Trạng thái B/D — Cận cảnh bộ phận & Lớp vật liệu'
                  : 'Trạng thái A — Máy hoàn chỉnh (3/4 View)'}
              </strong>
            </div>
          </div>

          <ExplodedViewControls
            activeGroup={activeGroup}
            isExploded={isExploded}
            showLabels={showLabels}
            showWaterFlow={showWaterFlow}
            reducedMotion={reducedMotion}
            use2DFallback={use2DFallback}
            layerVisibility={layerVisibility}
            onSelectGroup={handleSelectGroup}
            onToggleExploded={() => setIsExploded((prev) => !prev)}
            onResetCamera={handleResetOverview}
            onToggleLabels={() => setShowLabels((prev) => !prev)}
            onToggleWaterFlow={() => setShowWaterFlow((prev) => !prev)}
            onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
            onToggle2DFallback={() => setUse2DFallback((prev) => !prev)}
            onToggleBioLayer={handleToggleBioLayer}
            onInspectCoreLayers={handleInspectCoreLayers}
          />

          <ProductViewer3D
            selectedPartId={selectedPartId}
            highlightedPartIds={highlightedPartIds}
            isExploded={isExploded}
            showLabels={showLabels}
            showWaterFlow={showWaterFlow}
            activeFlowSegment={activeFlowSegment}
            reducedMotion={reducedMotion}
            use2DFallback={use2DFallback}
            layerVisibility={layerVisibility}
            cameraPresetOverride={cameraPresetOverride}
            onSelectPart={handleSelectPart}
            onResetOverview={handleResetOverview}
            onToggleExploded={() => setIsExploded((prev) => !prev)}
          />
        </section>

        {/* SECTION 6: THE JOURNEY OF WATER — OPERATING PRINCIPLE SIMULATION */}
        <WaterFlowSimulation onSyncTo3DViewer={handleSyncWaterStepTo3D} />

        {/* SECTION 8: BIO-MATERIALS SHOWCASE CARDS */}
        <MaterialCards onInspectLayerIn3D={handleInspectMaterialLayerIn3D} />

        {/* SECTION 7: SMART CONTROL DASHBOARD */}
        <SmartDashboard />

        {/* SECTION 9 & 10: PROBLEM/SOLUTION & EXPERIMENTAL RESULTS */}
        <ResultsSection />
      </main>

      {/* Quiet Scientific Footer */}
      <footer className="border-t border-[#174D35]/15 bg-white py-8 px-6 lg:px-12 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <strong className="text-[#174D35]">SMART BIO-TRAP</strong> — Hệ thống lọc nước thông minh sử dụng vật liệu sinh học tuần hoàn (Mô hình trực quan hóa 3D phục vụ thuyết trình Khoa học Kỹ thuật).
          </div>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-[#174D35] transition-colors">
              Đầu trang
            </a>
            <a
              href="#explorer-3d"
              className="hover:text-[#174D35] transition-colors"
            >
              Mô hình 3D
            </a>
            <a
              href="#water-journey"
              className="hover:text-[#174D35] transition-colors"
            >
              Nguyên lý
            </a>
            <a
              href="#experimental-results"
              className="hover:text-[#174D35] transition-colors"
            >
              Số liệu thực nghiệm
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

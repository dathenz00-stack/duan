import React from 'react';
import { GROUP_LABELS, ComponentGroup } from '../data/machineComponents';
import { LayerVisibilityState } from '../scene/MachineModel';
import { RotateCcw, Layers, Eye, EyeOff, Box, Sparkles } from 'lucide-react';

interface ExplodedViewControlsProps {
  activeGroup: ComponentGroup;
  isExploded: boolean;
  showLabels: boolean;
  showWaterFlow: boolean;
  reducedMotion: boolean;
  use2DFallback: boolean;
  layerVisibility: LayerVisibilityState;
  onSelectGroup: (group: ComponentGroup, targetPartId: string) => void;
  onToggleExploded: () => void;
  onResetCamera: () => void;
  onToggleLabels: () => void;
  onToggleWaterFlow: () => void;
  onToggleReducedMotion: () => void;
  onToggle2DFallback: () => void;
  onToggleBioLayer: (layerId: keyof LayerVisibilityState) => void;
  onInspectCoreLayers: () => void;
}

export const ExplodedViewControls: React.FC<ExplodedViewControlsProps> = ({
  activeGroup,
  isExploded,
  showLabels,
  showWaterFlow,
  reducedMotion,
  use2DFallback,
  layerVisibility,
  onSelectGroup,
  onToggleExploded,
  onResetCamera,
  onToggleLabels,
  onToggleWaterFlow,
  onToggleReducedMotion,
  onToggle2DFallback,
  onToggleBioLayer,
  onInspectCoreLayers,
}) => {
  return (
    <div className="flex flex-col gap-3 bg-white border border-[#174D35]/15 rounded-xl p-4">
      {/* Row 1: State A Quick Group Filters + Exploded View + Reset Camera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F7F8F2] p-1 rounded-lg border border-[#174D35]/10">
          {GROUP_LABELS.map((item) => {
            const active = activeGroup === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectGroup(item.id, item.targetPartId)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#174D35] text-white shadow-xs'
                    : 'text-[#112218]/75 hover:text-[#174D35] hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleExploded}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isExploded
                ? 'bg-[#174D35] text-white border-[#174D35]'
                : 'bg-white text-[#174D35] border-[#174D35]/30 hover:bg-[#F7F8F2]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isExploded ? 'Đóng Tách Cấu Trúc' : 'Tách Cấu Trúc (Exploded View)'}
          </button>

          <button
            type="button"
            onClick={onInspectCoreLayers}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#4D9667]/40 bg-[#F7F8F2] text-[#174D35] hover:bg-[#4D9667]/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            Soi 3 Tầng Vật Liệu Lọc
          </button>

          <button
            type="button"
            onClick={onResetCamera}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Camera
          </button>
        </div>
      </div>

      {/* Row 2: State D Bio-Material Layer Toggles & Viewport Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-200/70 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-500 mr-1">
            Bật/Tắt từng lớp lõi lọc (Trạng thái D):
          </span>
          <button
            type="button"
            onClick={() => onToggleBioLayer('cellulose-frame')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              layerVisibility['cellulose-frame']
                ? 'bg-[#C89D66]/15 border-[#C89D66] text-[#5C3D18] font-medium'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {layerVisibility['cellulose-frame'] ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            1. Khung Cellulose (Xơ mướp)
          </button>

          <button
            type="button"
            onClick={() => onToggleBioLayer('keratin-layer')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              layerVisibility['keratin-layer']
                ? 'bg-[#8B5A2B]/15 border-[#8B5A2B] text-[#5A3515] font-medium'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {layerVisibility['keratin-layer'] ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            2. Lớp Keratin (Từ tóc)
          </button>

          <button
            type="button"
            onClick={() => onToggleBioLayer('biocomposite-layer')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              layerVisibility['biocomposite-layer']
                ? 'bg-[#174D35]/15 border-[#174D35] text-[#174D35] font-medium'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {layerVisibility['biocomposite-layer'] ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            3. Vật liệu kép Bio-Composite
          </button>
        </div>

        {/* Viewport Preferences: Labels, Water Flow, Reduced Motion, 2D Fallback */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleLabels}
            className={`px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showLabels
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showLabels ? 'Ẩn Nhãn 3D' : 'Hiện Nhãn 3D'}
          </button>

          <button
            type="button"
            onClick={onToggleWaterFlow}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showWaterFlow
                ? 'bg-[#45A9C7] text-white border-[#45A9C7]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {showWaterFlow ? 'Dòng nước: BẬT' : 'Dòng nước: TẮT'}
          </button>

          <button
            type="button"
            onClick={onToggleReducedMotion}
            className={`px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              reducedMotion
                ? 'bg-amber-700 text-white border-amber-700'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {reducedMotion ? 'Chuyển động: TẮT' : 'Giảm hiệu ứng động'}
          </button>

          <button
            type="button"
            onClick={onToggle2DFallback}
            className={`px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              use2DFallback
                ? 'bg-[#174D35] text-white border-[#174D35]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {use2DFallback ? 'Chế độ: Sơ đồ 2D' : 'Chuyển sang Sơ đồ 2D'}
          </button>
        </div>
      </div>
    </div>
  );
};

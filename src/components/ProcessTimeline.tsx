import React from 'react';
import { WATER_JOURNEY_STEPS, ProcessStepData } from '../data/processSteps';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Eye,
} from 'lucide-react';

interface ProcessTimelineProps {
  currentStepIndex: number;
  isPlaying: boolean;
  zoomToStage: boolean;
  onSelectStep: (index: number) => void;
  onTogglePlay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onToggleZoomMode: () => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  currentStepIndex,
  isPlaying,
  zoomToStage,
  onSelectStep,
  onTogglePlay,
  onPrevStep,
  onNextStep,
  onToggleZoomMode,
}) => {
  const activeStep: ProcessStepData = WATER_JOURNEY_STEPS[currentStepIndex];
  const progressPercent =
    ((currentStepIndex + 1) / WATER_JOURNEY_STEPS.length) * 100;

  return (
    <div className="bg-white border border-[#174D35]/15 rounded-2xl p-6 space-y-5">
      {/* Top Playback Controls & View Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStep}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Bước trước (Previous Step)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#174D35] text-white hover:bg-[#113826] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Tạm dừng (Pause)
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Chạy tự động (Play)
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNextStep}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Bước tiếp theo (Next Step)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle between Whole System View vs Stage Zoom View */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleZoomMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              zoomToStage
                ? 'bg-[#45A9C7] text-white border-[#45A9C7]'
                : 'bg-[#F7F8F2] text-[#174D35] border-[#174D35]/20 hover:bg-[#174D35]/10'
            }`}
          >
            {zoomToStage ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                Đang Zoom vào giai đoạn · Chuyển sang Xem toàn hệ thống
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Đang Xem toàn hệ thống · Chuyển sang Zoom từng giai đoạn
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500">
          <span>TIẾN TRÌNH MÔ PHỎNG DÒNG NƯỚC</span>
          <span>
            GIAI ĐOẠN {activeStep.stepNumber} / {WATER_JOURNEY_STEPS.length} (
            {Math.round(progressPercent)}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#45A9C7] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 6 Step Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {WATER_JOURNEY_STEPS.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#174D35] text-white border-[#174D35] shadow-xs'
                  : isCompleted
                  ? 'bg-[#F7F8F2] text-[#112218] border-[#4D9667]/40 hover:border-[#174D35]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-mono-tabular opacity-80">
                BƯỚC 0{step.stepNumber}
              </div>
              <div className="text-xs font-semibold mt-0.5 line-clamp-1">
                {step.title.split('—')[1]?.trim() || step.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Scientific Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-3 border-t border-slate-100">
        <div className="lg:col-span-7 space-y-2">
          <div className="text-xs font-mono-tabular text-[#45A9C7] font-semibold uppercase">
            {activeStep.subtitle}
          </div>
          <h3 className="text-lg font-bold text-[#112218]">
            {activeStep.title}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {activeStep.summary}
          </p>
        </div>

        <div className="lg:col-span-5 bg-[#F7F8F2] rounded-xl p-4 border border-[#174D35]/10 space-y-2 text-xs">
          <div className="font-semibold text-[#174D35] uppercase tracking-wide">
            Cơ chế kỹ thuật & Ghi chú kiểm chứng:
          </div>
          <p className="text-slate-700 leading-relaxed">
            {activeStep.scientificExplanation}
          </p>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
            Lưu ý: {activeStep.verificationNote}
          </p>
        </div>
      </div>
    </div>
  );
};

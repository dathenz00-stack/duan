import React, { useState, useEffect } from 'react';
import { WATER_JOURNEY_STEPS } from '../data/processSteps';
import { ProcessTimeline } from './ProcessTimeline';
import { Droplets, ArrowRight, RotateCw } from 'lucide-react';

interface WaterFlowSimulationProps {
  onSyncTo3DViewer: (
    stepIndex: number,
    zoomToStage: boolean,
    flowSegment:
      | 'inlet'
      | 'pretreatment'
      | 'bio-core'
      | 'sensors'
      | 'outlet'
      | 'recirculation'
  ) => void;
}

export const WaterFlowSimulation: React.FC<WaterFlowSimulationProps> = ({
  onSyncTo3DViewer,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomToStage, setZoomToStage] = useState<boolean>(true);

  const activeStep = WATER_JOURNEY_STEPS[currentStepIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = (prev + 1) % WATER_JOURNEY_STEPS.length;
        return next;
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const triggerStepChange = (nextIdx: number, nextZoom = zoomToStage) => {
    setCurrentStepIndex(nextIdx);
    const step = WATER_JOURNEY_STEPS[nextIdx];
    onSyncTo3DViewer(nextIdx, nextZoom, step.flowSegment);
  };

  return (
    <section
      id="water-journey"
      className="py-14 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#45A9C7] font-semibold">
            <Droplets className="w-4 h-4" />
            <span>CHẾ ĐỘ MÔ PHỎNG NGUYÊN LÝ HOẠT ĐỘNG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112218]">
            THE JOURNEY OF WATER — HÀNH TRÌNH CỦA MỘT GIỌT NƯỚC
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Theo dõi đường đi của dòng nước qua 6 công đoạn xử lý khép kín: từ bơm cấp đầu vào, phân phối dòng qua khung cellulose xơ mướp, tương tác với lớp keratin & bio-composite đến cụm cảm biến giám sát và nhánh hồi lưu tuần hoàn.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white px-3.5 py-2 rounded-lg border border-slate-200 max-w-sm">
          * Lưu ý khoa học: Mô phỏng thể hiện nguyên lý thủy lực và thứ tự các tầng lọc theo thiết kế của nhóm; không tự khẳng định nước đầu ra đạt chuẩn uống trực tiếp khi chưa có biên bản kiểm nghiệm tương ứng.
        </div>
      </div>

      {/* Interactive Animated 2D Cross-Section Flow Diagram Synchronized with Step */}
      <div className="bg-[#0F2419] text-white rounded-2xl p-6 border border-[#174D35]/30 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive SVG Flow Path */}
          <div className="lg:col-span-8 bg-[#132D20] rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-2 font-mono-tabular">
              <span>SƠ ĐỒ DÒNG CHẢY TRỰC QUAN · GIAI ĐOẠN 0{activeStep.stepNumber}</span>
              <span>CHẾ ĐỘ: {activeStep.flowSegment.toUpperCase()}</span>
            </div>

            <svg
              viewBox="0 0 800 300"
              className="w-full h-auto"
              role="img"
              aria-label="Sơ đồ mô phỏng hành trình dòng nước qua 6 bước"
            >
              {/* Step 1: Inlet Pipe */}
              <g
                onClick={() => triggerStepChange(0)}
                className="cursor-pointer"
                opacity={currentStepIndex === 0 ? 1 : 0.45}
              >
                <rect x="30" y="185" width="90" height="55" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="75" y="210" textAnchor="middle" fontSize="11" fill="#FFFFFF" fontWeight="600">
                  1. Nước đầu vào
                </text>
                <text x="75" y="226" textAnchor="middle" fontSize="9" fill="#94A3B8">
                  Bơm điều tốc
                </text>
                <path
                  d="M 120 210 L 185 210 L 185 45 L 360 45 L 360 65"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="6"
                  strokeDasharray={currentStepIndex === 0 ? '10 6' : 'none'}
                />
              </g>

              {/* Central Filter Column */}
              <rect
                x="280"
                y="65"
                width="160"
                height="185"
                rx="10"
                fill="#173828"
                stroke="#94A3B8"
                strokeWidth="2.5"
              />

              {/* Step 2: Pre-treatment Luffa Cellulose */}
              <g
                onClick={() => triggerStepChange(1)}
                className="cursor-pointer"
                opacity={currentStepIndex === 1 || currentStepIndex === 2 ? 1 : 0.55}
              >
                <rect
                  x="292"
                  y="78"
                  width="136"
                  height="46"
                  rx="6"
                  fill="#C89D66"
                  stroke={currentStepIndex === 1 ? '#38BDF8' : 'none'}
                  strokeWidth="3"
                />
                <text x="360" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#112218">
                  2. Tầng Cellulose
                </text>
                <text x="360" y="115" textAnchor="middle" fontSize="9" fill="#1E293B">
                  Phân phối dòng & lọc thô
                </text>
              </g>

              {/* Step 3: Keratin + Bio-Composite */}
              <g
                onClick={() => triggerStepChange(2)}
                className="cursor-pointer"
                opacity={currentStepIndex === 2 ? 1 : 0.55}
              >
                <rect
                  x="292"
                  y="132"
                  width="136"
                  height="50"
                  rx="6"
                  fill="#8B5A2B"
                  stroke={currentStepIndex === 2 ? '#38BDF8' : 'none'}
                  strokeWidth="3"
                />
                <text x="360" y="155" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
                  3A. Lớp Keratin từ tóc
                </text>
                <text x="360" y="170" textAnchor="middle" fontSize="9" fill="#FDE68A">
                  Tương tác nhóm chức bề mặt
                </text>

                <rect
                  x="292"
                  y="190"
                  width="136"
                  height="48"
                  rx="6"
                  fill="#275E43"
                  stroke={currentStepIndex === 2 ? '#38BDF8' : '#4D9667'}
                  strokeWidth="2.5"
                />
                <text x="360" y="212" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
                  3B. Lõi Bio-Composite
                </text>
                <text x="360" y="226" textAnchor="middle" fontSize="9" fill="#A7F3D0">
                  Cố định hai pha bền thủy lực
                </text>
              </g>

              {/* Step 4: Smart Sensors & Controller */}
              <g
                onClick={() => triggerStepChange(3)}
                className="cursor-pointer"
                opacity={currentStepIndex === 3 ? 1 : 0.5}
              >
                <path d="M 360 250 L 360 272 L 520 272" fill="none" stroke="#22D3EE" strokeWidth="6" />
                <rect x="470" y="170" width="120" height="68" rx="8" fill="#0F766E" stroke="#22D3EE" strokeWidth="2" />
                <text x="530" y="198" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
                  4. Giám sát cảm biến
                </text>
                <text x="530" y="216" textAnchor="middle" fontSize="9" fill="#CCFBF1">
                  Đo lưu lượng & trạng thái
                </text>
                <line x1="530" y1="238" x2="530" y2="272" stroke="#22D3EE" strokeWidth="3" strokeDasharray="4 3" />
              </g>

              {/* Step 5: Treated Water Outlet */}
              <g
                onClick={() => triggerStepChange(4)}
                className="cursor-pointer"
                opacity={currentStepIndex === 4 ? 1 : 0.5}
              >
                <path d="M 520 272 L 660 272" fill="none" stroke="#22D3EE" strokeWidth="6" />
                <rect x="650" y="210" width="115" height="72" rx="8" fill="#0284C7" stroke="#E0F2FE" strokeWidth="2" />
                <text x="707" y="242" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
                  5. Nước đầu ra
                </text>
                <text x="707" y="258" textAnchor="middle" fontSize="9" fill="#E0F2FE">
                  Thu mẫu sau xử lý
                </text>
              </g>

              {/* Step 6: Recirculation Loop */}
              <g
                onClick={() => triggerStepChange(5)}
                className="cursor-pointer"
                opacity={currentStepIndex === 5 ? 1 : 0.45}
              >
                <path
                  d="M 560 272 L 560 292 L 185 292 L 185 215"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="4"
                  strokeDasharray="8 5"
                />
                <rect x="275" y="276" width="175" height="22" rx="4" fill="#0369A1" />
                <text x="362" y="291" textAnchor="middle" fontSize="10" fontWeight="600" fill="#E0F2FE">
                  6. Đường hồi lưu tuần hoàn (Recirculation)
                </text>
              </g>
            </svg>
          </div>

          {/* Right Summary & Sync to 3D Camera CTA */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono-tabular text-[#38BDF8]">
              <RotateCw className="w-3.5 h-3.5" />
              <span>ĐỒNG BỘ VỚI MÔ HÌNH 3D PHÍA TRÊN</span>
            </div>

            <h3 className="text-xl font-bold text-white">
              {activeStep.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeStep.summary}
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
              <div className="text-emerald-300 font-semibold">
                Bộ phận hoạt động trong bước này:
              </div>
              <div className="text-slate-200 font-mono-tabular">
                {activeStep.activePartIds.join(' · ')}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSyncTo3DViewer(currentStepIndex, true, activeStep.flowSegment);
                document
                  .getElementById('explorer-3d')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#45A9C7] text-slate-950 hover:bg-[#38BDF8] transition-colors cursor-pointer"
            >
              <span>Quan sát bước này trên Mô hình 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Step Controller Timeline */}
      <ProcessTimeline
        currentStepIndex={currentStepIndex}
        isPlaying={isPlaying}
        zoomToStage={zoomToStage}
        onSelectStep={(idx) => triggerStepChange(idx)}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPrevStep={() =>
          triggerStepChange(
            (currentStepIndex - 1 + WATER_JOURNEY_STEPS.length) %
              WATER_JOURNEY_STEPS.length
          )
        }
        onNextStep={() =>
          triggerStepChange((currentStepIndex + 1) % WATER_JOURNEY_STEPS.length)
        }
        onToggleZoomMode={() => {
          const nextZoom = !zoomToStage;
          setZoomToStage(nextZoom);
          onSyncTo3DViewer(
            currentStepIndex,
            nextZoom,
            WATER_JOURNEY_STEPS[currentStepIndex].flowSegment
          );
        }}
      />
    </section>
  );
};

import React, { useState } from 'react';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export const SmartDashboard: React.FC = () => {
  // Interactive simulation inputs so judges/users can test the control logic
  const [simulatedInletFlow, setSimulatedInletFlow] = useState<number>(1.2); // L/min
  const [simulatedCoreResistance, setSimulatedCoreResistance] = useState<number>(18); // % pressure drop / saturation simulation
  const [simulatedTurbiditySignal, setSimulatedTurbiditySignal] = useState<number>(12); // relative sensor index (arbitrary simulation units)
  const [thresholdLimit, setThresholdLimit] = useState<number>(25);

  // Derived states based on simulated control algorithm
  const simulatedOutletFlow = Number(
    (simulatedInletFlow * (1 - simulatedCoreResistance / 100)).toFixed(2)
  );
  const isThresholdExceeded = simulatedTurbiditySignal > thresholdLimit;
  const isCoreSaturated = simulatedCoreResistance >= 55;

  const operatingMode = isCoreSaturated
    ? 'CẢNH BÁO BẢO TRÌ: CẦN THAY / HOÀN NGUYÊN LÕI LỌC'
    : isThresholdExceeded
    ? 'CHẾ ĐỘ TUẦN HOÀN TỰ ĐỘNG (RECIRCULATION LOOP)'
    : 'LỌC MỘT CHIỀU ỔN ĐỊNH (SINGLE-PASS NORMAL)';

  const resetDemoParameters = () => {
    setSimulatedInletFlow(1.2);
    setSimulatedCoreResistance(18);
    setSimulatedTurbiditySignal(12);
    setThresholdLimit(25);
  };

  return (
    <section
      id="smart-dashboard"
      className="py-14 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-6"
    >
      {/* Header with explicit DEMO SIMULATION disclosure */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#174D35] font-semibold">
            <Cpu className="w-4 h-4" />
            <span>SMART CONTROL DASHBOARD · DEMO SIMULATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112218]">
            Hệ thống Cảm biến & Điều khiển Chu trình Thông minh
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Bảng mô phỏng nguyên lý hoạt động của bộ điều khiển trung tâm: thu thập tín hiệu từ cụm cảm biến đầu vào/đầu ra, điều khiển bơm định lượng, đóng mở van điện từ nhánh tuần hoàn và cảnh báo khi lõi lọc sinh học cần thay thế.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium max-w-md">
          <span className="font-mono-tabular font-bold block">
            CHẾ ĐỘ: DEMO SIMULATION (CHƯA KẾT NỐI PHẦN CỨNG)
          </span>
          Các con số dưới đây là biến đầu vào giả lập để kiểm thử thuật toán điều khiển van/bơm, không phải số liệu đo thực tế từ cảm biến.
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameter Scrubbers to test Control Logic */}
        <div className="lg:col-span-5 bg-white border border-[#174D35]/15 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#112218]">
                <Sliders className="w-4 h-4 text-[#174D35]" />
                <span>Bảng Giả Lập Tín Hiệu Đầu Vào</span>
              </div>
              <button
                type="button"
                onClick={resetDemoParameters}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#174D35] hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Đặt lại mặc định
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Kéo các thanh trượt dưới đây để thử nghiệm cách vi điều khiển phản ứng khi tín hiệu cảm biến vượt ngưỡng cấu hình hoặc khi lõi lọc bị nghẽn:
            </p>

            {/* Slider 1: Inlet Pump Flow */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sim-inlet-flow" className="font-medium text-slate-700">
                  1. Lưu lượng bơm cấp đầu vào (Giả lập)
                </label>
                <span className="font-mono-tabular font-semibold text-[#174D35]">
                  {simulatedInletFlow.toFixed(2)} L/min
                </span>
              </div>
              <input
                id="sim-inlet-flow"
                type="range"
                min={0.4}
                max={2.5}
                step={0.1}
                value={simulatedInletFlow}
                onChange={(e) => setSimulatedInletFlow(parseFloat(e.target.value))}
                className="w-full accent-[#174D35] cursor-pointer"
              />
            </div>

            {/* Slider 2: Core Saturation / Hydraulic Resistance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sim-core-sat" className="font-medium text-slate-700">
                  2. Độ suy giảm lưu lượng qua lõi (Bão hòa cơ học)
                </label>
                <span className="font-mono-tabular font-semibold text-[#8B5A2B]">
                  {simulatedCoreResistance}% (Ngưỡng cảnh báo: 55%)
                </span>
              </div>
              <input
                id="sim-core-sat"
                type="range"
                min={5}
                max={85}
                step={5}
                value={simulatedCoreResistance}
                onChange={(e) => setSimulatedCoreResistance(parseInt(e.target.value, 10))}
                className="w-full accent-[#8B5A2B] cursor-pointer"
              />
            </div>

            {/* Slider 3: Downstream Sensor Signal vs Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sim-sensor-sig" className="font-medium text-slate-700">
                  3. Tín hiệu cảm biến hạ lưu (Đơn vị mô phỏng)
                </label>
                <span className="font-mono-tabular font-semibold text-[#0284C7]">
                  {simulatedTurbiditySignal} / Ngưỡng cài đặt: {thresholdLimit}
                </span>
              </div>
              <input
                id="sim-sensor-sig"
                type="range"
                min={5}
                max={60}
                step={1}
                value={simulatedTurbiditySignal}
                onChange={(e) =>
                  setSimulatedTurbiditySignal(parseInt(e.target.value, 10))
                }
                className="w-full accent-[#0284C7] cursor-pointer"
              />
            </div>

            {/* Quick Scenario Preset Buttons */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">
                Kích hoạt nhanh kịch bản mô phỏng:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={resetDemoParameters}
                  className="px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:border-[#174D35] text-slate-700 cursor-pointer"
                >
                  Vận hành bình thường
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedTurbiditySignal(38);
                    setSimulatedCoreResistance(25);
                  }}
                  className="px-2.5 py-2 rounded-lg text-xs font-medium border border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 cursor-pointer"
                >
                  Kích hoạt Tuần hoàn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedCoreResistance(65);
                    setSimulatedTurbiditySignal(42);
                  }}
                  className="px-2.5 py-2 rounded-lg text-xs font-medium border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer"
                >
                  Cảnh báo Nghẽn lõi
                </button>
              </div>
            </div>
          </div>

          {/* Alert Status Box */}
          <div
            className={`p-4 rounded-xl border text-xs space-y-1 ${
              isCoreSaturated
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : isThresholdExceeded
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-[#F7F8F2] border-[#174D35]/20 text-[#112218]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isCoreSaturated || isThresholdExceeded ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#174D35] shrink-0" />
              )}
              <span>TRẠNG THÁI HỆ THỐNG: {operatingMode}</span>
            </div>
            <p className="opacity-90 leading-relaxed">
              {isCoreSaturated
                ? 'Lưu lượng đầu ra giảm mạnh do lõi lọc đạt giới hạn bão hòa cơ học. Hệ thống ngắt van xả và phát tín hiệu yêu cầu thay/hoàn nguyên lõi Bio-Composite.'
                : isThresholdExceeded
                ? 'Tín hiệu cảm biến sau lọc vượt ngưỡng cài đặt. Vi điều khiển tự động đóng van đầu ra và mở van nhánh tuần hoàn để lọc lặp lại (Multi-pass).'
                : 'Tất cả thông số giả lập nằm trong dải thiết kế. Van điện từ mở hướng đầu ra thu nước sau xử lý.'}
            </p>
          </div>
        </div>

        {/* Right Column: Simulated Readouts, Pump/Valve Actuators & Control Block Diagram */}
        <div className="lg:col-span-7 bg-white border border-[#174D35]/15 rounded-2xl p-6 space-y-6">
          {/* Simulated Telemetry Readout Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F7F8F2] border border-slate-200/80">
              <div className="text-[11px] font-mono-tabular uppercase text-slate-500">
                LƯU LƯỢNG ĐẦU VÀO (GIẢ LẬP)
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-bold font-mono-tabular text-[#112218]">
                  {simulatedInletFlow.toFixed(2)}
                </span>
                <span className="text-xs font-mono-tabular text-slate-500 ml-1.5">
                  L/min
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Cảm biến lưu lượng S1 (Thượng lưu)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8F2] border border-slate-200/80">
              <div className="text-[11px] font-mono-tabular uppercase text-slate-500">
                LƯU LƯỢNG ĐẦU RA (GIẢ LẬP)
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-bold font-mono-tabular text-[#174D35]">
                  {simulatedOutletFlow.toFixed(2)}
                </span>
                <span className="text-xs font-mono-tabular text-slate-500 ml-1.5">
                  L/min
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Cảm biến lưu lượng S2 (Hạ lưu)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8F2] border border-slate-200/80">
              <div className="text-[11px] font-mono-tabular uppercase text-slate-500">
                TRẠNG THÁI VAN & BƠM
              </div>
              <div className="mt-1 text-sm font-bold font-mono-tabular text-[#112218]">
                {isCoreSaturated
                  ? 'BƠM: DỪNG BẢO TRÌ'
                  : isThresholdExceeded
                  ? 'VAN: MỞ NHÁNH HỒI LƯU'
                  : 'VAN: MỞ ĐẦU RA CHÍNH'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Điều khiển tự động qua Relay 12V
              </div>
            </div>
          </div>

          {/* Hardware Block Diagram & Signal Flow */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#174D35] uppercase tracking-wider">
                Sơ đồ khối luồng dữ liệu & Điều khiển (Control Architecture)
              </span>
              <span className="font-mono-tabular text-slate-400">
                SENSOR → MCU → ACTUATOR
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
              {/* Block 1: Sensors */}
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F7F8F2]/60 space-y-2">
                <div className="text-xs font-mono-tabular font-semibold text-[#0F766E]">
                  01. KHỐI CẢM BIẾN (INPUT)
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li>· Cảm biến lưu lượng đầu vào (S1)</li>
                  <li>· Cảm biến lưu lượng đầu ra (S2)</li>
                  <li>· Đầu đo giám sát trạng thái nước sau lọc</li>
                </ul>
              </div>

              {/* Block 2: Microcontroller */}
              <div className="p-4 rounded-xl border border-[#174D35] bg-[#174D35] text-white space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono-tabular font-semibold text-emerald-300">
                    02. BỘ ĐIỀU KHIỂN TRUNG TÂM (MCU)
                  </div>
                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                    Đọc xung cảm biến, tính độ chênh lệch lưu lượng (ΔQ) và so sánh tín hiệu với ngưỡng cài đặt.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-tabular text-emerald-200 pt-2 border-t border-white/15">
                  <span>ΔQ = {(simulatedInletFlow - simulatedOutletFlow).toFixed(2)} L/m</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Block 3: Actuators */}
              <div className="p-4 rounded-xl border border-slate-200 bg-[#F7F8F2]/60 space-y-2">
                <div className="text-xs font-mono-tabular font-semibold text-[#0284C7]">
                  03. CƠ CẤU CHẤP HÀNH (OUTPUT)
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li>
                    · Bơm cấp nước:{' '}
                    <strong>{isCoreSaturated ? 'Tạm ngắt' : 'Đang chạy'}</strong>
                  </li>
                  <li>
                    · Van điện từ 3 ngả:{' '}
                    <strong>
                      {isThresholdExceeded ? 'Hướng tuần hoàn' : 'Hướng đầu ra'}
                    </strong>
                  </li>
                  <li>· Màn hình LCD/OLED hiển thị cảnh báo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

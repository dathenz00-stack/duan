import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Recycle,
  Wrench,
  AlertCircle,
} from 'lucide-react';

interface LabTrialEntry {
  id: string;
  parameterName: string;
  unit: string;
  beforeValue: string;
  afterValue: string;
  conditionNote: string;
  replications: number;
}

export const ResultsSection: React.FC = () => {
  // Default is empty so the website strictly shows "CHƯA CẬP NHẬT KẾT QUẢ THỬ NGHIỆM"
  // instead of inventing fake experimental numbers, while providing a live form for the student team to input their real data!
  const [trials, setTrials] = useState<LabTrialEntry[]>([]);
  const [paramInput, setParamInput] = useState<string>('');
  const [unitInput, setUnitInput] = useState<string>('mg/L');
  const [beforeInput, setBeforeInput] = useState<string>('');
  const [afterInput, setAfterInput] = useState<string>('');
  const [conditionInput, setConditionInput] = useState<string>(
    'Lưu lượng 1.0 L/phút, nhiệt độ phòng 25°C'
  );
  const [repInput, setRepInput] = useState<number>(3);

  const handleAddTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paramInput.trim() || !beforeInput.trim() || !afterInput.trim()) return;
    const newEntry: LabTrialEntry = {
      id: `trial-${Date.now()}`,
      parameterName: paramInput.trim(),
      unit: unitInput.trim() || '-',
      beforeValue: beforeInput.trim(),
      afterValue: afterInput.trim(),
      conditionNote: conditionInput.trim(),
      replications: repInput,
    };
    setTrials((prev) => [...prev, newEntry]);
    setParamInput('');
    setBeforeInput('');
    setAfterInput('');
  };

  const handleRemoveTrial = (id: string) => {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-16 py-14 px-6 lg:px-12 max-w-[1440px] mx-auto">
      {/* SECTION 9: PROBLEM & SOLUTION (VẤN ĐỀ VÀ GIẢI PHÁP) */}
      <section id="problem-solution" className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#174D35] font-semibold">
            <Recycle className="w-4 h-4" />
            <span>BỐI CẢNH NGHIÊN CỨU & GIẢI PHÁP ĐỀ XUẤT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112218]">
            Từ Phụ Phẩm Sinh Học Đến Hệ Thống Lọc Nước Tuần Hoàn
          </h2>
          <p className="text-sm text-slate-600 max-w-3xl">
            Dự án hướng tới giải quyết đồng thời bài toán tận dụng phụ phẩm sinh học khó phân hủy (tóc thải sinh hoạt) cùng phụ phẩm nông nghiệp (xơ mướp) để chế tạo lõi lọc nước mô-đun có kiểm soát lưu lượng.
          </p>
        </div>

        {/* 4-Step Problem -> Bio-Material -> Core Design -> Smart Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-[#174D35]/15 space-y-2.5">
            <div className="text-xs font-mono-tabular font-bold text-[#174D35]">
              01. VẤN ĐỀ MÔI TRƯỜNG
            </div>
            <h3 className="text-base font-bold text-[#112218]">
              Lãng phí nguồn sinh khối & Nhu cầu xử lý nước
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tóc thải sinh hoạt phát sinh hàng ngày chứa hàm lượng lớn protein keratin nhưng thường bị thải bỏ trực tiếp, trong khi nhu cầu về vật liệu lọc nước giá thành hợp lý, thân thiện môi trường ngày càng cấp thiết.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#174D35]/15 space-y-2.5">
            <div className="text-xs font-mono-tabular font-bold text-[#174D35]">
              02. Ý TƯỞNG VẬT LIỆU TUẦN HOÀN
            </div>
            <h3 className="text-base font-bold text-[#112218]">
              Kết hợp Keratin từ tóc & Khung xơ mướp
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sử dụng mạng mạch xốp 3D của xơ mướp làm khung xương cơ học (Cellulose scaffold) để nâng đỡ và phân tán pha hoạt tính Keratin từ tóc, hạn chế hiện tượng bết dính hoặc rửa trôi sợi rời.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#174D35]/15 space-y-2.5">
            <div className="text-xs font-mono-tabular font-bold text-[#174D35]">
              03. THIẾT KẾ LÕI LỌC PHÂN TẦNG
            </div>
            <h3 className="text-base font-bold text-[#112218]">
              Cấu trúc mô-đun 3 lớp tháo lắp nhanh
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bố trí phân tầng theo chiều dòng chảy: Tầng 1 phân phối dòng và giữ cặn thô (Cellulose) → Tầng 2 tương tác bề mặt (Keratin) → Tầng 3 ổn định hai pha (Bio-Composite).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#174D35]/15 space-y-2.5">
            <div className="text-xs font-mono-tabular font-bold text-[#174D35]">
              04. ĐIỂM MỚI VỀ ĐIỀU KHIỂN
            </div>
            <h3 className="text-base font-bold text-[#112218]">
              Giám sát lưu lượng & Hồi lưu tuần hoàn
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thay vì chỉ lọc tự chảy thụ động, hệ thống tích hợp cảm biến theo dõi lưu lượng và nhánh ống tuần hoàn giúp chủ động điều chỉnh số chu kỳ đi qua lõi lọc và cảnh báo thời điểm thay lõi.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 10: EXPERIMENTAL RESULTS & PROTOTYPE BENCHMARK (KẾT QUẢ THỬ NGHIỆM) */}
      <section
        id="experimental-results"
        className="bg-white rounded-2xl border border-[#174D35]/15 p-6 lg:p-8 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#174D35] font-semibold">
              <ClipboardList className="w-4 h-4" />
              <span>HỒ SƠ THỰC NGHIỆM & ĐÁNH GIÁ NGUYÊN MẪU</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112218]">
              Kết Quả Thử Nghiệm & Hướng Cải Tiến Tiếp Theo
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Khu vực dành cho nhóm nghiên cứu cập nhật trực tiếp bảng số liệu đo kiểm trước — sau xử lý, điều kiện chạy mẫu và số lần lặp lại thí nghiệm.
            </p>
          </div>

          <div className="text-xs font-mono-tabular text-slate-500">
            TRẠNG THÁI DỮ LIỆU:{' '}
            <strong className="text-[#174D35]">
              {trials.length === 0
                ? 'CHƯA CẬP NHẬT KẾT QUẢ THỬ NGHIỆM'
                : `ĐÃ NHẬP ${trials.length} CHỈ TIÊU THỬ NGHIỆM`}
            </strong>
          </div>
        </div>

        {/* Data Table or Honest Empty State */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            {trials.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#F7F8F2] border border-dashed border-[#174D35]/30 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-[#174D35] mx-auto" />
                <div className="text-base font-bold text-[#112218]">
                  CHƯA CẬP NHẬT KẾT QUẢ THỬ NGHIỆM
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Tuân thủ nguyên tắc trung thực khoa học, hệ thống không tự tạo số liệu đo giả định. Nhóm nghiên cứu có thể nhập trực tiếp số liệu thực nghiệm từ biên bản phòng thí nghiệm vào biểu mẫu bên dưới để hiển thị bảng so sánh trong buổi thuyết trình.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F7F8F2] border-b border-slate-200 text-slate-700">
                      <th className="py-3 px-4 font-semibold">Chỉ tiêu theo dõi</th>
                      <th className="py-3 px-3 font-semibold font-mono-tabular">
                        Trước xử lý
                      </th>
                      <th className="py-3 px-3 font-semibold font-mono-tabular">
                        Sau xử lý
                      </th>
                      <th className="py-3 px-3 font-semibold">
                        Điều kiện & Lặp lại (n)
                      </th>
                      <th className="py-3 px-2 text-right font-semibold">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trials.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-[#112218]">
                          {t.parameterName}{' '}
                          <span className="text-slate-400 font-mono-tabular">
                            ({t.unit})
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono-tabular text-slate-700">
                          {t.beforeValue}
                        </td>
                        <td className="py-3 px-3 font-mono-tabular font-semibold text-[#174D35]">
                          {t.afterValue}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {t.conditionNote} ·{' '}
                          <span className="font-mono-tabular">n={t.replications}</span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveTrial(t.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Xóa dòng số liệu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Form for the student team to add real experimental data */}
            <form
              onSubmit={handleAddTrial}
              className="p-5 rounded-xl bg-[#F7F8F2] border border-[#174D35]/15 space-y-4"
            >
              <div className="text-xs font-bold text-[#174D35] uppercase tracking-wider">
                Bổ sung số liệu thực nghiệm của nhóm (Dành cho báo cáo hội đồng)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">
                    Tên chỉ tiêu (VD: Độ đục, pH, Ion...)
                  </label>
                  <input
                    type="text"
                    value={paramInput}
                    onChange={(e) => setParamInput(e.target.value)}
                    placeholder="Nhập tên chỉ tiêu..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#174D35]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">
                    Đơn vị đo
                  </label>
                  <input
                    type="text"
                    value={unitInput}
                    onChange={(e) => setUnitInput(e.target.value)}
                    placeholder="mg/L, NTU..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono-tabular focus:outline-none focus:border-[#174D35]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">
                    Số lần lặp lại (n)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={repInput}
                    onChange={(e) => setRepInput(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono-tabular focus:outline-none focus:border-[#174D35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">
                    Giá trị trước xử lý
                  </label>
                  <input
                    type="text"
                    value={beforeInput}
                    onChange={(e) => setBeforeInput(e.target.value)}
                    placeholder="VD: Mẫu đầu vào"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono-tabular focus:outline-none focus:border-[#174D35]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">
                    Giá trị sau xử lý
                  </label>
                  <input
                    type="text"
                    value={afterInput}
                    onChange={(e) => setAfterInput(e.target.value)}
                    placeholder="VD: Mẫu sau lọc"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono-tabular focus:outline-none focus:border-[#174D35]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">
                    Điều kiện thử nghiệm
                  </label>
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#174D35]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#174D35] text-white hover:bg-[#113826] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm vào bảng kết quả thực nghiệm
              </button>
            </form>
          </div>

          {/* Right Column: Prototype Benchmark Visual + Current Limitations & Future Work */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src="/src/assets/images/prototype_bench_setup_1791561715867.jpg"
                alt="Minh họa bố trí mô hình thử nghiệm hệ thống lọc nước sinh học trên bàn thí nghiệm"
                referrerPolicy="no-referrer"
                className="w-full aspect-16/9 object-cover"
              />
              <div className="p-3 bg-[#F7F8F2] text-[11px] text-slate-600 border-t border-slate-200">
                Hình minh họa sơ đồ bố trí cụm cột lọc trong suốt, bơm nhu động và mạch vi điều khiển trên bàn thí nghiệm.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F7F8F2] border border-slate-200 space-y-2">
                <div className="font-bold text-[#112218] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Hạn chế hiện tại của nguyên mẫu</span>
                </div>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>
                    Quy trình xử lý hoạt hóa keratin từ tóc mới dừng ở quy mô phòng thí nghiệm theo mẻ nhỏ.
                  </li>
                  <li>
                    Độ đồng đều của khung xơ mướp tự nhiên phụ thuộc vào nguồn nguyên liệu thu hoạch.
                  </li>
                  <li>
                    Cần thêm các đợt kiểm nghiệm dài hạn về số chu kỳ tái sinh/hoàn nguyên tối đa của lõi lọc.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8F2] border border-slate-200 space-y-2">
                <div className="font-bold text-[#174D35] flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#174D35]" />
                  <span>Hướng cải tiến tiếp theo</span>
                </div>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>
                    Chuẩn hóa khuôn ép định hình viên nén Bio-Composite theo kích thước cốc lọc tiêu chuẩn.
                  </li>
                  <li>
                    Tích hợp thêm cảm biến đo độ dẫn điện (TDS/EC) và độ đục quang học trực tuyến có hiệu chuẩn chuẩn xác.
                  </li>
                  <li>
                    Đánh giá khả năng phân hủy sinh học an toàn của lõi lọc sau khi kết thúc vòng đời sử dụng.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

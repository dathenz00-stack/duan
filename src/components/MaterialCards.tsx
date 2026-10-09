import React, { useState } from 'react';
import { BIO_MATERIALS_DATA, MaterialCardData } from '../data/materialInformation';
import { Microscope, Compass, X, CheckCircle2 } from 'lucide-react';

interface MaterialCardsProps {
  onInspectLayerIn3D: (partId: string) => void;
}

export const MaterialCards: React.FC<MaterialCardsProps> = ({
  onInspectLayerIn3D,
}) => {
  const [activeModalMaterial, setActiveModalMaterial] =
    useState<MaterialCardData | null>(null);

  return (
    <section
      id="bio-materials"
      className="py-14 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#174D35] font-semibold">
            <Microscope className="w-4 h-4" />
            <span>CẤU TRÚC LÕI LỌC SINH HỌC BA TẦNG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112218]">
            Hệ Vật Liệu Sinh Học Tuần Hoàn: Keratin · Cellulose · Bio-Composite
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Khám phá nguồn gốc phụ phẩm sinh học, phương pháp chế tạo trong phòng thí nghiệm và vai trò kỹ thuật của từng thành phần trong lõi lọc SMART BIO-TRAP.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Nhấn vào từng thẻ vật liệu để mở mô hình phóng đại & quy trình chế tạo chi tiết
        </div>
      </div>

      {/* 3 Material Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {BIO_MATERIALS_DATA.map((mat) => (
          <article
            key={mat.id}
            className="bg-white rounded-2xl border border-[#174D35]/15 overflow-hidden flex flex-col justify-between transition-all hover:border-[#174D35]"
          >
            <div>
              {/* Lab Photo with Fallback Safety */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={mat.imagePath}
                  alt={mat.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between">
                  <span className="font-mono-tabular font-semibold">
                    {mat.code}
                  </span>
                  <span>Tầng lọc #{mat.layerNumber}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#112218]">
                    {mat.title}
                  </h3>
                  <p className="text-xs font-medium text-[#174D35] mt-0.5">
                    {mat.vietnameseTitle}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <div>
                    <strong className="text-[#112218] block">
                      Nguồn nguyên liệu:
                    </strong>
                    {mat.sourceMaterial}
                  </div>
                  <div>
                    <strong className="text-[#112218] block">
                      Vai trò trong hệ thống lọc:
                    </strong>
                    {mat.roleInSystem}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="text-xs font-semibold text-[#174D35]">
                    Quy trình xử lý & Chế tạo chính:
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {mat.fabricationMethod.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Card Footer CTA */}
            <div className="px-6 pb-6 pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModalMaterial(mat)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#174D35] text-white hover:bg-[#113826] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Microscope className="w-3.5 h-3.5" />
                KHÁM PHÁ CẤU TRÚC
              </button>

              <button
                type="button"
                onClick={() => onInspectLayerIn3D(mat.targetPartId)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-[#174D35]/25 text-[#174D35] hover:bg-[#174D35]/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Phóng to đến lớp vật liệu này trên mô hình 3D"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Magnified Material Structure Modal */}
      {activeModalMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-mono-tabular text-[#174D35] font-semibold">
                  {activeModalMaterial.code} · MÔ HÌNH PHÓNG ĐẠI VI CẤU TRÚC
                </div>
                <h3 className="text-xl font-bold text-[#112218] mt-0.5">
                  {activeModalMaterial.title} — {activeModalMaterial.vietnameseTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalMaterial(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100">
                  <img
                    src={activeModalMaterial.imagePath}
                    alt={activeModalMaterial.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {activeModalMaterial.microstructureNote}
                </p>

                {/* Interactive Schematic Cross-Section of Material Microstructure */}
                <div className="p-3.5 rounded-xl bg-[#F7F8F2] border border-[#174D35]/15 space-y-1.5">
                  <div className="text-xs font-semibold text-[#174D35]">
                    Đặc tính ghi nhận trong nghiên cứu:
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {activeModalMaterial.observedCharacteristics.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4D9667] shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-[#112218] text-sm">
                    1. Vai trò trong cấu trúc lõi lọc SMART BIO-TRAP
                  </h4>
                  <p className="text-slate-700 mt-1">
                    {activeModalMaterial.roleInSystem}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#112218] text-sm">
                    2. Quy trình xử lý & Chế tạo theo tài liệu nhóm
                  </h4>
                  <ol className="list-decimal pl-4 mt-1.5 space-y-1.5 text-slate-700">
                    {activeModalMaterial.fabricationMethod.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong>Nguyên tắc trung thực khoa học:</strong> Hệ thống không tự ý điền sẵn các con số giả định về diện tích bề mặt BET (m²/g) hay dung lượng hấp phụ cực đại (mg/g) khi chưa đính kèm biên bản đo tương ứng của mẫu thử.
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const targetId = activeModalMaterial.targetPartId;
                      setActiveModalMaterial(null);
                      onInspectLayerIn3D(targetId);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#174D35] text-white hover:bg-[#113826] transition-colors cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    Quan sát tầng vật liệu này trong Mô hình 3D
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

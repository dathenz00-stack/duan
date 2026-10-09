import React from 'react';

interface NavbarProps {
  onExploreStructure: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onExploreStructure }) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5 bg-[#F7F8F2]/95 backdrop-blur-sm border-b border-[#174D35]/10">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#hero"
        className="text-base font-bold tracking-tight text-[#174D35] whitespace-nowrap shrink-0"
      >
        SMART BIO-TRAP
      </a>

      {/* Zone 2: 5 concise single-line navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#112218]/75">
        <a
          href="#explorer-3d"
          className="hover:text-[#174D35] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Khám phá 3D
        </a>
        <a
          href="#water-journey"
          className="hover:text-[#174D35] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Nguyên lý
        </a>
        <a
          href="#bio-materials"
          className="hover:text-[#174D35] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Vật liệu
        </a>
        <a
          href="#smart-dashboard"
          className="hover:text-[#174D35] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Điều khiển
        </a>
        <a
          href="#experimental-results"
          className="hover:text-[#174D35] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Thử nghiệm
        </a>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onExploreStructure}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#174D35] rounded-lg hover:bg-[#113826] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Khám phá Cấu tạo
        </button>
      </div>
    </header>
  );
};

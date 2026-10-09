import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SmartBioTrapMachineModel } from '../scene/MachineModel';
import { CameraController } from '../scene/CameraController';
import { Compass, Play, Tag, RotateCcw } from 'lucide-react';

interface HeroSectionProps {
  reducedMotion: boolean;
  onExploreStructure: (initialPartId?: string) => void;
  onStartWaterJourney: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  reducedMotion,
  onExploreStructure,
  onStartWaterJourney,
}) => {
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const [showSmartTags, setShowSmartTags] = useState<boolean>(true);
  const cameraCtrlRef = useRef<CameraController | null>(null);

  useEffect(() => {
    const container = heroCanvasRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F3F5EE');

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
    const cameraCtrl = new CameraController(camera);
    cameraCtrl.flyTo([3.6, 1.85, 4.1], [0, 0.05, 0], true);
    cameraCtrlRef.current = cameraCtrl;

    // Studio lighting & soft shadow floor
    scene.add(new THREE.AmbientLight('#FFFFFF', 0.9));

    const dirLight = new THREE.DirectionalLight('#FFFBEB', 1.6);
    dirLight.position.set(4, 6, 4.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight('#E0F2FE', 0.7);
    fillLight.position.set(-4, 2.5, 3);
    scene.add(fillLight);

    const pedestalGeo = new THREE.CylinderGeometry(2.1, 2.25, 0.08, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E6EAE0'),
      roughness: 0.85,
      metalness: 0.05,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.46;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const model = new SmartBioTrapMachineModel();
    scene.add(model.rootGroup);

    const domElem = renderer.domElement;
    const onPointerDown = (e: PointerEvent) => cameraCtrl.onPointerDown(e.clientX, e.clientY);
    const onPointerMove = (e: PointerEvent) => cameraCtrl.onPointerMove(e.clientX, e.clientY);
    const onPointerUp = () => cameraCtrl.onPointerUp();
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraCtrl.onWheel(e.deltaY);
    };

    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        model.rootGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.18;
      } else {
        model.rootGroup.rotation.y = 0;
      }

      cameraCtrl.update(dt, reducedMotion);
      model.update(dt, elapsed, 'all', true, reducedMotion);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      model.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative py-10 lg:py-16 px-6 lg:px-12 max-w-[1440px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Left Column: Scientific Product Pitch & Primary Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 py-2">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#174D35]">
              <span>DỰ ÁN KHOA HỌC KỸ THUẬT KHỞI NGHIỆP</span>
              <span aria-hidden="true">·</span>
              <span>VẬT LIỆU SINH HỌC TUẦN HOÀN</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#112218] leading-[1.15]">
              CÔNG NGHỆ LỌC NƯỚC — TÁI SINH TỪ VẬT LIỆU SINH HỌC
            </h1>

            <p className="text-base text-slate-700 leading-relaxed max-w-[62ch]">
              <strong>SMART BIO-TRAP</strong> là hệ thống lọc nước thông minh nghiên cứu kết hợp{' '}
              <strong>vật liệu keratin thu hồi từ tóc</strong>,{' '}
              <strong>khung cellulose xốp từ xơ mướp</strong> và cấu trúc{' '}
              <strong>vật liệu kép bio-composite</strong> cùng hệ thống cảm biến — điều khiển tuần hoàn tự động.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onExploreStructure()}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#174D35] rounded-xl hover:bg-[#113826] transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                KHÁM PHÁ CẤU TẠO
              </button>

              <button
                type="button"
                onClick={onStartWaterJourney}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#174D35] bg-white border border-[#174D35]/25 rounded-xl hover:bg-[#174D35]/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                XEM NGUYÊN LÝ HOẠT ĐỘNG
              </button>
            </div>
          </div>

          {/* Key Architectural Highlights Strip */}
          <div className="pt-6 border-t border-[#174D35]/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="font-mono-tabular font-semibold text-[#174D35]">
                03 TẦNG VẬT LIỆU
              </div>
              <p className="text-slate-600 mt-1">
                Khung Cellulose xơ mướp, lớp Keratin hoạt hóa và lõi kép Bio-Composite.
              </p>
            </div>
            <div>
              <div className="font-mono-tabular font-semibold text-[#174D35]">
                CHU TRÌNH TUẦN HOÀN
              </div>
              <p className="text-slate-600 mt-1">
                Tích hợp nhánh hồi lưu điều khiển bằng van điện từ khi cần lọc lặp lại.
              </p>
            </div>
            <div>
              <div className="font-mono-tabular font-semibold text-[#174D35]">
                MÔ HÌNH TRỰC QUAN 3D
              </div>
              <p className="text-slate-600 mt-1">
                Mô hình concept 3D minh họa cấu trúc phân lớp phục vụ thuyết trình khoa học.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Studio Machine Showcase */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative w-full h-[420px] lg:h-full min-h-[420px] rounded-2xl border border-[#174D35]/15 bg-[#F3F5EE] overflow-hidden shadow-xs">
            {/* Top Bar inside 3D Hero Stage */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
              <span className="pointer-events-auto bg-white/90 backdrop-blur-xs border border-[#174D35]/15 px-3 py-1 rounded-md text-xs font-medium text-[#174D35]">
                Mô hình Concept 3D Tương tác · Xoay & Thu phóng tự do
              </span>

              <div className="pointer-events-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSmartTags((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white/90 text-[#112218] border border-[#174D35]/20 hover:bg-white cursor-pointer"
                >
                  <Tag className="w-3 h-3 text-[#174D35]" />
                  {showSmartTags ? 'Ẩn nhãn nhanh' : 'Hiện nhãn nhanh'}
                </button>
                <button
                  type="button"
                  onClick={() => cameraCtrlRef.current?.flyTo([3.6, 1.85, 4.1], [0, 0.05, 0])}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white/90 text-[#112218] border border-[#174D35]/20 hover:bg-white cursor-pointer"
                  title="Đặt lại góc nhìn"
                >
                  <RotateCcw className="w-3 h-3 text-[#174D35]" />
                </button>
              </div>
            </div>

            {/* 3D Canvas Container */}
            <div
              ref={heroCanvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />

            {/* Smart Labels Overlay on Hero 3D Model */}
            {showSmartTags && (
              <div className="pointer-events-none absolute inset-0 z-10">
                <button
                  type="button"
                  onClick={() => onExploreStructure('cellulose-frame')}
                  className="pointer-events-auto absolute top-[24%] left-[54%] px-2.5 py-1 rounded-md text-xs font-medium bg-white/95 text-[#112218] border border-[#C89D66] shadow-xs hover:bg-[#174D35] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Tầng 1: Khung Cellulose (Xơ mướp) →
                </button>

                <button
                  type="button"
                  onClick={() => onExploreStructure('keratin-layer')}
                  className="pointer-events-auto absolute top-[44%] left-[56%] px-2.5 py-1 rounded-md text-xs font-medium bg-white/95 text-[#112218] border border-[#8B5A2B] shadow-xs hover:bg-[#174D35] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Tầng 2: Vật liệu Keratin (Từ tóc) →
                </button>

                <button
                  type="button"
                  onClick={() => onExploreStructure('biocomposite-layer')}
                  className="pointer-events-auto absolute top-[62%] left-[53%] px-2.5 py-1 rounded-md text-xs font-medium bg-white/95 text-[#112218] border border-[#174D35] shadow-xs hover:bg-[#174D35] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Tầng 3: Lõi kép Bio-Composite →
                </button>

                <button
                  type="button"
                  onClick={() => onExploreStructure('smart-controller')}
                  className="pointer-events-auto absolute bottom-[18%] right-[8%] px-2.5 py-1 rounded-md text-xs font-medium bg-[#174D35] text-white shadow-xs hover:bg-[#113826] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Bộ điều khiển thông minh →
                </button>
              </div>
            )}

            {/* Bottom Caption Note */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-[11px] text-slate-600 bg-white/85 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/80">
              <span>Nhấn vào nhãn bất kỳ để phóng to vào bên trong buồng lọc 3D</span>
              <span className="font-mono-tabular text-[#174D35] font-semibold">
                STUDIO 3D VIEW
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export type ComponentGroup =
  | 'overview'
  | 'bio-filter'
  | 'sensors'
  | 'controller'
  | 'piping';

export interface MachinePartMetadata {
  id: string;
  name: string;
  shortLabel: string;
  group: ComponentGroup;
  breadcrumb: string;
  role: string;
  description: string;
  materialSpec: string;
  designNote: string;
  /** Default 3D position in assembled state [x, y, z] */
  basePosition: [number, number, number];
  /** Offset added when Exploded View is active [dx, dy, dz] */
  explodedOffset: [number, number, number];
  /** Ideal camera position when zooming into this component [x, y, z] */
  cameraPosition: [number, number, number];
  /** Ideal OrbitControls target when inspecting this component [x, y, z] */
  cameraTarget: [number, number, number];
  /** Anchor offset relative to part position for 3D-to-2D label pin */
  labelAnchorOffset: [number, number, number];
  /** Color code for UI legend & material distinction */
  accentHex: string;
  isBioLayer?: boolean;
  layerIndex?: number;
}

export const MACHINE_COMPONENTS: MachinePartMetadata[] = [
  {
    id: 'outer-housing',
    name: 'Khung & Vỏ Bảo Vệ Mô-đun (Protective Frame)',
    shortLabel: 'Vỏ & Khung đỡ',
    group: 'overview',
    breadcrumb: 'Thiết bị → Khung & Vỏ bảo vệ',
    role: 'Cố định buồng lọc, bảo vệ cụm cảm biến và tạo bệ đỡ vững chắc trên bàn thí nghiệm.',
    description:
      'Cấu trúc khung đỡ mô-đun kết hợp tấm chắn bảo vệ trong suốt giúp cố định trục đứng của cột lọc sinh học, đồng thời cho phép quan sát trực quan sự thay đổi màu sắc và trạng thái vật liệu bên trong trong suốt quá trình vận hành.',
    materialSpec: 'Nhôm định hình anod hóa & tấm chắn Acrylic trong suốt',
    designNote: 'Mô hình trực quan hóa khái niệm (Concept 3D Visualization)',
    basePosition: [0, 0, 0],
    explodedOffset: [-2.1, 0, -0.8],
    cameraPosition: [4.2, 2.4, 4.8],
    cameraTarget: [0, 0.2, 0],
    labelAnchorOffset: [-1.15, 1.4, 0],
    accentHex: '#64748B',
  },
  {
    id: 'filter-chamber',
    name: 'Buồng Lọc Trụ Đứng Trong Suốt (Filter Chamber)',
    shortLabel: 'Buồng lọc chính',
    group: 'bio-filter',
    breadcrumb: 'Thiết bị → Cụm lọc → Buồng lọc trụ đứng',
    role: 'Chứa các tầng vật liệu sinh học và duy trì áp suất dòng chảy ổn định qua lõi.',
    description:
      'Ống trụ chịu áp bằng vật liệu trong suốt kết hợp hai nắp bích kín nước ở hai đầu. Thiết kế tháo lắp nhanh giúp người vận hành dễ dàng thay thế hoặc hoàn nguyên từng tầng lõi lọc sinh học sau mỗi chu kỳ.',
    materialSpec: 'Ống trụ Acrylic PMMA dày 5mm & mặt bích nhôm CNC',
    designNote: 'Thiết kế mô-đun tháo lắp nhanh phục vụ thay lõi tuần hoàn',
    basePosition: [0, 0.2, 0],
    explodedOffset: [0, 1.55, 0],
    cameraPosition: [2.8, 1.4, 3.1],
    cameraTarget: [0, 0.3, 0],
    labelAnchorOffset: [0.85, 0.9, 0.3],
    accentHex: '#45A9C7',
  },
  {
    id: 'cellulose-frame',
    name: 'Tầng 1: Khung Cellulose Từ Xơ Mướp (Luffa Scaffold)',
    shortLabel: 'Khung Cellulose (Xơ mướp)',
    group: 'bio-filter',
    breadcrumb: 'Thiết bị → Cụm lọc → Lõi lọc sinh học → Khung Cellulose',
    role: 'Phân phối dòng chảy đều, giữ cặn lơ lửng kích thước lớn và làm khung đỡ cơ học 3D.',
    description:
      'Mạng lưới sợi mạch tự nhiên từ xơ mướp (Luffa cylindrica) đã qua xử lý làm sạch tạo thành hệ khung xốp ba chiều có độ thông thoáng cao, giảm sụt áp và nâng đỡ các lớp vật liệu sinh học phía dưới không bị nén chặt khi dòng nước đi qua.',
    materialSpec: 'Cellulose tự nhiên từ xơ mướp xử lý kiềm nhẹ, cấu trúc mạch xốp 3D',
    designNote: 'Tầng lọc cơ học & giá thể phân phối dòng chảy đầu vào',
    basePosition: [0, 0.85, 0],
    explodedOffset: [1.65, 1.05, 0.4],
    cameraPosition: [1.75, 1.25, 1.9],
    cameraTarget: [0, 0.85, 0],
    labelAnchorOffset: [0.6, 0.1, 0.4],
    accentHex: '#C89D66',
    isBioLayer: true,
    layerIndex: 1,
  },
  {
    id: 'keratin-layer',
    name: 'Tầng 2: Lớp Vật Liệu Keratin Từ Tóc (Processed Hair Keratin)',
    shortLabel: 'Lớp Keratin (Từ tóc)',
    group: 'bio-filter',
    breadcrumb: 'Thiết bị → Cụm lọc → Lõi lọc sinh học → Lớp Keratin',
    role: 'Tương tác bề mặt với các tạp chất hòa tan nhờ hệ nhóm chức sinh học đặc trưng của protein keratin.',
    description:
      'Tận dụng nguồn tóc thải sinh hoạt đã qua quy trình làm sạch, khử trùng và biến tính bề mặt theo phương pháp của nhóm nghiên cứu. Cấu trúc sợi mảnh kết hợp các nhóm chức (-SH, -NH2, -COOH) đóng vai trò lớp vật liệu tương tác chính trong buồng lọc.',
    materialSpec: 'Sợi & hạt nền Keratin thu hồi từ tóc thải qua xử lý hoạt hóa bề mặt',
    designNote: 'Vật liệu sinh học tái chế từ phụ phẩm sinh hoạt',
    basePosition: [0, 0.2, 0],
    explodedOffset: [1.95, 0.15, 0.6],
    cameraPosition: [1.65, 0.55, 1.85],
    cameraTarget: [0, 0.2, 0],
    labelAnchorOffset: [0.6, 0, 0.4],
    accentHex: '#8B5A2B',
    isBioLayer: true,
    layerIndex: 2,
  },
  {
    id: 'biocomposite-layer',
    name: 'Tầng 3: Vật Liệu Kép Bio-Composite (Dual Bio-Composite)',
    shortLabel: 'Lõi Bio-Composite',
    group: 'bio-filter',
    breadcrumb: 'Thiết bị → Cụm lọc → Lõi lọc sinh học → Bio-Composite',
    role: 'Cố định pha hoạt tính keratin trên nền khung cellulose, tối ưu diện tích tiếp xúc và độ bền thủy lực.',
    description:
      'Sự kết hợp đồng nhất giữa khung đỡ sợi cellulose xơ mướp và pha nền keratin tạo nên vật liệu composite sinh học hai thành phần. Cấu trúc này khắc phục hiện tượng rửa trôi sợi rời và ổn định tốc độ thấm qua cột lọc.',
    materialSpec: 'Hệ vật liệu lai Cellulose-Keratin liên kết trên khung xốp sinh học',
    designNote: 'Cấu trúc vật liệu kép trọng tâm của dự án SMART BIO-TRAP',
    basePosition: [0, -0.45, 0],
    explodedOffset: [1.65, -0.75, 0.4],
    cameraPosition: [1.75, -0.25, 1.9],
    cameraTarget: [0, -0.45, 0],
    labelAnchorOffset: [0.6, -0.1, 0.4],
    accentHex: '#174D35',
    isBioLayer: true,
    layerIndex: 3,
  },
  {
    id: 'pipe-system',
    name: 'Hệ Thống Đường Ống, Bơm & Nhánh Tuần Hoàn (Piping & Recirculation)',
    shortLabel: 'Đường ống & Bơm tuần hoàn',
    group: 'piping',
    breadcrumb: 'Thiết bị → Đường nước vào, ra & Nhánh tuần hoàn',
    role: 'Dẫn nước đầu vào qua buồng lọc, cấp nước đầu ra và điều hướng dòng hồi lưu khi cần lọc lặp lại.',
    description:
      'Bao gồm đường ống cấp nước đầu vào (kèm bơm nhu động điều tốc), đường dẫn nước sau lọc và nhánh ống hồi lưu tuần hoàn có van điện từ điều hướng khi hệ thống phát hiện cần xử lý bổ sung.',
    materialSpec: 'Ống dẫn inox 304 kết hợp ống silicone y tế & van điện từ 12V DC',
    designNote: 'Hỗ trợ cả chế độ lọc một chiều (Single-pass) và tuần hoàn (Recirculation)',
    basePosition: [0, 0, 0],
    explodedOffset: [0, -0.85, 1.45],
    cameraPosition: [2.9, 0.6, 3.6],
    cameraTarget: [0.1, -0.1, 0.3],
    labelAnchorOffset: [-0.95, -0.75, 0.6],
    accentHex: '#0284C7',
  },
  {
    id: 'sensor-nodes',
    name: 'Cụm Cảm Biến Lưu Lượng & Giám Sát Trạng Thái (Sensor Array)',
    shortLabel: 'Hệ thống cảm biến',
    group: 'sensors',
    breadcrumb: 'Thiết bị → Hệ thống cảm biến trực tuyến',
    role: 'Đo tốc độ dòng chảy, theo dõi trạng thái vận hành ở đầu vào/đầu ra và gửi tín hiệu về bộ điều khiển.',
    description:
      'Các cụm cảm biến lắp trực tiếp trên đường ống đầu vào và đầu ra giúp theo dõi lưu lượng dòng chảy và chỉ số trạng thái nước theo thiết kế mạch đo của nhóm, phát hiện sớm tình trạng nghẽn lõi hoặc vượt ngưỡng cài đặt.',
    materialSpec: 'Cảm biến lưu lượng Hall-effect & đầu đo chất lượng nước tích hợp trên đường ống',
    designNote: 'Truyền tín hiệu thời gian thực về vi điều khiển trung tâm',
    basePosition: [0, 0, 0],
    explodedOffset: [-1.35, 0.75, 1.3],
    cameraPosition: [-2.4, 1.1, 2.9],
    cameraTarget: [-0.6, 0.3, 0.4],
    labelAnchorOffset: [-0.95, 0.7, 0.55],
    accentHex: '#0D9488',
  },
  {
    id: 'smart-controller',
    name: 'Bộ Điều Khiển Thông Minh & Màn Hình Giám Sát (Smart Control Unit)',
    shortLabel: 'Bộ điều khiển thông minh',
    group: 'controller',
    breadcrumb: 'Thiết bị → Bộ điều khiển trung tâm',
    role: 'Thu thập dữ liệu cảm biến, điều khiển bơm/van điện từ và cảnh báo thời điểm cần thay lõi sinh học.',
    description:
      'Hộp điều khiển vi xử lý đặt bên cạnh cột lọc, tiếp nhận dữ liệu từ cụm cảm biến để tự động đóng/mở van nhánh tuần hoàn, hiển thị trạng thái vận hành trực tiếp và thông báo khi lưu lượng qua lõi giảm dưới ngưỡng thiết kế.',
    materialSpec: 'Vi điều khiển trung tâm, mạch đóng ngắt Relay/MOSFET & màn hình hiển thị LCD/OLED',
    designNote: 'Tích hợp thuật toán giám sát chu trình lọc và cảnh báo bảo trì',
    basePosition: [1.35, -0.55, 0.35],
    explodedOffset: [1.55, -0.35, 1.2],
    cameraPosition: [2.7, 0.2, 2.8],
    cameraTarget: [1.35, -0.45, 0.35],
    labelAnchorOffset: [1.45, 0.05, 0.45],
    accentHex: '#174D35',
  },
];

export const GROUP_LABELS: { id: ComponentGroup; label: string; targetPartId: string }[] = [
  { id: 'overview', label: 'Tổng quan thiết bị', targetPartId: 'outer-housing' },
  { id: 'bio-filter', label: 'Cụm lọc sinh học', targetPartId: 'filter-chamber' },
  { id: 'sensors', label: 'Hệ thống cảm biến', targetPartId: 'sensor-nodes' },
  { id: 'controller', label: 'Bộ điều khiển', targetPartId: 'smart-controller' },
  { id: 'piping', label: 'Đường nước vào và ra', targetPartId: 'pipe-system' },
];

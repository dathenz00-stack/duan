export interface ProcessStepData {
  stepNumber: number;
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  scientificExplanation: string;
  activePartIds: string[];
  flowSegment: 'inlet' | 'pretreatment' | 'bio-core' | 'sensors' | 'outlet' | 'recirculation';
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  verificationNote: string;
}

export const WATER_JOURNEY_STEPS: ProcessStepData[] = [
  {
    stepNumber: 1,
    id: 'step-inlet',
    title: 'Bước 1 — Nước đầu vào (Feed Water Intake)',
    subtitle: 'Cấp nước vào hệ thống qua bơm định lượng',
    summary:
      'Dòng nước cần xử lý được đưa vào đường ống đầu vào nhờ bơm điều tốc với lưu lượng ổn định trước khi tiến lên đỉnh cột lọc.',
    scientificExplanation:
      'Việc kiểm soát tốc độ bơm đầu vào giúp duy trì thời gian lưu thủy lực (Hydraulic Retention Time - HRT) phù hợp để nước tiếp xúc đồng đều với các lớp vật liệu sinh học mà không gây xói mòn cấu trúc lõi.',
    activePartIds: ['pipe-system'],
    flowSegment: 'inlet',
    cameraPosition: [-2.6, 0.5, 3.2],
    cameraTarget: [-0.9, -0.2, 0.2],
    verificationNote: 'Lưu lượng đầu vào được điều chỉnh theo cấu hình bơm thử nghiệm của nhóm.',
  },
  {
    stepNumber: 2,
    id: 'step-pretreatment',
    title: 'Bước 2 — Tiền xử lý & Phân phối dòng (Pre-treatment & Distribution)',
    subtitle: 'Đi qua tầng khung Cellulose xơ mướp trên cùng',
    summary:
      'Nước đi vào đỉnh buồng lọc và thấm qua tầng khung cellulose từ xơ mướp để tách các hạt cặn lơ lửng kích thước lớn và phân tán đều dòng chảy.',
    scientificExplanation:
      'Cấu trúc mạch xơ tự nhiên đan xen ba chiều của xơ mướp đóng vai trò như một tấm chia dòng sinh học, ngăn hiện tượng chảy tắt (channeling) và bảo vệ các lớp vật liệu mịn phía dưới khỏi bị bít tắc sớm.',
    activePartIds: ['filter-chamber', 'cellulose-frame'],
    flowSegment: 'pretreatment',
    cameraPosition: [2.1, 1.35, 2.2],
    cameraTarget: [0, 0.85, 0],
    verificationNote: 'Minh họa cơ chế phân phối dòng và giữ cặn thô của khung xơ mướp.',
  },
  {
    stepNumber: 3,
    id: 'step-biofiltration',
    title: 'Bước 3 — Lọc qua vật liệu sinh học (Bio-Material Filtration)',
    subtitle: 'Tương tác qua tầng Keratin từ tóc và lõi kép Bio-Composite',
    summary:
      'Dòng nước di chuyển chậm qua lớp vật liệu keratin đã xử lý và tầng bio-composite lai hóa cellulose-keratin ở trung tâm buồng lọc.',
    scientificExplanation:
      'Tại đây, dòng nước tiếp xúc trực tiếp với bề mặt xốp giàu nhóm chức sinh học của keratin (cố định trên nền khung cellulose). Cấu trúc hai pha giúp duy trì độ thoáng thủy lực trong khi tăng diện tích tiếp xúc pha lỏng - rắn.',
    activePartIds: ['cellulose-frame', 'keratin-layer', 'biocomposite-layer'],
    flowSegment: 'bio-core',
    cameraPosition: [1.85, 0.25, 2.05],
    cameraTarget: [0, 0.1, 0],
    verificationNote: 'Mô phỏng đường đi của dòng nước qua 3 tầng vật liệu theo sơ đồ cấu tạo lõi.',
  },
  {
    stepNumber: 4,
    id: 'step-monitoring',
    title: 'Bước 4 — Giám sát thông minh (Smart Sensor Monitoring)',
    subtitle: 'Đo thông số dòng chảy & trạng thái vận hành sau cột lọc',
    summary:
      'Nước sau khi đi qua đáy buồng lọc tiếp cận cụm cảm biến hạ lưu để ghi nhận lưu lượng thực tế và tín hiệu trạng thái truyền về bộ điều khiển.',
    scientificExplanation:
      'Hệ thống so sánh tín hiệu lưu lượng và thông số đo giữa đầu vào - đầu ra với ngưỡng cài đặt trong vi điều khiển. Nếu phát hiện suy giảm lưu lượng do bão hòa lõi hoặc thông số vượt ngưỡng, bộ điều khiển sẽ kích hoạt cảnh báo hoặc chuyển chế độ.',
    activePartIds: ['sensor-nodes', 'smart-controller'],
    flowSegment: 'sensors',
    cameraPosition: [2.4, -0.1, 2.9],
    cameraTarget: [0.6, -0.4, 0.3],
    verificationNote: 'Chỉ mô phỏng luồng tín hiệu cảm biến dự kiến trong thiết kế; không tạo dữ liệu đo thực tế giả.',
  },
  {
    stepNumber: 5,
    id: 'step-outlet',
    title: 'Bước 5 — Nước đầu ra (Treated Water Outlet)',
    subtitle: 'Thu nhận nước sau xử lý khi thông số nằm trong ngưỡng thiết kế',
    summary:
      'Khi trạng thái vận hành ổn định, van đầu ra mở để dẫn nước sau xử lý sang bình chứa thành phẩm phục vụ đánh giá và sử dụng theo mục đích thiết kế.',
    scientificExplanation:
      'Đường nước đầu ra được bố trí điểm lấy mẫu riêng để nhóm nghiên cứu dễ dàng thu mẫu đối chứng trước và sau xử lý trong các đợt kiểm nghiệm phòng thí nghiệm.',
    activePartIds: ['pipe-system', 'smart-controller'],
    flowSegment: 'outlet',
    cameraPosition: [2.6, -0.4, 3.1],
    cameraTarget: [0.8, -0.6, 0.2],
    verificationNote: 'Màu sắc hạt nước chỉ mang tính trực quan hóa đường dẫn; chất lượng thực tế phụ thuộc kết quả kiểm nghiệm.',
  },
  {
    stepNumber: 6,
    id: 'step-recirculation',
    title: 'Bước 6 — Chu trình tuần hoàn (Recirculation Loop)',
    subtitle: 'Đường hồi lưu tự động khi cần tăng số chu kỳ tiếp xúc',
    summary:
      'Trong trường hợp cần xử lý lặp lại (Multi-pass filtration) hoặc thông số chưa đạt ngưỡng mong muốn, van điện từ chuyển hướng dòng nước qua nhánh ống tuần hoàn quay lại đầu vào.',
    scientificExplanation:
      'Cơ chế tuần hoàn khép kín cho phép tăng tổng thời gian tiếp xúc giữa nước và vật liệu sinh học keratin-cellulose mà không cần tăng chiều cao cột lọc, giúp thiết bị giữ kích thước nhỏ gọn.',
    activePartIds: ['pipe-system', 'sensor-nodes', 'smart-controller'],
    flowSegment: 'recirculation',
    cameraPosition: [0.2, 0.8, 4.3],
    cameraTarget: [0, 0.1, 0],
    verificationNote: 'Minh họa nhánh ống hồi lưu tuần hoàn điều khiển bằng van điện từ.',
  },
];

export interface MaterialCardData {
  id: 'keratin' | 'cellulose' | 'biocomposite';
  code: string;
  title: string;
  vietnameseTitle: string;
  sourceMaterial: string;
  targetPartId: string;
  layerNumber: number;
  imagePath: string;
  imageAlt: string;
  microstructureNote: string;
  roleInSystem: string;
  fabricationMethod: string[];
  observedCharacteristics: string[];
  colorHex: string;
}

export const BIO_MATERIALS_DATA: MaterialCardData[] = [
  {
    id: 'keratin',
    code: 'MATERIAL A · KERATIN MATRIX',
    title: 'KERATIN FROM HAIR',
    vietnameseTitle: 'Vật liệu Keratin thu hồi từ tóc thải',
    sourceMaterial: 'Phụ phẩm tóc thải từ các tiệm cắt tóc địa phương (nguồn sinh khối giàu protein sợi).',
    targetPartId: 'keratin-layer',
    layerNumber: 2,
    imagePath: '/src/assets/images/keratin_microstructure_1791561674458.jpg',
    imageAlt: 'Ảnh chụp cận cảnh vật liệu sợi keratin đã qua xử lý trong đĩa petri phòng thí nghiệm',
    microstructureNote:
      'Ảnh minh họa hình thái học vật liệu keratin sau xử lý làm sạch và hoạt hóa bề mặt (tài liệu trực quan hóa, phân biệt với khối hình học 3D trong mô hình).',
    roleInSystem:
      'Đóng vai trò pha hoạt tính bề mặt chính trong lõi lọc nhờ chuỗi polypeptide chứa nhiều liên kết disulfide (-S-S-) và các nhóm chức phân cực (-SH, -NH₂, -COOH) có khả năng tương tác với các ion và tạp chất trong nước.',
    fabricationMethod: [
      'Thu gom tóc thải, phân loại và rửa nhiều lần bằng chất hoạt động bề mặt nhẹ để loại bỏ dầu mỡ, bụi bẩn.',
      'Khử trùng, sấy khô ở nhiệt độ kiểm soát và cắt định hình theo kích thước thiết kế.',
      'Xử lý biến tính/hoạt hóa bề mặt theo quy trình phòng thí nghiệm của nhóm để mở rộng cấu trúc vảy cuticle và lộ các tâm hoạt tính.',
    ],
    observedCharacteristics: [
      'Tận dụng nguồn phụ phẩm sinh học sẵn có, giảm tải rác thải hữu cơ khó phân hủy tự nhiên.',
      'Cấu trúc dạng sợi dai, dễ phối trộn hoặc định hình cùng khung đỡ thực vật.',
      'Các chỉ số hấp phụ định lượng cụ thể sẽ được cập nhật trực tiếp từ biên bản đo kiểm thực nghiệm của nhóm.',
    ],
    colorHex: '#8B5A2B',
  },
  {
    id: 'cellulose',
    code: 'MATERIAL B · LUFFA SCAFFOLD',
    title: 'CELLULOSE FROM LUFFA',
    vietnameseTitle: 'Khung Cellulose từ xơ mướp tự nhiên',
    sourceMaterial: 'Xơ mướp già khô (Luffa cylindrica) từ phụ phẩm nông nghiệp.',
    targetPartId: 'cellulose-frame',
    layerNumber: 1,
    imagePath: '/src/assets/images/luffa_cellulose_frame_1791561686485.jpg',
    imageAlt: 'Ảnh chụp lát cắt ngang khung cellulose xơ mướp với mạng lưới lỗ xốp ba chiều',
    microstructureNote:
      'Ảnh chụp cấu trúc mạng mạch xốp 3D của khung xơ mướp trong đĩa petri có thước tỉ lệ milimet.',
    roleInSystem:
      'Làm tầng lọc cơ học sơ cấp giữ cặn lơ lửng, phân phối đều dòng nước đầu vào và đóng vai trò bộ khung xương (scaffold) chịu lực giúp cố định các hạt/sợi keratin không bị nén chặt dưới áp lực dòng chảy.',
    fabricationMethod: [
      'Tuyển chọn xơ mướp khô có mật độ sợi đồng đều, loại bỏ vỏ và hạt.',
      'Rửa sạch và xử lý kiềm nhẹ ở nồng độ thích hợp để loại bỏ hemicellulose, lignin dư thừa và tạp chất tự nhiên.',
      'Rửa trung hòa bằng nước cất, sấy định hình và cắt thành các khối trụ vừa khít đường kính trong của buồng lọc.',
    ],
    observedCharacteristics: [
      'Mạng lưới lỗ xốp thông nhau tự nhiên giúp dòng nước thấm qua dễ dàng với độ sụt áp thấp.',
      'Độ bền cơ học tốt trong môi trường ngập nước, hoàn toàn có khả năng phân hủy sinh học sau khi hết vòng đời sử dụng.',
      'Bề mặt sợi giàu nhóm hydroxyl (-OH) thuận lợi cho việc liên kết với pha keratin.',
    ],
    colorHex: '#C89D66',
  },
  {
    id: 'biocomposite',
    code: 'MATERIAL C · DUAL BIO-COMPOSITE',
    title: 'BIO-COMPOSITE CORE',
    vietnameseTitle: 'Vật liệu kép Bio-Composite (Cellulose – Keratin)',
    sourceMaterial: 'Tổ hợp lai hóa giữa khung xương Cellulose xơ mướp và nền Keratin hoạt hóa.',
    targetPartId: 'biocomposite-layer',
    layerNumber: 3,
    imagePath: '/src/assets/images/biocomposite_cartridge_1791561704181.jpg',
    imageAlt: 'Lõi lọc trụ tròn Bio-Composite kết hợp khung xơ mướp và nền keratin trên giá đỡ phòng thí nghiệm',
    microstructureNote:
      'Ảnh minh họa lõi lọc nguyên mẫu kết hợp cấu trúc khung xốp xơ mướp được tẩm phủ và cố định pha keratin.',
    roleInSystem:
      'Giải quyết bài toán cốt lõi của vật liệu lọc sinh học rời: vừa giữ được diện tích bề mặt tiếp xúc của keratin, vừa duy trì độ thông thoáng thủy lực của khung xơ mướp, ngăn ngừa hiện tượng tắc nghẽn cục bộ hoặc rửa trôi vật liệu.',
    fabricationMethod: [
      'Đặt khung cellulose xơ mướp đã xử lý bề mặt vào khuôn trụ định hình.',
      'Đưa hệ phân tán/sợi keratin đã hoạt hóa thâm nhập vào toàn bộ mạng lưới lỗ xốp của khung xơ mướp.',
      'Cố định cấu trúc hai pha và sấy ổn định để tạo thành viên/lõi lọc mô-đun đồng nhất, dễ dàng lắp vào cột lọc.',
    ],
    observedCharacteristics: [
      'Dạng khối trụ mô-đun tiêu chuẩn hóa, thuận tiện tháo lắp và thay thế nhanh trong buồng lọc.',
      'Kết hợp ưu điểm cơ học của sợi thực vật và hoạt tính bề mặt của protein sợi động vật/con người.',
      'Hướng tới chu trình vật liệu tuần hoàn: thu hồi phụ phẩm -> chế tạo lõi lọc -> hoàn nguyên hoặc phân hủy sinh học an toàn.',
    ],
    colorHex: '#174D35',
  },
];

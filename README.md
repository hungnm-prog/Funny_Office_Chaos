# 🏢 Funny Office Chaos - Virtual Office Game

Hệ thống game công sở trực tuyến mô phỏng không gian văn phòng thời gian thực, hỗ trợ tùy biến nhân vật, di chuyển tương tác, trò chuyện công khai, bản đồ thu phóng và các khu vực giải trí phong phú.

---

## ✨ Tính Năng Nổi Bật

### 1. Tạo Hình Nhân Vật Đa Dạng (Character Customization)
- **Tùy biến đầy đủ**:
  - **Màu tóc**: 10+ màu sắc tự nhiên và thời trang cùng 6 kiểu tóc (Ngắn, Đuôi ngựa, Bob, Xoăn, Vuốt nhọn, Dài).
  - **Màu da**: 6 tông màu da tự nhiên, đồng bộ trên toàn bộ khuôn mặt, cổ và bàn tay.
  - **Bộ đồ & Trang phục**: 10+ màu sắc với các kiểu dáng: Vest công sở, Sơ mi thanh lịch, Áo phông năng động, Hoodie trẻ trung, Váy công sở.
  - **Màu mắt**: Đôi mắt lấp lánh với các sắc thái: Nâu đen, Hổ phách, Sapphire, Lục bảo, Amethyst, Ruby.
  - **Phụ kiện**: Kính mắt trí thức, Tai nghe chống ồn, Thẻ nhân viên công ty.
  - Nút **"Ngẫu Nhiên"** giúp khởi tạo nhanh diện mạo độc đáo.
- **Lưu trữ nhân vật**:
  - Tự động lưu thông tin vào `localStorage`. Những lần truy cập tiếp theo **không cần tạo lại nhân vật**, hệ thống giữ nguyên nhân vật và vị trí đã chọn trước đó.

### 2. Không Gian Công Sở Trực Quan (3 Khu Vực)
- **Khu Làm Việc (Work Zone)**:
  - Đúng **20 chỗ ngồi (Bàn 01 đến Bàn 20)**.
  - Mỗi bàn có máy tính màn hình kép / laptop hiển thị code, biểu đồ và tài liệu.
  - Trang bị đầy đủ ghế công thái học, chậu cây xanh, tách cà phê bốc khói.
  - Nhấp vào ghế để nhân vật ngồi vào làm việc.
- **Khu Vui Chơi & Giải Trí (Recreation Zone)**:
  - **Khu Câu Cá Zen**: Hồ cá Koi trong nhà, gợn sóng nước, hoa sen và bến cầu gỗ. Nhấp ghế trên cầu để ngồi câu cá và bấm nút **"Giật cần"** để câu cá chép vàng/cá Koi.
  - **Khu Đánh Bài**: Sòng bài giải trí với 2 bàn Poker / Tiến Lên bọc nhung xanh, chip cược và bài tây.
  - **Khu Xem Phim 4K**: Màn chiếu rạp phim khổng lồ phát trailer, ghế sofa rạp cao cấp, bắp rang bơ và nút bật/tắt âm thanh.
  - **Khu Chơi Game Arcade**: Máy thùng điện tử neon (Street Fighter, Pac-Man, F1 Racing), khu ghế sofa PlayStation 5 và kính VR.
- **Khu Bếp & Căn Tin (Kitchen & Dining Zone)**:
  - **3 bàn ăn lớn, mỗi bàn có 8 chỗ ngồi (tổng cộng 24 chỗ ngồi)**.
  - Quầy bếp với máy pha cà phê espresso Ý, tủ lạnh đồ uống, lò vi sóng, đĩa hoa quả, snack và trà sữa trân châu.

### 3. Hiển Thị Thời Gian Giờ Việt Nam (GMT+7)
- Cố định ở **góc bên trái khung hình**.
- Cập nhật thời gian thực theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh`), hiển thị giờ:phút:giây, thứ trong tuần, ngày/tháng/năm và trạng thái (Buổi Sáng, Giờ Nghỉ Trưa, Buổi Chiều, Buổi Tối).

### 4. Di Chuyển & Tương Tác Bằng Chuột
- Nhấp chuột vào bất kỳ vị trí nào trên sàn để nhân vật di chuyển tới đó với hoạt ảnh bước chân và hiệu ứng vòng sóng lan tỏa (click ripple).
- Nhấp vào các ghế để nhân vật ngồi vào và thực hiện hành động tương ứng (làm việc, ăn uống, câu cá, xem phim, chơi game, đánh bài).

### 5. Chat Công Khai & Bong Bóng Chat Luôn Hiển Thị
- Bong bóng chat luôn hiển thị ở trên đầu nhân vật và **không bị mất đi**.
- **Tag tên đồng nghiệp**: Gõ ký tự `@` hoặc bấm nút **"Tag"** trên thanh chat để hiển thị danh sách gợi ý đồng nghiệp.
- Thanh chat được đặt cố định ở **phía dưới màn hình và cách đều 2 bên**.

### 6. Phóng To / Thu Nhỏ & Bản Đồ (Minimap)
- Cuộn con chuột (mouse wheel) để phóng to/thu nhỏ khung hình mượt mà.
- Hiển thị thanh zoom góc dưới với icon **`+`**, **`-`** và nút đặt lại 100%.
- Cửa sổ **Bản đồ công sở (Minimap)** ở góc dưới bên phải hiển thị toàn cảnh các khu vực, chấm vị trí thời gian thực của các nhân vật và các nút chuyển nhanh góc nhìn tới từng khu vực.

### 7. Thoát, Lưu Vị Trí & Trạng Thái Nhân Vật
- Khi thoát website (hoặc bấm nút **"Thoát Website"**), vị trí tọa độ `(X, Y)` của nhân vật sẽ được lưu lại.
- Trạng thái khi thoát sẽ chuyển thành **Offline**.
- Khi truy cập lại, nhân vật xuất hiện chính xác tại vị trí cũ và chuyển trạng thái thành **Online**.
- Dễ dàng đổi qua lại giữa **Online 🟢**, **Busy 🟡**, và **Offline ⚫** trên thanh chat.

### 8. Thông Báo Toast (Góc Trên Bên Phải)
- **Nội dung ngắn**: Tự động ẩn sau 10 giây (kèm thanh đếm ngược tiến trình).
- **Nội dung dài**: Hiển thị icon **drop down** để bấm xem đầy đủ nội dung.
- **Lướt sang phải để ẩn**: Với thông báo dài, không tự động ẩn sau 10s mà ẩn bằng thao tác lướt/kéo toast sang bên phải (swipe to right).

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local)

1. **Clone repository**:
   ```bash
   git clone https://github.com/hungnm-prog/Funny_Office_Chaos.git
   cd Funny_Office_Chaos
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Chạy máy chủ phát triển (Development)**:
   ```bash
   npm run dev
   ```
   Mở trình duyệt truy cập: `http://localhost:5173/`

4. **Chạy máy chủ sản xuất (Production Node + WebSocket)**:
   ```bash
   npm run build
   npm start
   ```
   Mở trình duyệt truy cập: `http://localhost:3000/`

---

## 🐳 Triển Khai Docker

```bash
docker build -t funny-office-chaos .
docker run -p 3000:3000 funny-office-chaos
```

---

## 🌐 Triển Khai Lên Render / Railway

Dự án đã có sẵn cấu hình [`render.yaml`](./render.yaml) và [`Dockerfile`](./Dockerfile):
1. Kết nối kho lưu trữ GitHub này với **[Render.com](https://render.com)** hoặc **[Railway.app](https://railway.app)**.
2. Chọn loại **Web Service**, hệ thống sẽ tự động nhận diện `render.yaml`, chạy lệnh build `npm install && npm run build` và khởi động với `npm start` (`node server.js`).

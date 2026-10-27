# AMOR ÆTERNUM — Thiệp anniversary tím pastel V-Fold

## 1. MỞ NGAY

1. Giải nén ZIP.
2. Nhấp đúp `index.html` (trên Chrome hoặc Edge).
3. **Click 1**: mở hai cánh origami hai bên, **Click 2**: mở hai góc tam giác, **Click 3**: mở viên phong ấn và thư center pop-up 3D.
4. Thư hiện khoảng **5 giây** sau khi bung xong, video sẽ **phóng từ chính giữa**. Video xong sẽ ra **nền đen, chữ tím glow và đôi nhẫn xoay**.

Bạn cũng có thể click trực tiếp lên tấm thiệp hoặc bấm nút bên dưới. Nhạc bắt đầu từ lần click đầu, chạy trong suốt lúc mở thiệp và đọc thư, sau đó giảm âm khi video bắt đầu.

Bản ZIP chứa **video demo ~4,6 giây** và **bản nhạc nền gốc demo ~35 giây** nên có thể thử toàn bộ hiệu ứng ngay cả khi chưa thay file cá nhân.

## 2. ĐỔI LỜI CHÚC Ở GIỮA — TRỰC TIẾP TRONG CODE

Mở **`config.js`** bằng Notepad, VS Code, hoặc bất kỳ trình soạn thảo nào. Tìm:

```javascript
letterTitle: 'Khanh Binh, my forever',
letterParagraphs: [
  'Bình yêu của anh,',
  'Nếu được chọn lại giữa muôn vạn cuộc đời, anh vẫn sẽ tìm em...',
  'Cảm ơn em vì đã đến...',
  'Happy anniversary, my love...'
],
signature: 'Forever yours ♡',
readDurationMs: 5000,
```

Sửa chữ giữa dấu nháy đơn, **giữ lại dấu phẩy** giữa các phần tử. Nếu nội dung dài, tăng `readDurationMs` thành `8000`, `10000`, v.v. và kiểm tra trên điện thoại xem cần cuộn chữ không.

Lời cuối cũng sửa ngay trong `config.js`:

```javascript
finalTitle: 'Happy anniversary',
finalLineOne: 'I love you, my wife',
finalName: 'Le Ha Khanh Binh',
```

## 3. CHÈN ĐÚNG NHẠC REMIX BẠN MUỐN

**Không có bản thu “Ngại ngùng không thể cất lời remix” trong ZIP**, vì bạn chưa cung cấp tệp nhạc và bản thu đó được bảo hộ quyền tác giả. Có sẵn đường dẫn cấu hình:

```javascript
musicFile: 'assets/audio/ngai-ngung-khong-the-cat-loi-remix.mp3',
```

Hãy đặt **bản MP3 được phép sử dụng** vào đúng thư mục và tên tệp đó. Tải lại `index.html`: chương trình sẽ ưu tiên nhạc của bạn. Nếu tệp này chưa có, trang tự phát `assets/audio/pastel-waltz-demo.mp3` (bản gốc demo tự tổng hợp, **không phải** bài remix yêu cầu).

Tùy chỉnh âm lượng qua `musicVolume: 0.56`. Trình duyệt thường chỉ cho phép nhạc tự phát **sau thao tác click của người dùng**, do đó nhạc khởi động ở lần click 1.

## 4. CHÈN VIDEO LOCAL CỦA HAI BẠN

Cách A — đặt sẵn trong ZIP trước khi gửi thiệp:

- Copy video MP4 của hai bạn thành `assets/video/our-story.mp4`.
- Hoặc sửa `videoFile` trong `config.js` thành tên tương ứng, ví dụ `assets/video/le-ha-khanh-binh.mp4`.
- Khuyên dùng **H.264 + AAC, định dạng .mp4** để chạy trên Chrome/Edge/Safari.

Cách B — khi đang xem thiệp: bấm **“Đổi video trên máy”**, chọn MP4 của mình. Cách này không sửa source file; nếu muốn gửi thiệp cho người khác thì dùng cách A.

Khi chưa có `our-story.mp4`, hệ thống dùng `demo-memory.mp4` ngắn, sau đó vẫn tự chuyển đến lời cuối và đôi nhẫn.

## 5. HÌNH ẢNH THẬT, KHÔNG PHẢI HÌNH GEN

Bìa và các mặt giấy dùng ảnh tác phẩm mỹ thuật thật từ **Wikimedia Commons**: Botticelli, Raphael, Canova và minh họa tranh La Mã cổ. File `assets/images/art_manifest.json` ghi đầy đủ link gốc, tác giả và trạng thái bản quyền; `IMAGE_CREDITS.md` ghi chi tiết.

Do môi trường đóng gói có giới hạn truy cập Internet, ZIP chứa **đường dẫn chính xác đến ảnh thật**, nhưng **chưa kèm file JPEG**. Khi mở với Internet, ảnh sẽ được tải từ Commons. Nếu muốn cả ảnh cũng dùng được offline, hãy chạy khi máy có Internet:

```bash
python tools/download_art.py
```

Script tải đủ **6 file ảnh JPEG thật** vào `assets/images/`. Sau đó nhấp đúp `index.html` xem offline hoàn chỉnh. Bạn có thể gửi lại thư mục đã có ảnh dưới dạng ZIP.

Trên Windows, nếu lệnh `python` không chạy thì thử `py tools/download_art.py`.

## 6. ĐÔI NHẪN BẠCH KIM PIAGET

Cuối thiệp có **hai chiếc nhẫn platinum dạng vòng 3D xoay thực sự** bằng mã Canvas (không phải GIF, ảnh AI hay hiệu ứng giả xoay cả một ảnh phẳng). Tông bóng bạc/bạch kim, vòng đính đá lấp lánh lấy cảm hứng từ Piaget platinum wedding bands. Đây là **hình minh họa bằng code theo phong cách Piaget**, không phải ảnh sản phẩm Piaget chính hãng hay một mã sản phẩm Piaget được xác nhận.

Trang tham khảo chính thức: <https://www.piaget.com/us-en/wedding/platinum-wedding-rings>

Nếu muốn dùng ảnh chụp **đúng mẫu nhẫn Piaget mà bạn đã chọn**, cần bổ sung ảnh sản phẩm bạn có quyền sử dụng; hiện tại mẫu render 3D bằng code.

## 7. KIẾN TRÚC & THIẾT KẾ

- `index.html` — giao diện và từng mặt giấy.
- `styles.css` — màu tím pastel, hoa văn giấy, CSS perspective / clip-path / flap transformations, neon text.
- `config.js` — **tất cả chữ, thời gian 5s, đường dẫn nhạc, video**.
- `app.js` — trạng thái 3-click, điều khiển audio/video, Canvas mesh animation nhẫn.
- `assets/audio/pastel-waltz-demo.mp3` — demo sound tự tổng hợp.
- `assets/video/demo-memory.mp4` — demo video do code dựng, **không phải video kỷ niệm thật**.
- `assets/images/art_manifest.json` — nguồn tranh dùng online hoặc tải xuống offline.
- `tools/download_art.py` — downloader ảnh theo giấy phép nguồn.

Các khung art phía ngoài sẽ có thể xem online; hệ thống vẫn có hiệu ứng mở giấy nếu Internet tạm thời không khả dụng. Không dùng framework hoặc npm.

**Lưu ý:** Thư viện Google Fonts được gọi online, không có mạng sẽ fallback sang Georgia/serif mặc định. Dùng Chrome hoặc Edge trên desktop và điện thoại. Video local không bị upload lên bất kỳ server nào.

## 8. THAM KHẢO HIỆU ỨNG

- Video mẫu do bạn tải lên (tham chiếu cách gấp giấy, không tái sử dụng frame).
- ZumaTools V-fold: <https://zumatools.com/pop-up-card-maker/>
- Neta 3D Storybook: <https://neta.art/app/3d-storybook-builder>

Thiệp được code thủ công theo ý tưởng mở nhiều lớp, không sao chép mã nguồn của các trang tham khảo.

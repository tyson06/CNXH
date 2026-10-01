# QUIZ — Website trắc nghiệm

Website trắc nghiệm tĩnh chạy bằng HTML, CSS, JavaScript và Vite. Có hai bộ đề mẫu: Ôn tập phần 1 (40 câu) và Ôn tập phần 2 (45 câu). Đáp án được khóa sau khi chọn; người học chủ động bấm **Câu tiếp** để chuyển câu.

## Công nghệ

- HTML, CSS và JavaScript modules, không dùng frontend framework.
- Vite cho máy chủ phát triển và đóng gói production.
- JSON riêng cho dữ liệu câu hỏi; sessionStorage giữ lượt làm bài và kết quả trong trình duyệt.
- Không có backend, database hay API ngoài. Dữ liệu hiện tại là dữ liệu mẫu.

## Chạy trên máy

Cài Node.js 22.12 trở lên và pnpm, sau đó trong thư mục dự án chạy:

```bash
pnpm install
pnpm dev
```

Mở URL mà Vite in ra (thường là `http://localhost:5173/`). Dừng máy chủ bằng `Ctrl+C`.

## Build và xem thử

```bash
pnpm build
pnpm preview
```

Build production được tạo trong `dist/`. Lệnh preview phục vụ chính bản build đó; mở URL nó in ra.

## Deploy GitHub Pages

Vite đã cấu hình `base: '/quiz-web/'` cho Project Site `https://tyson06.github.io/quiz-web/`.

1. Tạo repository GitHub `tyson06/quiz-web` nếu chưa có.
2. Commit và push toàn bộ project lên nhánh `main`.
3. Vào **Settings → Pages** của repository.
4. Ở **Build and deployment**, chọn **GitHub Actions**.
5. Đẩy commit lên `main`; workflow `.github/workflows/deploy.yml` tự build và publish thư mục `dist/`.

Project có sẵn `pnpm-lock.yaml`; GitHub Actions dùng `pnpm install --frozen-lockfile` để cài chính xác phiên bản dependency đã khóa.

## Chỉnh sửa câu hỏi

- Sửa `src/data/review1.json` để thay 40 câu của Ôn tập phần 1.
- Sửa `src/data/review2.json` để thay 45 câu của Ôn tập phần 2.

Mỗi câu có dạng:

```json
{
  "id": 1,
  "question": "Nội dung câu hỏi",
  "answers": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
  "correct": 1,
  "note": "Giải thích riêng cho câu này"
}
```

`answers` phải có đúng 4 chuỗi, `correct` là index từ `0` đến `3`, còn `note` có thể để trống. Giữ số lượng chính xác để vượt qua kiểm tra dữ liệu. Có thể dùng ký tự `\n` trong chuỗi note để ngắt dòng. Các đường dẫn mở rộng cho media có thể bổ sung trong schema dữ liệu.

## Đổi giao diện

- Màu chủ đạo, màu đúng/sai, nền, font, bo góc và bóng: biến CSS ở đầu `src/css/global.css`.
- Logo chữ: nội dung `QUIZ` và ô chữ `Q` trong `index.html`, `quiz.html`, `result.html`.
- Favicon: thay `assets/favicon.svg` và cập nhật liên kết favicon trong các trang HTML nếu đổi tên.
- Nền hình ảnh: chỉnh `background` trong `src/css/global.css`.

## Cấu trúc

```text
index.html / quiz.html / result.html  # ba trang của website
src/css/global.css                    # theme và responsive layout
src/js/config.js                      # danh sách đề, URL JSON, khóa lưu trữ
src/js/data.js                        # nạp và kiểm tra dữ liệu
src/js/storage.js                     # lưu lượt làm bài và kết quả
src/js/home.js / quiz.js / result.js  # logic riêng từng trang
src/data/review1.json                 # 40 câu mẫu
src/data/review2.json                 # 45 câu mẫu
assets/favicon.svg                    # favicon
vite.config.js                        # build multi-page, GitHub Pages base path
.github/workflows/deploy.yml          # build và deploy tự động lên GitHub Pages
```

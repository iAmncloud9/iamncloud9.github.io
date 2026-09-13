# Hướng dẫn bổ sung nội dung portfolio

Tài liệu này là checklist quản trị nội dung cho portfolio terminal. Phần lớn nội
dung cá nhân được tập trung tại `src/data/portfolio.ts` để không phải chỉnh trực
tiếp giao diện.

## 1. Bản đồ nội dung

| Nội dung trên terminal | Command kiểm tra | Vị trí cập nhật |
| --- | --- | --- |
| Tên, alias, role, địa điểm, nơi làm việc, giới thiệu | `cat information/profile.txt` | `profile` trong `src/data/portfolio.ts` |
| Kinh nghiệm làm việc theo timeline dọc | `cat experiences/career.tree` | `experiences` |
| Email, GitHub, LinkedIn, Facebook, X | `cat contact/socials.txt` | `contacts` trong `src/data/portfolio.ts` |
| Thành tích lab, CTF, research | `cat achievements/pwned.txt` | `achievements.pwned` |
| Chứng chỉ và khóa học | `cat achievements/certifications.txt` | `achievements.certifications` |
| Hành trình quá khứ, hiện tại, tương lai | `cat path/journey.tree` | `journey` |
| Danh sách và nội dung bài viết | `ls blogs`, sau đó `cat blogs/<slug>.blog` | `blogs` |
| Tên file xuất hiện trong filesystem | `tree` | `portfolioFiles` |

Các giá trị `profile.alias` hiện cũng được dùng để tạo prompt, home path, brand,
metadata, tên tác giả blog và footer. Thay alias tại đây sẽ cập nhật đồng bộ các
vị trí đó.

## 2. Cập nhật Information

Sửa object `profile`:

```ts
export const profile = {
  name: "Tên đầy đủ",
  alias: "iamncloud9",
  role: "Vai trò hoặc career path mong muốn",
  location: "Thành phố, quốc gia",
  workplace: "Công ty, trường học hoặc Independent",
  bio: "Một câu giới thiệu ngắn về bạn",
};
```

Giữ `alias` ở dạng phù hợp với Linux username: chữ thường, không có khoảng trắng
và nên tránh ký tự đặc biệt.

## 3. Cập nhật Contact

Mỗi liên hệ gồm ba trường:

```ts
{
  label: "linkedin",
  value: "linkedin.com/in/username",
  href: "https://www.linkedin.com/in/username"
}
```

- `label`: tên ngắn hiển thị trong terminal và dùng bởi `open <label>`.
- `value`: nội dung khách truy cập nhìn thấy.
- `href`: URL thực được mở khi người dùng click hoặc chạy `open`.
- Email phải dùng dạng `mailto:name@example.com` trong `href`.
- Giữ `label` duy nhất. Footer lấy source URL từ contact có label `github`.

Có thể thêm mạng xã hội mới bằng cách thêm một object mới vào mảng `contacts`.

## 4. Cập nhật Achievements

Thêm hoặc xóa chuỗi trong hai danh sách:

```ts
export const achievements = {
  pwned: [
    "Hack The Box — Machine name — 2026",
    "CTF name — Top 10 — 2026",
  ],
  certifications: [
    "Certification name — Issuer — 2026",
  ],
};
```

Không cần sửa component khi chỉ bổ sung thành tích. Số thứ tự được giao diện tạo
tự động.

## 5. Cập nhật hành trình

Mỗi milestone trong `journey` có cấu trúc:

```ts
{
  period: "NOW",
  title: "Going deeper",
  description: "Pentesting · Blue Team · Security projects",
  current: true,
}
```

- `period`: mốc thời gian ngắn, ví dụ `2022`, `NOW`, `NEXT`.
- `title`: tên giai đoạn.
- `description`: kỹ năng, công việc hoặc mục tiêu của giai đoạn.
- `current`: đặt `true` để làm nổi bật mốc hiện tại. Nên chỉ có một mốc `true`.

Có thể thêm bao nhiêu milestone tùy ý; giao diện sẽ render theo thứ tự trong mảng.

## 6. Cập nhật Experiences

Mỗi công việc trong `experiences` có cấu trúc:

```ts
{
  organization: "Tên công ty hoặc tổ chức",
  startDate: "01/2025",
  endDate: "Now",
  role: "Penetration Tester",
  description: "Mô tả ngắn về phạm vi và trách nhiệm công việc.",
  highlights: [
    "Kết quả hoặc đóng góp nổi bật thứ nhất.",
    "Dự án, cải tiến bảo mật hoặc công nghệ đã sử dụng.",
  ],
  current: true,
}
```

- Sắp xếp phần tử mới nhất hoặc công việc hiện tại lên đầu mảng.
- `startDate` và `endDate` dùng định dạng `MM/YYYY`; công việc hiện tại dùng `Now`.
- Không nhập `duration`. Giao diện tự tính duration từ hai mốc trên và tự cập nhật
  `Now` khi tháng hiện tại thay đổi.
- Duration tính theo tháng lịch, bao gồm cả tháng bắt đầu và tháng kết thúc.
  Ví dụ tại 09/2026: `10/2025 — Now` hiển thị `1 year`, còn
  `08/2026 — 11/2026` hiển thị `4 months`.
- `description` mô tả trách nhiệm và phạm vi công việc.
- `highlights` nên ưu tiên kết quả đo lường được, tác động hoặc thành tựu nổi bật.
- Đặt `current: true` cho công việc hiện tại để node timeline phát sáng.
- Timeline chạy dọc và tự mở rộng; có thể thêm nhiều experience mà không bị giới hạn chiều ngang.

Kiểm tra sau khi cập nhật:

```text
ls experiences
cat experiences/car<Tab>
cat experiences/career.tree
```

## 7. Quản lý bài blog

Blog hiện không phải là file `.blog` vật lý. Mỗi bài là một object trong mảng
`blogs`; terminal tự biểu diễn object đó thành `<slug>.blog`, còn Next.js tự tạo
route `/blog/<slug>`.

Ba bài mẫu hiện có:

- `hello-world.blog`
- `first-box-pwned.blog`
- `learning-roadmap.blog`

Tất cả vẫn chứa nội dung placeholder và cần được thay trước khi publish.

### Template bài viết mới

Thêm object sau vào mảng `blogs`:

```ts
{
  slug: "ten-bai-viet",
  title: "Tiêu đề bài viết",
  date: "2026-09-12",
  readTime: "5 min read",
  summary: "Mô tả ngắn dùng ở metadata và phần mở đầu.",
  tags: ["security", "writeup"],
  sections: [
    {
      heading: "Phần mở đầu",
      body: [
        "Đoạn văn thứ nhất.",
        "Đoạn văn thứ hai.",
      ],
    },
    {
      heading: "Bài học rút ra",
      body: [
        "Nội dung phần tiếp theo.",
      ],
    },
  ],
},
```

Quy ước:

- `slug` phải duy nhất, viết thường, dùng dấu gạch ngang và không thêm `.blog`.
- `date` dùng định dạng `YYYY-MM-DD`.
- `readTime` hiện được nhập thủ công.
- Mỗi phần trong `sections` tự xuất hiện trong mục “ON THIS PAGE”.
- Mỗi phần tử `body` là một đoạn văn riêng.
- Không cần thêm route hoặc thêm filename vào `portfolioFiles` cho blog.

Sau khi thêm object có slug `my-first-writeup`, các vị trí sau tự hoạt động:

```text
ls blogs
cat blogs/my-first-writeup.blog
open my-first-writeup
/blog/my-first-writeup
```

## 8. Thêm file terminal tĩnh

Ví dụ muốn thêm `contact/pgp-key.txt`:

1. Đăng ký filename trong `portfolioFiles`:

```ts
contact: ["socials.txt", "pgp-key.txt"],
```

2. Nếu nội dung có cấu trúc, khai báo dữ liệu tương ứng trong
   `src/data/portfolio.ts`.
3. Thêm nhánh render cho file trong hàm `renderFile` tại
   `src/components/TerminalPortfolio.tsx`.
4. Kiểm tra các hành vi:

```text
ls contact
tree
cat contact/pgp<Tab>
cat contact/pgp-key.txt
```

Ngay sau bước 1, `ls`, `tree` và autocomplete đã tự nhận file mới. Bước 3 là bắt
buộc để `cat` biết cách hiển thị nội dung thay vì báo file không tồn tại.

Nếu muốn thêm cả thư mục cấp một mới, cần mở rộng `portfolioFiles` và thêm phần
render nội dung tương ứng. Các thư mục sâu hơn một cấp hiện chưa phải cấu trúc
nội dung mặc định.

## 9. Quy trình cập nhật khuyến nghị

1. Tạo branch hoặc commit checkpoint trước khi sửa nhiều nội dung.
2. Chạy development server:

```powershell
cd "D:\Pentest\Portfolio"
npm.cmd run dev
```

3. Sửa `src/data/portfolio.ts` và quan sát hot reload tại
   `http://localhost:3000`.
4. Kiểm tra nội dung bằng chính terminal:

```text
cat information/profile.txt
cat experiences/career.tree
cat contact/socials.txt
cat achievements/pwned.txt
cat achievements/certifications.txt
cat path/journey.tree
ls blogs
cat blogs/<slug>.blog
```

5. Tìm placeholder hoặc liên kết mẫu còn sót:

```powershell
rg -n "\[PLACEHOLDER\]|YOUR NAME|YOUR LOCATION|YOUR WORKPLACE|you@example.com|your-profile|your-handle" src
```

6. Chạy kiểm tra tuần tự, không chạy song song trên Windows:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

7. Mở lại trang chủ và ít nhất một URL `/blog/<slug>` trước khi deploy.

## 10. Checklist trước khi publish

- Không còn `[PLACEHOLDER]`, `[YOUR ...]` hoặc email/link mẫu.
- Tất cả `href` mở đúng tài khoản mong muốn.
- Chỉ có một journey milestone được đánh dấu `current: true`.
- Experiences đã được sắp xếp mới nhất trước và không còn dữ liệu mẫu.
- Mọi blog có slug duy nhất, ngày hợp lệ và nội dung đầy đủ.
- `cat blogs/<slug>.blog` điều hướng đúng.
- `Tab` autocomplete nhận các file mới.
- `npm.cmd run typecheck` và `npm.cmd run build` đều pass.

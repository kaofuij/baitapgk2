# Ứng Dụng Quản Lý Sinh Viên

Ứng dụng web đơn giản để quản lý thông tin sinh viên sử dụng Flask và SQLite.

## Tính Năng

- Xem danh sách sinh viên
- Thêm sinh viên mới
- Chỉnh sửa thông tin sinh viên
- Xóa sinh viên

## Cài Đặt

1. Clone repository này:

```
git clone <repository-url>
cd <repository-folder>
```

2. Tạo và kích hoạt môi trường ảo (tùy chọn nhưng khuyến nghị):

```
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. Cài đặt các phụ thuộc cần thiết:

```
pip install -r requirements.txt
```

## Chạy Ứng Dụng

1. Chạy ứng dụng:

```
python app.py
```

2. Mở trình duyệt và truy cập `http://127.0.0.1:5000`

## Cấu Trúc Cơ Sở Dữ Liệu

Ứng dụng sử dụng SQLite với bảng Student có các trường sau:
- id: Khóa chính, tự động tăng
- name: Họ và tên sinh viên
- email: Địa chỉ email
- phone: Số điện thoại
- address: Địa chỉ
- date_of_birth: Ngày sinh
- created_at: Ngày tạo bản ghi 
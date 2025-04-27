from http.server import HTTPServer, SimpleHTTPRequestHandler
import socket

def get_local_ip():
    try:
        # Lấy địa chỉ IP của máy
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

# Cấu hình server
port = 8000
server_address = ('', port)
local_ip = get_local_ip()

# Khởi tạo HTTP server
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

print(f"""
Server đang chạy tại:
- Địa chỉ local: http://localhost:{port}
- Địa chỉ mạng LAN: http://{local_ip}:{port}

Các thiết bị trong cùng mạng có thể truy cập qua địa chỉ: http://{local_ip}:{port}
Để dừng server, nhấn Ctrl+C
""")

# Chạy server
httpd.serve_forever() 
// Khởi tạo users trong localStorage nếu chưa có
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Hàm đăng ký
function register(event) {
    event.preventDefault();
    
    // Lấy thông tin đăng nhập
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Lấy thông tin sinh viên
    const fullname = document.getElementById('fullname').value;
    const studentId = document.getElementById('studentId').value;
    const phone = document.getElementById('phone').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const address = document.getElementById('address').value;

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return false;
    }

    // Lấy danh sách users
    const users = JSON.parse(localStorage.getItem('users'));

    // Kiểm tra username đã tồn tại
    if (users.find(user => user.username === username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return false;
    }

    // Kiểm tra email đã tồn tại
    if (users.find(user => user.email === email)) {
        alert('Email đã được sử dụng!');
        return false;
    }

    // Thêm user mới với thông tin sinh viên
    const newUser = {
        username,
        email,
        password,
        role: 'student',
        studentInfo: {
            fullname,
            studentId,
            phone,
            dateOfBirth,
            address,
            email
        }
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công!');
    window.location.href = 'login.html';
    return false;
}

// Hàm đăng nhập
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Lấy danh sách users
    const users = JSON.parse(localStorage.getItem('users'));

    // Tìm user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'profile.html'; // Chuyển đến trang thông tin cá nhân
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }

    return false;
}

// Hàm kiểm tra đăng nhập
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
    }
    return JSON.parse(currentUser);
}

// Hàm đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Kiểm tra đăng nhập trên các trang cần bảo vệ
if (window.location.pathname.endsWith('index.html') || 
    window.location.pathname.endsWith('add.html') ||
    window.location.pathname.endsWith('profile.html')) {
    checkAuth();
} 
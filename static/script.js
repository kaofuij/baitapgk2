// Lưu trữ dữ liệu trong localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];

// Dữ liệu mẫu cho sinh viên
const sampleStudentData = {
    studentId: 'DTC1',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '04-04-1999',
    birthplace: 'Hà nội',
    gender: 'Nam',
    ethnicity: 'Kinh',
    gpa: '3.63',
    ranking: 'Xuất sắc',
    grades: [
        { id: 1, code: 'ATT1', name: 'An toàn thông tin đại cương', credits: 3, score: 8.5, letterGrade: 'A', gradePoint: 4 },
        { id: 2, code: 'CNTBM', name: 'Công nghệ và thiết bị mạng', credits: 3, score: 7.1, letterGrade: 'B', gradePoint: 3 },
        { id: 3, code: 'LTW', name: 'Lập trình web', credits: 3, score: 9.4, letterGrade: 'A', gradePoint: 4 }
    ]
};

// Hiển thị danh sách sinh viên
function displayStudents() {
    const studentList = document.getElementById('studentList');
    if (!studentList) return;

    studentList.innerHTML = '';
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone || ''}</td>
            <td>${student.address || ''}</td>
            <td>${student.date_of_birth || ''}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editStudent(${index})">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${index})">Xóa</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}

// Thêm sinh viên mới
function addStudent(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const student = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        date_of_birth: formData.get('date_of_birth')
    };

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    
    alert('Đã thêm sinh viên thành công!');
    window.location.href = 'index.html';
    return false;
}

// Xóa sinh viên
function deleteStudent(index) {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
    }
}

// Hiển thị thông tin sinh viên
function displayStudentInfo(student) {
    document.getElementById('studentId').textContent = student.studentId;
    document.getElementById('studentName').textContent = student.fullName;
    document.getElementById('studentDob').textContent = student.dateOfBirth;
    document.getElementById('studentBirthplace').textContent = student.birthplace;
    document.getElementById('studentGender').textContent = student.gender;
    document.getElementById('studentEthnicity').textContent = student.ethnicity;
    document.getElementById('studentGPA').textContent = student.gpa;
    document.getElementById('studentRanking').textContent = student.ranking;
}

// Hiển thị bảng điểm
function displayGrades(grades) {
    const tbody = document.getElementById('studentGradesList');
    tbody.innerHTML = '';
    
    grades.forEach((grade, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${grade.code}</td>
            <td>${grade.name}</td>
            <td>${grade.credits}</td>
            <td>${grade.score}</td>
            <td>${grade.letterGrade}</td>
            <td>${grade.gradePoint}</td>
        `;
        tbody.appendChild(row);
    });
}

// Hiển thị modal chi tiết sinh viên
function showStudentDetail(studentId) {
    // Trong thực tế, bạn sẽ lấy dữ liệu từ server dựa vào studentId
    const student = sampleStudentData; // Giả sử đây là dữ liệu từ server

    document.getElementById('fullName').value = student.fullName;
    document.getElementById('shortName').value = student.fullName.split(' ').pop();
    // Điền thêm các trường khác...

    const modal = new bootstrap.Modal(document.getElementById('studentDetailModal'));
    modal.show();
}

// Lưu thông tin chi tiết sinh viên
function saveStudentDetails() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        shortName: document.getElementById('shortName').value,
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value,
        fatherPhone: document.getElementById('fatherPhone').value,
        motherPhone: document.getElementById('motherPhone').value,
        email: document.getElementById('email').value
    };

    // Trong thực tế, bạn sẽ gửi formData lên server
    console.log('Saving student details:', formData);
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('studentDetailModal'));
    modal.hide();
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    displayStudents();
    displayStudentInfo(sampleStudentData);
    displayGrades(sampleStudentData.grades);
});

// Xử lý upload ảnh
document.getElementById('avatarUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('studentAvatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Xử lý đăng nhập sinh viên
function handleStudentLogin(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('loginStudentId').value;
    const password = document.getElementById('loginPassword').value;

    // Lấy danh sách sinh viên đã đăng ký
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    // Kiểm tra thông tin đăng nhập
    const student = students.find(s => s.studentId === studentId && s.password === password);
    
    if (student) {
        // Lưu thông tin sinh viên đang đăng nhập
        localStorage.setItem('currentStudent', JSON.stringify(student));
        // Chuyển đến trang sinh viên
        window.location.href = 'student.html';
    } else {
        alert('Mã sinh viên hoặc mật khẩu không đúng!');
    }
}

// Xử lý đăng ký sinh viên
function handleStudentRegister(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('regStudentId').value;
    const fullName = document.getElementById('regFullName').value;
    const email = document.getElementById('regEmail').value;
    const dob = document.getElementById('regDob').value;
    const gender = document.getElementById('regGender').value;
    const birthplace = document.getElementById('regBirthplace').value;
    const ethnicity = document.getElementById('regEthnicity').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    // Lấy danh sách sinh viên hiện có
    const students = JSON.parse(localStorage.getItem('students')) || [];

    // Kiểm tra mã sinh viên đã tồn tại
    if (students.some(s => s.studentId === studentId)) {
        alert('Mã sinh viên đã tồn tại!');
        return;
    }

    // Tạo đối tượng sinh viên mới
    const newStudent = {
        studentId,
        fullName,
        email,
        dateOfBirth: dob,
        gender,
        birthplace,
        ethnicity,
        password
    };

    // Thêm sinh viên mới vào danh sách
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));

    // Thông báo đăng ký thành công
    alert('Đăng ký tài khoản thành công!');
    
    // Reset form
    document.getElementById('registerForm').reset();
}

// Kiểm tra trạng thái đăng nhập khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    const currentStudent = localStorage.getItem('currentStudent');
    if (currentStudent && window.location.pathname.includes('student.html')) {
        // Nếu đã đăng nhập và đang ở trang sinh viên
        const student = JSON.parse(currentStudent);
        // Hiển thị thông tin sinh viên
        displayStudentInfo(student);
    }
}); 
// Định nghĩa các lớp (classes) theo hướng OOP

// Lớp Person - lớp cơ sở (cha)
class Person {
    constructor(id, fullName, dateOfBirth, birthplace, gender, ethnicity, email) {
        this.id = id;
        this.fullName = fullName; 
        this.dateOfBirth = dateOfBirth;
        this.birthplace = birthplace;
        this.gender = gender;
        this.ethnicity = ethnicity;
        this.email = email || '';
    }

    getInfo() {
        return {
            id: this.id,
            fullName: this.fullName,
            dateOfBirth: this.dateOfBirth,
            birthplace: this.birthplace,
            gender: this.gender,
            ethnicity: this.ethnicity,
            email: this.email
        };
    }
}

// Lớp Student - kế thừa từ Person
class Student extends Person {
    constructor(studentId, fullName, dateOfBirth, birthplace, gender, ethnicity, email) {
        super(studentId, fullName, dateOfBirth, birthplace, gender, ethnicity, email);
        this.studentId = studentId; // Đảm bảo có thuộc tính studentId để tương thích với code cũ
    }

    getGrades(gradeManager) {
        return gradeManager.getStudentGrades(this.id);
    }

    getTotalCredits(gradeManager) {
        const grades = this.getGrades(gradeManager);
        return grades.reduce((sum, grade) => sum + grade.credits, 0);
    }

    getGPA(gradeManager) {
        const grades = this.getGrades(gradeManager);
        const totalCredits = this.getTotalCredits(gradeManager);
        
        if (totalCredits === 0) return '0.00';
        
        let weightedSum = 0;
        grades.forEach(grade => {
            weightedSum += grade.totalScore * grade.credits;
        });
        
        const gpa = (weightedSum / totalCredits).toFixed(2);
        return isNaN(gpa) ? '0.00' : gpa;
    }
}

// Lớp Course (Môn học)
class Course {
    constructor(courseCode, courseName, credits, semester) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credits = credits;
        this.semester = semester;
    }

    getInfo() {
        return {
            courseCode: this.courseCode,
            courseName: this.courseName,
            credits: this.credits,
            semester: this.semester
        };
    }
}

// Lớp Grade (Điểm)
class Grade extends Course {
    constructor(studentId, courseCode, courseName, credits, semester, attendanceScore, midtermScore, finalScore) {
        super(courseCode, courseName, credits, semester);
        this.studentId = studentId;
        this.attendanceScore = attendanceScore;
        this.midtermScore = midtermScore;
        this.finalScore = finalScore;
        this.totalScore = this.calculateTotalScore();
        this.letterGrade = this.calculateLetterGrade();
    }

    calculateTotalScore() {
        const total = (this.attendanceScore * 0.1) + (this.midtermScore * 0.3) + (this.finalScore * 0.6);
        return Math.round(total * 10) / 10;
    }

    calculateLetterGrade() {
        const score = this.totalScore;
        if (score >= 8.5) return 'A';
        if (score >= 7.0) return 'B';
        if (score >= 5.5) return 'C';
        if (score >= 4.0) return 'D';
        return 'F';
    }

    getGradeBadgeColor() {
        switch(this.letterGrade) {
            case 'A': return 'success';
            case 'B': return 'primary';
            case 'C': return 'info';
            case 'D': return 'warning';
            case 'F': return 'danger';
            default: return 'secondary';
        }
    }

    getInfo() {
        return {
            ...super.getInfo(),
            studentId: this.studentId,
            attendanceScore: this.attendanceScore,
            midtermScore: this.midtermScore,
            finalScore: this.finalScore,
            totalScore: this.totalScore,
            letterGrade: this.letterGrade
        };
    }
}

// Lớp quản lý (Manager) - Interface
class Manager {
    constructor() {
        if (this.constructor === Manager) {
            throw new Error("Cannot instantiate abstract class");
        }
    }
    
    getAll() { throw new Error("Method 'getAll()' must be implemented"); }
    getById(id) { throw new Error("Method 'getById()' must be implemented"); }
    add(item) { throw new Error("Method 'add()' must be implemented"); }
    update(id, data) { throw new Error("Method 'update()' must be implemented"); }
    delete(id) { throw new Error("Method 'delete()' must be implemented"); }
}

// Lớp StudentManager
class StudentManager extends Manager {
    constructor() {
        super();
        this.students = JSON.parse(localStorage.getItem('students')) || [];
    }

    getAll() {
        return this.students.map(studentData => 
            new Student(
                studentData.studentId,
                studentData.fullName,
                studentData.dateOfBirth,
                studentData.birthplace,
                studentData.gender,
                studentData.ethnicity,
                studentData.email
            )
        );
    }

    getById(studentId) {
        const studentData = this.students.find(s => s.studentId === studentId);
        if (!studentData) return null;
        
        return new Student(
            studentData.studentId,
            studentData.fullName,
            studentData.dateOfBirth,
            studentData.birthplace,
            studentData.gender,
            studentData.ethnicity,
            studentData.email
        );
    }

    add(student) {
        if (!(student instanceof Student)) {
            throw new Error("Only Student objects can be added");
        }
        
        this.students.push(student.getInfo());
        this.save();
        return true;
    }

    update(studentId, data) {
        const index = this.students.findIndex(s => s.studentId === studentId);
        if (index === -1) return false;
        
        this.students[index] = {...this.students[index], ...data};
        this.save();
        return true;
    }

    delete(studentId) {
        this.students = this.students.filter(s => s.studentId !== studentId);
        this.save();
        return true;
    }

    remove(studentId) {
        this.students = this.students.filter(s => s.studentId !== studentId);
        this.save();
        return true;
    }

    save() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    search(term) {
        term = term.toLowerCase();
        return this.getAll().filter(student => 
            student.studentId.toLowerCase().includes(term) ||
            student.fullName.toLowerCase().includes(term)
        );
    }
}

// Lớp GradeManager
class GradeManager extends Manager {
    constructor() {
        super();
        this.grades = JSON.parse(localStorage.getItem('grades')) || [];
    }

    getAll() {
        return this.grades.map(gradeData => 
            new Grade(
                gradeData.studentId,
                gradeData.courseCode,
                gradeData.courseName,
                gradeData.credits,
                gradeData.semester,
                gradeData.attendanceScore,
                gradeData.midtermScore,
                gradeData.finalScore
            )
        );
    }

    getById(id) {
        // ID của grade có thể là kết hợp của studentId, courseCode và semester
        const [studentId, courseCode, semester] = id.split('-');
        const gradeData = this.grades.find(g => 
            g.studentId === studentId && 
            g.courseCode === courseCode && 
            g.semester === semester
        );
        
        if (!gradeData) return null;
        
        return new Grade(
            gradeData.studentId,
            gradeData.courseCode,
            gradeData.courseName,
            gradeData.credits,
            gradeData.semester,
            gradeData.attendanceScore,
            gradeData.midtermScore,
            gradeData.finalScore
        );
    }

    getStudentGrades(studentId) {
        return this.getAll().filter(grade => grade.studentId === studentId);
    }

    add(grade) {
        if (!(grade instanceof Grade)) {
            throw new Error("Only Grade objects can be added");
        }
        
        const id = `${grade.studentId}-${grade.courseCode}-${grade.semester}`;
        const existingGrade = this.getById(id);
        
        if (existingGrade) {
            return this.update(id, grade.getInfo());
        }
        
        this.grades.push(grade.getInfo());
        this.save();
        return true;
    }

    update(id, data) {
        const [studentId, courseCode, semester] = id.split('-');
        const index = this.grades.findIndex(g => 
            g.studentId === studentId && 
            g.courseCode === courseCode && 
            g.semester === semester
        );
        
        if (index === -1) return false;
        
        this.grades[index] = {...this.grades[index], ...data};
        this.save();
        return true;
    }

    delete(id) {
        const [studentId, courseCode, semester] = id.split('-');
        this.grades = this.grades.filter(g => 
            !(g.studentId === studentId && 
              g.courseCode === courseCode && 
              g.semester === semester)
        );
        this.save();
        return true;
    }

    deleteAllForStudent(studentId) {
        this.grades = this.grades.filter(g => g.studentId !== studentId);
        this.save();
        return true;
    }

    save() {
        localStorage.setItem('grades', JSON.stringify(this.grades));
    }
}

// Tạo instances của các manager
const studentManager = new StudentManager();
const gradeManager = new GradeManager();

// Khởi tạo admin account nếu chưa có
if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify({
        username: 'admin',
        password: 'admin123'
    }));
}

// Kiểm tra đăng nhập admin
function checkAdminAuth() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        window.location.href = 'admin-login.html';
    }
}

// Xử lý đăng nhập admin
function handleAdminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'admin-token');
        window.location.href = 'admin.html';
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

// Đăng xuất admin
function adminLogout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}

// Reset toàn bộ dữ liệu trong localStorage
function resetData() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác!')) {
        // Lưu lại token đăng nhập hiện tại
        const adminToken = localStorage.getItem('adminToken');
        
        // Xóa toàn bộ localStorage
        localStorage.clear();
        
        // Đặt lại token admin để không bị đăng xuất
        localStorage.setItem('adminToken', adminToken);
        
        // Khởi tạo lại localStorage
        localStorage.setItem('students', JSON.stringify([]));
        localStorage.setItem('grades', JSON.stringify([]));
        localStorage.setItem('users', JSON.stringify([]));
        localStorage.setItem('sampleDataInitialized', 'false');
        
        // Tải lại trang
        window.location.reload();
    }
}

// Load danh sách sinh viên
function loadStudentList() {
    // Lấy danh sách sinh viên từ StudentManager
    const students = studentManager.getAll();
    
    // Lấy danh sách người dùng đã đăng ký từ localStorage (nếu có)
    const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kết hợp danh sách sinh viên từ cả hai nguồn
    // Chỉ thêm những sinh viên mới từ registeredUsers mà chưa có trong students
    registeredUsers.forEach(user => {
        // Kiểm tra xem sinh viên này đã tồn tại trong danh sách students chưa
        const exists = students.some(student => student.studentId === user.username);
        
        if (!exists) {
            // Lấy thông tin sinh viên từ cấu trúc dữ liệu đúng
            const studentInfo = user.studentInfo || {};
            
            // Tạo đối tượng sinh viên mới từ dữ liệu đăng ký
            const newStudent = new Student(
                user.username, // Sử dụng username làm studentId
                studentInfo.fullname || user.username || 'Chưa cập nhật',
                studentInfo.dateOfBirth || '',
                studentInfo.address || 'Chưa cập nhật',
                studentInfo.gender || 'Chưa cập nhật',
                studentInfo.ethnicity || 'Kinh',
                user.email || studentInfo.email || ''
            );
            
            // Thêm vào StudentManager
            studentManager.add(newStudent);
        }
    });
    
    // Lấy lại danh sách sinh viên đã cập nhật
    const updatedStudents = studentManager.getAll();
    
    // Tiếp tục hiển thị danh sách
    const tableBody = document.getElementById('studentTableBody');
    if (!tableBody) {
        return;
    }
    
    tableBody.innerHTML = '';

    // Thêm nút để xóa sinh viên không xác định
    const hasUndefinedStudents = updatedStudents.some(student => student.studentId.includes("undefined"));
    if (hasUndefinedStudents) {
        const clearUndefinedBtn = document.createElement('div');
        clearUndefinedBtn.className = 'mb-3';
        clearUndefinedBtn.innerHTML = `
            <button onclick="clearUndefinedStudents()" class="btn btn-warning">
                <i class="fas fa-trash"></i> Xóa tất cả sinh viên không xác định
            </button>
        `;
        
        // Thêm nút vào trước bảng
        const tableContainer = tableBody.closest('.table-responsive');
        tableContainer.parentNode.insertBefore(clearUndefinedBtn, tableContainer);
    }

    if (updatedStudents.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="9" class="text-center">Không có sinh viên nào</td>`;
        tableBody.appendChild(emptyRow);
    } else {
        updatedStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.fullName}</td>
            <td>${student.email || 'Chưa cập nhật'}</td>
            <td>${student.dateOfBirth}</td>
            <td>${student.birthplace}</td>
            <td>${student.gender}</td>
            <td>${student.ethnicity}</td>
            <td>
                    <div class="btn-group">
                <button onclick="showGradeModal('${student.studentId}')" class="btn btn-primary btn-sm">
                    <i class="fas fa-edit"></i> Cập nhật điểm
                </button>
                        <button onclick="viewCredits('${student.studentId}')" class="btn btn-info btn-sm">
                            <i class="fas fa-eye"></i> Xem tín chỉ
                        </button>
                        <button onclick="deleteStudent('${student.studentId}')" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    }
}

// Hiển thị modal cập nhật điểm
function showGradeModal(studentId) {
    const student = studentManager.getById(studentId);
    if (!student) {
        alert('Không tìm thấy thông tin sinh viên!');
        return;
    }

    document.getElementById('gradeStudentId').value = studentId;
    document.getElementById('gradeStudentName').textContent = student.fullName;
    document.getElementById('gradeStudentIdDisplay').textContent = studentId;
    
    // Reset form
    document.getElementById('gradeForm').reset();
    document.getElementById('totalScore').textContent = '0.0';
    document.getElementById('letterGrade').textContent = '-';
    
    // Load bảng điểm hiện tại
    loadStudentGrades(studentId);

    // Hiển thị modal bằng Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('gradeModal'));
    modal.show();
}

// Load bảng điểm của sinh viên
function loadStudentGrades(studentId) {
    const studentGrades = gradeManager.getStudentGrades(studentId);
    const tableBody = document.getElementById('gradeTableBody');
    tableBody.innerHTML = '';

    studentGrades.forEach((grade, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${grade.courseCode}</td>
            <td>${grade.courseName}</td>
            <td>${grade.credits}</td>
            <td>${grade.attendanceScore}</td>
            <td>${grade.midtermScore}</td>
            <td>${grade.finalScore}</td>
            <td>${grade.totalScore}</td>
            <td><span class="badge bg-${grade.getGradeBadgeColor()}">${grade.letterGrade}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Xem chi tiết các môn tín chỉ của sinh viên
function viewCredits(studentId) {
    const student = studentManager.getById(studentId);
    if (!student) {
        alert('Không tìm thấy thông tin sinh viên!');
        return;
    }
    
    const studentGrades = gradeManager.getStudentGrades(studentId);
    const totalCredits = student.getTotalCredits(gradeManager);
    let gpa = student.getGPA(gradeManager);
    
    // Kiểm tra nếu GPA là NaN thì hiển thị 0.00
    if (isNaN(gpa) || gpa === 'NaN') {
        gpa = '0.00';
    }
    
    // Tạo modal hiển thị thông tin chi tiết
    let modalHTML = `
    <div class="modal fade" id="creditsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-info text-white">
                    <h5 class="modal-title">Chi tiết tín chỉ và điểm</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="student-info p-3 mb-3 bg-light rounded">
                        <h5>${student.fullName} <small class="text-muted">(${student.studentId})</small></h5>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="bg-primary text-white rounded p-2 me-2">
                                        <i class="fas fa-graduation-cap"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold">Tổng số tín chỉ</div>
                                        <div class="fs-4">${totalCredits}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="bg-success text-white rounded p-2 me-2">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold">Điểm trung bình tích lũy</div>
                                        <div class="fs-4">${gpa}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h6 class="mb-3">Danh sách các môn học:</h6>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã môn</th>
                                    <th>Tên môn học</th>
                                    <th>Số tín chỉ</th>
                                    <th>Điểm CC</th>
                                    <th>Điểm GK</th>
                                    <th>Điểm CK</th>
                                    <th>Tổng kết</th>
                                    <th>Điểm chữ</th>
                                </tr>
                            </thead>
                            <tbody>`;
    
    if (studentGrades.length === 0) {
        modalHTML += `
                                <tr>
                                    <td colspan="9" class="text-center">Chưa có dữ liệu điểm</td>
                                </tr>`;
    } else {
        studentGrades.forEach((grade, index) => {
            modalHTML += `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${grade.courseCode}</td>
                                    <td>${grade.courseName}</td>
                                    <td>${grade.credits}</td>
                                    <td>${grade.attendanceScore}</td>
                                    <td>${grade.midtermScore}</td>
                                    <td>${grade.finalScore}</td>
                                    <td>${grade.totalScore}</td>
                                    <td><span class="badge bg-${grade.getGradeBadgeColor()}">${grade.letterGrade}</span></td>
                                </tr>`;
        });
    }
    
    modalHTML += `
                            </tbody>
                            <tfoot>
                                <tr class="table-primary">
                                    <td colspan="3"><strong>Tổng số tín chỉ:</strong></td>
                                    <td><strong>${totalCredits}</strong></td>
                                    <td colspan="5"></td>
                                </tr>
                                <tr class="table-info">
                                    <td colspan="3"><strong>Điểm trung bình tích lũy:</strong></td>
                                    <td colspan="6"><strong>${gpa}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                </div>
            </div>
        </div>
    </div>`;
    
    // Thêm modal vào body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('creditsModal'));
    modal.show();
    
    // Xóa modal khỏi DOM sau khi đóng
    document.getElementById('creditsModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}

// Xóa sinh viên
function deleteStudent(studentId) {
    // Kiểm tra nếu studentId chứa "undefined"
    if (studentId.includes("undefined")) {
        alert("Không thể xóa sinh viên này vì thông tin không xác định!");
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa sinh viên có mã ${studentId}?`)) {
        try {
            // Xóa sinh viên khỏi hệ thống
            studentManager.remove(studentId);
            
            // Cập nhật lại giao diện
            loadStudentList();
            
            // Thông báo thành công
            alert('Đã xóa sinh viên thành công!');
        } catch (error) {
            console.error("Lỗi khi xóa sinh viên:", error);
            alert('Có lỗi xảy ra khi xóa sinh viên: ' + error.message);
        }
    }
}

// Tính điểm tổng kết và cập nhật giao diện
function calculateFinalScore() {
    const attendanceScore = parseFloat(document.getElementById('attendanceScore').value) || 0;
    const midtermScore = parseFloat(document.getElementById('midtermScore').value) || 0;
    const finalScore = parseFloat(document.getElementById('finalScore').value) || 0;

    // Tạo đối tượng Grade tạm thời để tính toán
    const tempGrade = new Grade(
        '',  // studentId - không quan trọng cho việc tính toán
        '',  // courseCode
        '',  // courseName
        0,   // credits
        '',  // semester
        attendanceScore,
        midtermScore,
        finalScore
    );

    document.getElementById('totalScore').textContent = tempGrade.totalScore.toFixed(1);

    const letterGradeElement = document.getElementById('letterGrade');
    letterGradeElement.textContent = tempGrade.letterGrade;
    letterGradeElement.className = `badge bg-${tempGrade.getGradeBadgeColor()}`;
}

// Lưu điểm mới
function saveGrade(event) {
    event.preventDefault();
    const studentId = document.getElementById('gradeStudentId').value;
    const courseCode = document.getElementById('courseCode').value;
    const courseName = document.getElementById('courseName').value;
    const credits = parseInt(document.getElementById('credits').value);
    const semester = document.getElementById('semester').value;
    const attendanceScore = parseFloat(document.getElementById('attendanceScore').value);
    const midtermScore = parseFloat(document.getElementById('midtermScore').value);
    const finalScore = parseFloat(document.getElementById('finalScore').value);

    // Tạo đối tượng Grade mới
    const newGrade = new Grade(
        studentId,
        courseCode,
        courseName,
        credits,
        semester,
        attendanceScore,
        midtermScore,
        finalScore
    );

    // Lưu điểm
    gradeManager.add(newGrade);

    // Cập nhật bảng điểm
    loadStudentGrades(studentId);

    // Reset form
    document.getElementById('gradeForm').reset();
    document.getElementById('totalScore').textContent = '0.0';
    document.getElementById('letterGrade').textContent = '-';
    document.getElementById('letterGrade').className = 'badge bg-primary';

    // Thông báo thành công
    alert('Đã lưu điểm thành công!');
}

// Tìm kiếm sinh viên
function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value;
    const filteredStudents = studentManager.search(searchTerm);
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';

    filteredStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.fullName}</td>
            <td>${student.dateOfBirth}</td>
            <td>${student.birthplace}</td>
            <td>${student.gender}</td>
            <td>${student.ethnicity}</td>
            <td>
                <div class="btn-group">
                <button onclick="showGradeModal('${student.studentId}')" class="btn btn-primary btn-sm">
                    <i class="fas fa-edit"></i> Cập nhật điểm
                </button>
                    <button onclick="viewCredits('${student.studentId}')" class="btn btn-info btn-sm">
                        <i class="fas fa-eye"></i> Xem tín chỉ
                    </button>
                    <button onclick="deleteStudent('${student.studentId}')" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Hiển thị modal thêm sinh viên mới
function showAddStudentModal() {
    // Tạo modal hiển thị form thêm sinh viên
    let modalHTML = `
    <div class="modal fade" id="addStudentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">Thêm sinh viên mới</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addStudentForm">
                        <div class="mb-3">
                            <label for="new_student_id" class="form-label">Mã sinh viên</label>
                            <input type="text" class="form-control" id="new_student_id" required>
                        </div>
                        <div class="mb-3">
                            <label for="new_fullname" class="form-label">Họ và tên</label>
                            <input type="text" class="form-control" id="new_fullname" required>
                        </div>
                        <div class="mb-3">
                            <label for="new_dob" class="form-label">Ngày sinh</label>
                            <input type="date" class="form-control" id="new_dob" required>
                        </div>
                        <div class="mb-3">
                            <label for="new_birthplace" class="form-label">Nơi sinh</label>
                            <input type="text" class="form-control" id="new_birthplace" required>
                        </div>
                        <div class="mb-3">
                            <label for="new_gender" class="form-label">Giới tính</label>
                            <select class="form-select" id="new_gender" required>
                                <option value="">-- Chọn giới tính --</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="new_ethnicity" class="form-label">Dân tộc</label>
                            <input type="text" class="form-control" id="new_ethnicity" value="Kinh">
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" class="btn btn-success">Thêm sinh viên</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
    
    // Thêm modal vào body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Xử lý submit form
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy thông tin từ form
        const studentId = document.getElementById('new_student_id').value;
        const fullName = document.getElementById('new_fullname').value;
        const dateOfBirth = document.getElementById('new_dob').value;
        const birthplace = document.getElementById('new_birthplace').value;
        const gender = document.getElementById('new_gender').value;
        const ethnicity = document.getElementById('new_ethnicity').value;
        
        // Kiểm tra studentId có trùng không
        if (studentManager.getById(studentId)) {
            alert('Mã sinh viên đã tồn tại!');
            return;
        }
        
        // Tạo đối tượng sinh viên mới
        const newStudent = new Student(
            studentId,
            fullName,
            dateOfBirth,
            birthplace,
            gender,
            ethnicity,
            ''
        );
        
        // Thêm sinh viên vào hệ thống
        try {
            studentManager.add(newStudent);
            
            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
            modal.hide();
            
            // Cập nhật lại giao diện
            loadStudentList();
            
            // Thông báo thành công
            alert('Đã thêm sinh viên thành công!');
        } catch (error) {
            console.error("Lỗi khi thêm sinh viên:", error);
            alert('Có lỗi xảy ra khi thêm sinh viên: ' + error.message);
        }
    });
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
    modal.show();
    
    // Xóa modal khỏi DOM sau khi đóng
    document.getElementById('addStudentModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}

// Hàm xóa tất cả sinh viên không xác định (có id chứa chuỗi "undefined")
function clearUndefinedStudents() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sinh viên không xác định?')) {
        try {
            // Lấy danh sách sinh viên
            const allStudents = studentManager.getAll();
            let removedCount = 0;
            
            // Lọc và xóa những sinh viên có id chứa "undefined"
            allStudents.forEach(student => {
                if (student.studentId.includes("undefined")) {
                    studentManager.remove(student.studentId);
                    removedCount++;
                }
            });
            
            // Cập nhật lại giao diện
            loadStudentList();
            
            // Thông báo kết quả
            if (removedCount > 0) {
                alert(`Đã xóa ${removedCount} sinh viên không xác định!`);
            } else {
                alert('Không tìm thấy sinh viên không xác định nào!');
            }
        } catch (error) {
            console.error("Lỗi khi xóa sinh viên không xác định:", error);
            alert('Có lỗi xảy ra: ' + error.message);
        }
    }
}

// Hàm khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập admin
    checkAdminAuth();
    
    // Load danh sách sinh viên
    loadStudentList();
    
    // Tạo các listener cho các sự kiện
    if (document.getElementById('searchInput')) {
        document.getElementById('searchInput').addEventListener('input', searchStudents);
    }
}); 
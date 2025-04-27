from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Cấu hình cơ sở dữ liệu
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-123'  # Cần thiết cho flash messages

db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    date_of_birth = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Student {self.name}>'

# Tạo bảng trong cơ sở dữ liệu
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    students = Student.query.all()
    return render_template('index.html', students=students)

@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        address = request.form['address']
        date_of_birth = datetime.strptime(request.form['date_of_birth'], '%Y-%m-%d') if request.form['date_of_birth'] else None
        
        student = Student(name=name, email=email, phone=phone, address=address, date_of_birth=date_of_birth)
        
        try:
            db.session.add(student)
            db.session.commit()
            flash('Đã thêm sinh viên thành công!', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            print(f"Error: {e}")
            flash('Có lỗi xảy ra. Vui lòng thử lại!', 'error')
            
    return render_template('add.html')

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    student = Student.query.get_or_404(id)
    
    if request.method == 'POST':
        student.name = request.form['name']
        student.email = request.form['email']
        student.phone = request.form['phone']
        student.address = request.form['address']
        student.date_of_birth = datetime.strptime(request.form['date_of_birth'], '%Y-%m-%d') if request.form['date_of_birth'] else None
        
        try:
            db.session.commit()
            flash('Đã cập nhật sinh viên thành công!', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            print(f"Error: {e}")
            flash('Có lỗi xảy ra. Vui lòng thử lại!', 'error')
            
    return render_template('edit.html', student=student)

@app.route('/delete/<int:id>')
def delete(id):
    student = Student.query.get_or_404(id)
    
    try:
        db.session.delete(student)
        db.session.commit()
        flash('Đã xóa sinh viên thành công!', 'success')
    except Exception as e:
        print(f"Error: {e}")
        flash('Có lỗi xảy ra. Vui lòng thử lại!', 'error')
        
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
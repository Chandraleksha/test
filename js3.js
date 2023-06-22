const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Define the Student schema
const studentSchema = new mongoose.Schema({
  name: String,
  grades: [Number]
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

class GradeChecker {
  static checkPassOrFail(student) {
    const grades = student.grades;
    const averageGrade = grades.reduce((total, grade) => total + grade, 0) / grades.length;

    if (averageGrade >= 60) {
      return "Pass";
    } else {
      return "Fail";
    }
  }
}

function inputStudents() {
  const students = [];

  const numStudents = parseInt(prompt("Enter the number of students:"));

  for (let i = 0; i < numStudents; i++) {
    const name = prompt(`Enter the name of student ${i + 1}:`);
    const gradeInput = prompt(`Enter the grades of student ${i + 1} :`);
    const grades = gradeInput.split(",").map(Number);

    const student = new Student({ name, grades });
    students.push(student);
  }

  return students;
}

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://chandraleksharbsc22:Leksha2704@cluster0.tc4tsng.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function insertStudents(students) {
  try {
    const result = await Student.insertMany(students);
    console.log(`Inserted ${result.length} students`);
  } catch (error) {
    console.error('Failed to insert students:', error);
  }
}

async function updateStudent(name, updatedGrades) {
  try {
    const result = await Student.updateOne({ name }, { grades: updatedGrades });
    console.log(`Updated ${result.nModified} student`);
  } catch (error) {
    console.error('Failed to update student:', error);
  }
}

async function deleteStudent(name) {
  try {
    const result = await Student.deleteOne({ name });
    console.log(`Deleted ${result.deletedCount} student`);
  } catch (error) {
    console.error('Failed to delete student:', error);
  }
}

async function readStudents() {
  try {
    const students = await Student.find();
    console.log('Students:');
    students.forEach((student) => {
      console.log(`${student.name} - Grades: ${student.grades.join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to read students:', error);
  }
}

async function performCRUD() {
  const studentsInput = inputStudents();

  await connectToDatabase();
  await insertStudents(studentsInput);
  await readStudents();

  const nameToUpdate = prompt('Enter the name of the student to update: ');
  const updatedGrades = prompt('Enter the updated grades (comma-separated): ')
    .split(',')
    .map(Number);
  await updateStudent(nameToUpdate, updatedGrades);

  const nameToDelete = prompt('Enter the name of the student to delete: ');
  await deleteStudent(nameToDelete);

  await readStudents();

  // Disconnect from the database
  mongoose.disconnect();
}

performCRUD();
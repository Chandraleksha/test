const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

class Student {
  constructor(name, grades) {
    this.name = name;
    this.grades = grades;
  }

  getName() {
    return this.name;
  }

  getGrades() {
    return this.grades;
  }
}

class GradeChecker {
  static checkPassOrFail(student) {
    const grades = student.getGrades();
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

    const student = new Student(name, grades);
    students.push(student);
  }

  return students;
}

function checkStudents(students) {
  for (const student of students) {
    const result = GradeChecker.checkPassOrFail(student);
    console.log(`Result for ${student.getName()}: ${result}`);
  }
}

async function performCRUD() {
  const studentsInput = inputStudents();

  const uri = 'mongodb+srv://chandraleksharbsc22:Leksha2704@cluster0.tc4tsng.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('lek');
    const collection = db.collection('test2');

    // Create
    await collection.insertMany(studentsInput);
    console.log('Students inserted');

    // Read
    const students = await collection.find().toArray();
    console.log('Students:');
    students.forEach((student) => {
      console.log(`${student.name} - Grades: ${student.grades.join(', ')}`);
    });

    // Update
    const nameToUpdate = prompt('Enter the name of the student to update: ');
    const updatedGrades = prompt('Enter the updated grades (comma-separated): ')
      .split(',')
      .map(Number);
    await collection.updateOne({ name: nameToUpdate }, { $set: { grades: updatedGrades } });
    console.log('Student updated');

    // Delete
    const nameToDelete = prompt('Enter the name of the student to delete: ');
    await collection.deleteOne({ name: nameToDelete });
    console.log('Student deleted');

    // Read again
    const updatedStudents = await collection.find().toArray();
    console.log('Updated Students:');
    updatedStudents.forEach((student) => {
      console.log(`${student.name} - Grades: ${student.grades.join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    client.close();
  }
}

performCRUD();
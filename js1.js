const prompt=require('prompt-sync')();
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
  
  const studentsInput = inputStudents();
  checkStudents(studentsInput);
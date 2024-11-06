const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3000;

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/students", async (req, res) => {
  console.log(req.query.school);

  const school = req.query.school;

  if (school) {
    const filteredStudents = studentList.filter(
      (student) => student.school === school
    );
    res.json(filteredStudents);
    return;
  }

  if (req.query) {
    const propertyNames = Object.keys(req.query);
    let students = await prisma.student.findMany();
    for (const propertyName of propertyNames) {
      students = students.filter(
        (student) => student[propertyName] === req.query[propertyName]
      );
    }
    res.json(students);
    return;
  }
  res.json(studentList);
});

app.get("/students/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const student = await prisma.student.findUnique({
    select: { sId: true },
    where: {
      sId: id,
    },
  });
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
}); //colon means its a url param

app.post("/students", async (req, res) => {
  console.log(req.body);

  const students = await prisma.student.create({
    data: req.body,
  });
  res.json(students);
});

// app.delete("/students/:id", (req, res) => {
//     const id = req.params.id;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

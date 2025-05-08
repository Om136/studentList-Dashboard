import type { Student, StudentFormData } from "../types/student";

// Initial mock data
const initialMockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    course: "Computer Science",
    enrollmentDate: "2025-01-15",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 College St, Academic City, AC 12345",
    gpa: 3.8,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    course: "Mathematics",
    enrollmentDate: "2025-02-01",
    phoneNumber: "+1 (555) 987-6543",
    address: "456 University Ave, Academic City, AC 12345",
    gpa: 3.9,
    status: "active",
  },
  {
    id: "3",
    name: "Emily Brown",
    email: "emily@example.com",
    course: "Physics",
    enrollmentDate: "2025-02-15",
    phoneNumber: "+1 (555) 246-8135",
    address: "789 Science Blvd, Academic City, AC 12345",
    gpa: 3.5,
    status: "active",
  },
];

// Helper function to get students from localStorage or initialize with mock data
const getStoredStudents = (): Student[] => {
  const stored = localStorage.getItem("students");
  if (!stored) {
    localStorage.setItem("students", JSON.stringify(initialMockStudents));
    return initialMockStudents;
  }
  return JSON.parse(stored);
};

// Helper function to save students to localStorage
const saveStudents = (students: Student[]): void => {
  localStorage.setItem("students", JSON.stringify(students));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getStudents: async () => {
    await delay(500); // Simulate network delay
    return getStoredStudents();
  },

  addStudent: async (studentData: StudentFormData) => {
    await delay(500);
    const newStudent: Student = {
      id: Date.now().toString(),
      ...studentData,
      enrollmentDate: new Date().toISOString().split("T")[0],
    };

    const students = getStoredStudents();
    students.push(newStudent);
    saveStudents(students);

    return newStudent;
  },

  updateStudent: async (id: string, studentData: Partial<StudentFormData>) => {
    await delay(500);
    const students = getStoredStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");

    students[index] = {
      ...students[index],
      ...studentData,
    };
    saveStudents(students);
    return students[index];
  },

  deleteStudent: async (id: string) => {
    await delay(500);
    const students = getStoredStudents();
    const newStudents = students.filter((s) => s.id !== id);
    saveStudents(newStudents);
  },

  deleteMultipleStudents: async (ids: string[]) => {
    await delay(500);
    const students = getStoredStudents();
    const newStudents = students.filter((s) => !ids.includes(s.id));
    saveStudents(newStudents);
  },

  exportToCSV: async () => {
    const students = getStoredStudents();
    const headers = [
      "Name",
      "Email",
      "Course",
      "Enrollment Date",
      "Phone Number",
      "Address",
      "GPA",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...students.map((student) =>
        [
          student.name,
          student.email,
          student.course,
          student.enrollmentDate,
          student.phoneNumber,
          `"${student.address}"`,
          student.gpa,
          student.status,
        ].join(",")
      ),
    ].join("\n");

    return csvContent;
  },
};

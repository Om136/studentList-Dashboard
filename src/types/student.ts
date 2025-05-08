export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
  phoneNumber: string;
  address: string;
  gpa: number;
  status: string;
}

export type StudentFormData = Omit<Student, "id">;

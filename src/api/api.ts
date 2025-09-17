import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export interface Student {
  name: string;
  email: string;
  roll: string;
  batch: string;
  department: string;
  phone: string;
  admission_year: number;
  password?: string;
}

export interface StudentsResponse {
  success: boolean;
  students: Student[];
  totalStudents: number;
  paidStudents: number;
}

export const getStudents = async (): Promise<StudentsResponse> => {
  const response = await api.get("/students");
  return response.data;
};

// ... (other API functions remain the same)

// Register student
export const registerStudent = async (student: Student) => {
  const response = await api.post("/register", student);
  return response.data;
};

// Create Razorpay order
export const createOrder = async (roll: string, amount: number) => {
  const response = await api.post("/create-order", { roll, amount });
  return response.data;
};

// Verify Razorpay payment
export const verifyPayment = async (data: any) => {
  const response = await api.post("/verify-payment", data);
  return response.data;
};

// Send WhatsApp message
export const sendWhatsApp = async (phone: string, message: string) => {
  const response = await api.post("/send-whatsapp", { phone, message });
  return response.data;
};
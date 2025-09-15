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
}

export const registerStudent = async (student: Student) => {
  const response = await api.post("/register", student);
  return response.data;
};

export const createOrder = async (roll: string, amount: number) => {
  const response = await api.post("/create-order", { roll, amount });
  return response.data;
};

export const verifyPayment = async (data: any) => {
  const response = await api.post("/verify-payment", data);
  return response.data;
};

export const sendWhatsApp = async (phone: string, message: string) => {
  const response = await api.post("/send-whatsapp", { phone, message });
  return response.data;
};
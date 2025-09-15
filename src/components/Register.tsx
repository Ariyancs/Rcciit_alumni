import React, { useState } from "react";
import { registerStudent, createOrder, verifyPayment } from "../api/api";
import type { Student } from "../api/api";
import "./Register.css";

// This is a global interface for the Razorpay window object.
// We need to declare it to prevent TypeScript errors.
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Register: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    name: "",
    email: "",
    roll: "",
    batch: "",
    department: "",
    phone: "",
    admission_year: new Date().getFullYear(),
  });
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!student.name || !student.email || !student.roll || !student.batch || !student.department || !student.phone) {
      setMessage("Please fill out all required fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    setMessage("");
    return true;
  };

  const handlePayment = async (amount: number) => {
    try {
      // Call the backend to create a Razorpay order
      const { data } = await createOrder(student.roll, amount);

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual Key ID
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "RCCIIT Alumni Association",
        description: "Alumni Registration Fee",
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // Verify the payment on the backend
            const verificationResponse = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              roll: student.roll,
            });

            if (verificationResponse.success) {
              setMessage("Payment verified successfully!");
              setIsSuccess(true);
            } else {
              setMessage("Payment verification failed.");
              setIsSuccess(false);
            }
          } catch (error) {
            setMessage("Payment verification failed.");
            setIsSuccess(false);
          }
        },
        prefill: {
          name: student.name,
          email: student.email,
          contact: student.phone,
        },
        theme: {
          color: "#3498DB",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      setMessage("Failed to initiate payment. Please try again.");
      setIsSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);
    try {
      const res = await registerStudent(student);
      setMessage(`Student registered successfully! Now proceeding to payment.`);
      setIsSuccess(true);
      
      // Trigger payment after successful registration
      handlePayment(100); // Pass the amount in Rupees here
      
    } catch (err: any) {
      setMessage(`Error: ${err.response?.data?.error || err.message}`);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Alumni Registration</h1>
        <p>Join our alumni network and stay connected!</p>
      </div>

      {message && (
        <div className={`message-box ${isSuccess ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <input type="text" name="name" placeholder="Full Name" value={student.name} onChange={handleChange} className="form-input" disabled={isLoading}/>
        <input type="email" name="email" placeholder="Email Address" value={student.email} onChange={handleChange} className="form-input" disabled={isLoading}/>
        <input type="text" name="roll" placeholder="Roll Number" value={student.roll} onChange={handleChange} className="form-input" disabled={isLoading}/>
        <input type="text" name="batch" placeholder="Batch" value={student.batch} onChange={handleChange} className="form-input" disabled={isLoading}/>
        <input type="text" name="department" placeholder="Department" value={student.department} onChange={handleChange} className="form-input" disabled={isLoading}/>
        <input type="text" name="phone" placeholder="Phone Number" value={student.phone} onChange={handleChange} className="form-input" disabled={isLoading}/>
        <input type="number" name="admission_year" placeholder="Admission Year" value={student.admission_year} onChange={handleChange} className="form-input" disabled={isLoading}/>
        
        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Register Now"}
        </button>
      </form>
    </div>
  );
};

export default Register;
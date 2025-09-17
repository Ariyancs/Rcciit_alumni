import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../api/api';
import type { Student } from '../api/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [paidStudents, setPaidStudents] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { students, totalStudents, paidStudents } = await getStudents();
        setStudents(students);
        setTotalStudents(totalStudents);
        setPaidStudents(paidStudents);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Your portal to the alumni network.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Registrations</h3>
          <p>{totalStudents}</p>
        </div>
        <div className="summary-card paid-card">
          <h3>Paid Registrations</h3>
          <p>{paidStudents}</p>
        </div>
      </div>

      <div className="students-list">
        <h2>Registered Students</h2>
        <ul>
          {students.length > 0 ? (
            students.map((student, index) => (
              <li key={index} className="student-card">
                <h3>{student.name}</h3>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Roll:</strong> {student.roll}</p>
                <p><strong>Batch:</strong> {student.batch}</p>
              </li>
            ))
          ) : (
            <p>No students have registered yet.</p>
          )}
        </ul>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
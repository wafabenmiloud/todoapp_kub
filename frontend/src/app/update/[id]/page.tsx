"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../../create/page.module.css';
import Link from 'next/link';
import { FaArrowLeftLong } from "react-icons/fa6";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";
type Task = {
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
};

export default function UpdateTask() {
  const router = useRouter();
  const { id } = useParams();
  const [task, setTask] = useState<Task>({ title: '', description: '', status: 'PENDING' });

  useEffect(() => {
    if (id) {
      axios.get<Task>(`${API_BASE}/tasks/${id}`)
        .then(response => {
          setTask(response.data);
        })
        .catch(error => {
          console.error('Error fetching the task:', error);
        });
    }
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value as Task[keyof Task] });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/tasks/${id}`, task);
      router.push('/');
    } catch (error) {
      console.error('Error updating the task:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container0}>
         <Link href="/">
        <FaArrowLeftLong className={styles.styledLink} />
      </Link>
      </div>
      <h1 className={styles.header}>Update Note</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title:</label>
          <input
            name="title"
            value={task.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description:</label>
          <input
            name="description"
            value={task.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Status:</label>
          <select
            name="status"
            value={task.status}
            onChange={handleInputChange}
            required
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>Update</button>
      </form>
    </div>
  );
}

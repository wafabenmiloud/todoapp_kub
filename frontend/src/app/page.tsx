"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "./page.module.css";
import { MdEdit, MdAddCircle, MdClose, MdSearch } from "react-icons/md";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/tasks`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.containerWrapper0}>
      <div className={styles.containerWrapper1}>
        <div className={styles.container0}>
          <Link href="/create">
            <MdAddCircle className={styles.styledLink} />
          </Link>
        </div>

        <div className={styles.container1}>
          <h1 className={styles.header}>Notes</h1>
          <div className={styles.searchWrapper}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search . . ."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ul className={styles.taskListContainer}>
            {filteredTasks.map(({ id, title, description, status }) => (
              <li className={styles.liWrapper} key={id}>
                <MdClose
                  className={styles.deleteButton}
                  onClick={() => handleDelete(id)}
                />

                <div
                  className={`${styles.taskItem} ${styles[getStatusClass(status)]}`}
                >
                  <h2 className={styles.taskTitle}>{title}</h2>
                  
                  <p className={styles.taskDescription} dangerouslySetInnerHTML={{ __html: description }}/>
                  <p className={`${styles.taskStatus} ${styles[getStatusClass(status)]}`}>
                    {status}
                  </p>
                  <div className={styles.linksWrapper}>
                    <Link href={`/update/${id}`}>
                      <MdEdit className={styles.updateLink} />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.container02}>
          <Link href="/create">
            <MdAddCircle className={styles.styledLink} />
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

function getStatusClass(status: "PENDING" | "IN_PROGRESS" | "DONE"): string {
  switch (status) {
    case "PENDING":
      return "pending";
    case "IN_PROGRESS":
      return "inProgress";
    case "DONE":
      return "done";
    default:
      return "";
  }
}

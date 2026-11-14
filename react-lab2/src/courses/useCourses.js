// Lab day (AI required). This file ends up as the hook described in CONTRACT.md §4.
import { useState, useEffect } from "react";
import { apiFetch } from "../api/client.js";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch("/api/courses");
        if (!ignore) {
          setCourses(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseData) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseData,
    });
    setCourses((prev) => {
      const next = [...prev, created];
      return next.sort((a, b) => a.code.localeCompare(b.code));
    });
    return created;
  }

  return { courses, loading, error, addCourse };
}

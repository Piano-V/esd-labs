// Lab day (AI required): the Courses page — list + add. src/App.jsx renders it.
// You generate it with AI from CONTRACT.md, then audit and fix it (doc sections 10–14).
import { useState } from "react";
import { useCourses } from "./useCourses.js";
import { CoursesView } from "./CoursesView.jsx";

export function CoursesPage() {
  const { courses, loading, error, addCourse } = useCourses();

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [credits, setCredits] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await addCourse({
        code,
        title,
        department,
        credits: Number(credits),
        capacity: Number(capacity),
        description: description === "" ? null : description,
      });

      setCode("");
      setTitle("");
      setDepartment("");
      setCredits("");
      setCapacity("");
      setDescription("");
    } catch (err) {
      setFormError(err.message || "Failed to add course");
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="courses-page">
      <h1>Courses</h1>

      <CoursesView courses={courses} loading={loading} error={error} />

      <form onSubmit={handleSubmit} className="add-course-form">
        <h2>Add a course</h2>

        <div className="form-group">
          <label htmlFor="code">Code</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {fieldErrors.code && <p className="error">{fieldErrors.code}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {fieldErrors.title && <p className="error">{fieldErrors.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          {fieldErrors.department && (
            <p className="error">{fieldErrors.department}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="credits">Credits</label>
          <input
            id="credits"
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
          {fieldErrors.credits && <p className="error">{fieldErrors.credits}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          {fieldErrors.capacity && <p className="error">{fieldErrors.capacity}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {formError && <p className="form-error">{formError}</p>}

        <button type="submit" disabled={submitting}>
          Add course
        </button>
      </form>
    </section>
  );
}

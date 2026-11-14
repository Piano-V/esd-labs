// Lab day (AI required). This file ends up as the form described in CONTRACT.md §4.
import { useState } from "react";

const INITIAL_FORM = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

export function AddCourseForm({ onAdd }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await onAdd({
        code: form.code,
        title: form.title,
        department: form.department,
        credits: Number(form.credits),
        capacity: Number(form.capacity),
        description: form.description === "" ? null : form.description,
      });
      setForm(INITIAL_FORM);
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
    <form className="add-course-form" onSubmit={handleSubmit}>
      <h2>Add a course</h2>

      <div className="form-group">
        <label htmlFor="code">Code</label>
        <input
          id="code"
          name="code"
          type="text"
          value={form.code}
          onChange={handleChange}
          aria-invalid={fieldErrors.code ? "true" : undefined}
          aria-describedby={fieldErrors.code ? "code-error" : undefined}
        />
        {fieldErrors.code && (
          <p id="code-error" className="field-error">
            {fieldErrors.code}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          aria-invalid={fieldErrors.title ? "true" : undefined}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
        />
        {fieldErrors.title && (
          <p id="title-error" className="field-error">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
        <input
          id="department"
          name="department"
          type="text"
          value={form.department}
          onChange={handleChange}
          aria-invalid={fieldErrors.department ? "true" : undefined}
          aria-describedby={fieldErrors.department ? "department-error" : undefined}
        />
        {fieldErrors.department && (
          <p id="department-error" className="field-error">
            {fieldErrors.department}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="credits">Credits</label>
        <input
          id="credits"
          name="credits"
          type="number"
          value={form.credits}
          onChange={handleChange}
          aria-invalid={fieldErrors.credits ? "true" : undefined}
          aria-describedby={fieldErrors.credits ? "credits-error" : undefined}
        />
        {fieldErrors.credits && (
          <p id="credits-error" className="field-error">
            {fieldErrors.credits}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacity</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          aria-invalid={fieldErrors.capacity ? "true" : undefined}
          aria-describedby={fieldErrors.capacity ? "capacity-error" : undefined}
        />
        {fieldErrors.capacity && (
          <p id="capacity-error" className="field-error">
            {fieldErrors.capacity}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          aria-invalid={fieldErrors.description ? "true" : undefined}
          aria-describedby={fieldErrors.description ? "description-error" : undefined}
        />
        {fieldErrors.description && (
          <p id="description-error" className="field-error">
            {fieldErrors.description}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="form-error">
          {formError}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        Add course
      </button>
    </form>
  );
}

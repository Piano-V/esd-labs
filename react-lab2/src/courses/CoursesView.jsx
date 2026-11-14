// Lab day (AI required). This file ends up as the View described in CONTRACT.md §4.
export function CoursesView({ courses, status, error }) {
  if (status === "loading") {
    return <p>Loading courses…</p>;
  }

  if (status === "error") {
    return <p>Couldn't load courses: {error}</p>;
  }

  if (!courses || courses.length === 0) {
    return <p>No courses yet.</p>;
  }

  return (
    <ul className="courses">
      {courses.map((course) => {
        const seatsText =
          course.seatsLeft === 0
            ? "Full"
            : course.seatsLeft === 1
              ? "1 seat left"
              : `${course.seatsLeft} seats left`;

        return (
          <li key={course.id}>
            <div>
              {course.code} · {course.title}
            </div>
            <div>
              {course.credits} credits · {course.department} · {seatsText}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

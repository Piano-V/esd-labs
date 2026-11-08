// IN-LAB TASK (AI closed). Do this in the lab, not at home.
//
// A study plan groups planned course ids by semester:
//
//   const plan = {
//     student: "Asha",
//     semesters: { "2026-odd": [4, 10], "2027-even": [18] },
//   };
//
// Write addToSemester(plan, semester, courseId). It returns a NEW plan where
// that semester's list ends with courseId. Rules:
//   - never change the input (the tests freeze it — mutation throws)
//   - the student and every OTHER semester stay the SAME references
//   - a semester that does not exist yet is created
//   - if the id is already in that semester, return the SAME plan
//
// Stretch: moveCourse(plan, from, to, courseId) — out of one semester, into another.

export function addToSemester(plan, semester, courseId) {
  const currentList = plan.semesters[semester] ?? [];

  if (currentList.includes(courseId)) {
    return plan;
  }

  return {
    ...plan,
    semesters: {
      ...plan.semesters,
      [semester]: [...currentList, courseId],
    },
  };
}

export function moveCourse(plan, from, to, courseId) {
  const fromList = plan.semesters[from];
  if (!fromList || !fromList.includes(courseId)) {
    return plan;
  }

  if (from === to) {
    return plan;
  }

  const newFromList = fromList.filter((id) => id !== courseId);

  const toList = plan.semesters[to] ?? [];
  const newToList = toList.includes(courseId) ? toList : [...toList, courseId];

  return {
    ...plan,
    semesters: {
      ...plan.semesters,
      [from]: newFromList,
      [to]: newToList,
    },
  };
}

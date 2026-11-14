# Prompt log — React Lab 2

Part of what you submit. It shows *how* you used AI: did you hand it the contract and the
rules, or type "make it work"? Fill it in **as you go**, not from memory at the end.

- Name and roll number: 
- AI tool and plan (e.g. ChatGPT free, Gemini, Claude free, Copilot): ChatGPT (free)

**Log every prompt you send, in order — including the ones that didn't help.** Paste each
prompt in full. One exception: if you pasted CONTRACT.md's prompt 1 unchanged, write
"CONTRACT.md prompt 1, unchanged". Summarise each reply; don't paste whole files.

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:**
Returned 3 files: `src/courses/useCourses.js`, `src/courses/CoursesView.jsx`, and `src/courses/CoursesPage.jsx`.
- Hooks used: `useState` and `useEffect`.
- Followed the restriction: did not use `useMemo`, `useCallback`, `useReducer`, or `useRef`.
- Smells: It put the entire add course form directly into `CoursesPage.jsx` (didn't make `AddCourseForm.jsx`). In `useCourses.js`, it used separate `loading` and `error` states instead of one `status` field (`"loading" | "ready" | "error"`). It also did not add `aria-invalid` or `aria-describedby` accessibility attributes to form fields.

**Did it run?**
- In the browser / page test: List loads 20 courses; adding valid course works and places it in sorted order; 409 conflict message displays; validation error messages display.
- `test/courses/CoursesPage.test.jsx`: 4 passed (all passed).
- Overall `npm test`: 38 passed / 24 failed (the page works end-to-end, but unit tests for `useCourses`, `AddCourseForm`, `CoursesView`, and `fieldErrors` fail because the seam and §4 shape are not yet in place).

**What I did with it:**
Saved the files to `src/courses/`. Verified that the page works as a user would see it, then prepared to audit it against the handout sheet in Section 12 before touching any code.

---

## Prompt 2 — fix to the seam

**Why I sent it:**
Carried out the decisions from AUDIT.md §4:
1. Split the inline form out of CoursesPage into `AddCourseForm.jsx` with controlled inputs and accessible field errors (`aria-invalid`, `aria-describedby`, `role="alert"`).
2. Unify `loading` and `error` states in `useCourses.js` into a single `status` string (`"loading"` | `"ready"` | `"error"`), and let `addCourse` re-throw `ApiError` so the form catches it.
3. Update `CoursesView.jsx` to take `{ courses, status, error }` without any internal state or fetching.
4. Keep `CoursesPage.jsx` minimal, purely wiring the hook, view, and form.

**Sent:**

```text
I audited the code against "The Shape of a Good React Slice". Refactor it exactly as follows according to the seam in CONTRACT.md §4:

1. In src/courses/CoursesView.jsx:
   Export CoursesView({ courses, status, error }). Render purely from props: "loading" -> "Loading courses…", "error" -> "Couldn't load courses: <error>", empty -> "No courses yet.", otherwise <ul> with <li key={course.id}> with the two formatted lines. No hooks, no state.

2. In src/courses/useCourses.js:
   Export useCourses(). Return { courses, status, error, addCourse }. Use status: "loading" | "ready" | "error". Load GET /api/courses once on mount with ignore cleanup flag. In addCourse, POST /api/courses, insert 201 body into courses in code order as a new array, and let ApiError throw directly.

3. In src/courses/AddCourseForm.jsx:
   Export AddCourseForm({ onAdd }). Move the 6 inputs, submitting state, and form error states into this component. On submit, convert credits and capacity with Number(), set empty description to null, and await onAdd. When a field error occurs, set aria-invalid="true" and point aria-describedby to the field error message id. Put role="alert" on the form error message above the button.

4. In src/courses/CoursesPage.jsx:
   Call useCourses(), and render <h1>Courses</h1>, <CoursesView courses={courses} status={status} error={error} />, and <AddCourseForm onAdd={addCourse} />.

Rules: Use only useState and useEffect. No useMemo, useCallback, useReducer, useRef, or context. JavaScript only.
```

**What came back:**
The 4 files matching the exact shape in CONTRACT.md §4:
- `CoursesView.jsx` (dumb component taking `{ courses, status, error }`)
- `useCourses.js` (hook managing status, courses list, and addCourse)
- `AddCourseForm.jsx` (form owning local input states, submitting state, aria attributes)
- `CoursesPage.jsx` (clean coordinator wiring the slice)

**What I kept, and what I rejected:**
Kept all 4 files. Verified that no unwanted hooks or extra libraries were sneaked in. Verified all 62 tests pass in `npm test` without any regressions.

---

<!-- Copy the "Prompt 2" block for each further prompt. -->

## Afterwards

- How many prompts did the whole feature take?
- Which of your prompts would you write differently now, and how?
- One thing the rules in prompt 1 prevented (or failed to prevent):

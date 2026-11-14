# Audit — React Lab 2

Part of what you submit. Fill in sections 0–4 **before** you ask the AI to change anything:
deciding what's wrong is your job, not the AI's. The sheet you audit against is "The Shape
of a Good React Slice" — section 08 of the lab doc.

Point at code as `file:line`, e.g. `CoursesPage.jsx:14`.

---

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
| --- | --- | --- |
| `src/courses/CoursesPage.jsx` | Component `CoursesPage`, 9 `useState` hooks for form fields and submit state, `useCourses` hook call | 136 |
| `src/courses/CoursesView.jsx` | Component `CoursesView` (props: `courses, loading, error`) | 38 |
| `src/courses/useCourses.js` | Custom hook `useCourses`, 3 `useState` hooks (`courses`, `loading`, `error`), 1 `useEffect` hook | 49 |

- Does it run? List loads / valid add appears in order / duplicate code shows the 409
  message / bad input shows fieldErrors under the inputs:
  Yes. In the browser and in `CoursesPage.test.jsx`, the list loads, newly added courses appear in code order, duplicate code shows the 409 error message, and invalid fields show validation messages.
- Requests in the Network tab — on page load: 2 (in development with StrictMode; 1 in production) ; per add: 1 (`POST /api/courses`)
- `npm test` before any fix: 38 passed / 24 failed. Which test files fail?
  `CoursesView.test.jsx` (1 failed: loading check expects `status="loading"`), `useCourses.test.jsx` (10 failed: expects `status` string and ApiError re-throwing), `AddCourseForm.test.jsx` (11 failed: placeholder untouched), `fieldErrors.test.jsx` (2 failed: placeholder untouched).

## 1. Part A — walk the allowed list

Is each element present, and in the right place?

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
| --- | --- | --- |
| One View component that only renders | `CoursesView.jsx:2` | Yes, it only renders JSX. But it expects `{ courses, loading, error }` instead of `{ courses, status, error }`. |
| Fetch + logic in a separate hook or module | `useCourses.js:5` | Yes, fetching and state logic are in `useCourses`. |
| `useState` for the course list, at the right level | `useCourses.js:6` | Yes, stored in `useCourses` where both list and add action share it. |
| `useState` for the form's inputs, at the right level | `CoursesPage.jsx:9-14` | No. 6 input states are kept in `CoursesPage`. They belong inside `AddCourseForm` since only the form uses them. |
| `useEffect` — for the initial fetch only (with a cleanup) | `useCourses.js:10` | Yes, loads once on mount with an `ignore` flag. |
| Props down, callbacks up (the form raises "add this course") | `CoursesPage.jsx:20` | No. Form is inlined inside `CoursesPage`. It needs a dedicated `AddCourseForm` that raises `onAdd` to the page. |
| `.map` to render the list, with a stable `key` | `CoursesView.jsx:16` | Yes, renders with `key={course.id}`. |
| Loading / error / empty states, from one `status` | Missing (`CoursesView.jsx:3,7` and `useCourses.js:7`) | No. Uses separate `loading` boolean and `error` state instead of one `status` string (`"loading"` \| `"ready"` \| `"error"`). |

## 2. Part B — scan for "not yet"

Search the files (VS Code: Ctrl/Cmd+Shift+F) for each one.

| Not yet | Found? (`file:line`) | What it does in *this* slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` | No | None | N/A (prevented by prompt rules) |
| `useCallback` | No | None | N/A (prevented by prompt rules) |
| `useReducer` | No | None | N/A (prevented by prompt rules) |
| `useRef` | No | None | N/A (prevented by prompt rules) |
| Context (`createContext`, `useContext`) | No | None | N/A (prevented by prompt rules) |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | No | None | N/A (used `apiFetch` as instructed) |
| TypeScript (types, interfaces, `.ts`/`.tsx`) | No | None | N/A (plain JS used) |
| Anything else nobody taught you (name it) | No | None | N/A |

## 3. The rule — every hook and every component split

One row for **each** `useState`, `useEffect` and custom hook call, and for **each**
component. Say what it does *in this slice*. "The AI added it" and "just in case" are not
answers — if you can't name its job, the decision is "cut".

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
| --- | --- | --- |
| `CoursesPage` component (`CoursesPage.jsx:6`) | Wires the hook and child components together for the page. | Keep |
| `useCourses()` call (`CoursesPage.jsx:7`) | Supplies courses, load status, and addCourse callback to the page. | Keep |
| `useState("")` x 6 for inputs (`CoursesPage.jsx:9-14`) | Owns the half-typed form values so inputs are controlled. | Move to `AddCourseForm.jsx` |
| `useState(false)` for `submitting` (`CoursesPage.jsx:16`) | Disables the submit button while the add request is pending. | Move to `AddCourseForm.jsx` |
| `useState(null)` for `formError` (`CoursesPage.jsx:17`) | Stores the server error message to display above the submit button. | Move to `AddCourseForm.jsx` |
| `useState({})` for `fieldErrors` (`CoursesPage.jsx:18`) | Stores field-specific validation errors for invalid inputs. | Move to `AddCourseForm.jsx` |
| `CoursesView` component (`CoursesView.jsx:2`) | Dumb view that renders the courses list and status messages from props alone. | Keep |
| `useCourses` hook (`useCourses.js:5`) | Manages catalogue fetching, course list state, and adding a course. | Keep |
| `useState([])` for `courses` (`useCourses.js:6`) | Stores the array of courses returned by the server. | Keep |
| `useState(true)` for `loading` (`useCourses.js:7`) | Tracks loading state as a boolean instead of unified status. | Cut (replace with `status` state) |
| `useState(null)` for `error` (`useCourses.js:8`) | Stores load error message if fetching courses fails. | Keep |
| `useEffect` (`useCourses.js:10`) | Runs the initial GET request once on mount with cleanup. | Keep |

## 4. Decisions — before any fix prompt

- I will **cut**:
  - Separate `loading` boolean in `useCourses.js` (replace with unified `status` string).
  - Inline form JSX and form states from `CoursesPage.jsx`.
- I will **move** (from → to):
  - Move the 6 input states, `submitting` state, and form error states from `CoursesPage.jsx` into `AddCourseForm.jsx`.
  - Move form submit handling and field error rendering from `CoursesPage.jsx` into `AddCourseForm.jsx`.
- I will **add** (missing from the AI's version):
  - A separate `AddCourseForm.jsx` component conforming to CONTRACT.md §4 (`export function AddCourseForm({ onAdd })`).
  - Single `status` state (`"loading"` \| `"ready"` \| `"error"`) in `useCourses.js`, and update `CoursesView` to accept `{ courses, status, error }`.
  - Accessible error attributes in `AddCourseForm`: `aria-invalid="true"`, `aria-describedby` linking each bad input to its error message id, and `role="alert"` on the form-level error message.
  - In `useCourses.js`, let `addCourse` re-throw `ApiError` so `AddCourseForm` can catch and display errors.
- Other smells I found (state stored that could be computed, a reload after add, browser
  validation, `key={index}`, swallowed errors…):
  - State at the wrong level: `CoursesPage.jsx` held all the form's local input states even though only the form needs them.
  - Missing screen-reader accessibility: field errors lacked `aria-invalid` and `aria-describedby`.
  - Mismatched prop signatures between what unit tests check and what the initial draft used (e.g. `loading` prop vs `status` prop).

---

## 5. Strip check (section 14 of the doc)

For each "not yet" item you removed — one at a time:

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| --- | --- | --- |
|  |  |  |

If the AI used none, say so here, and say which rule in prompt 1 you think prevented it.

## 6. Before / after

|  | Before (the AI's first version) | After (yours) |
| --- | --- | --- |
| Files and components |  |  |
| `useState` calls (and where) |  |  |
| `useEffect` calls |  |  |
| "Not yet" items |  |  |
| Requests: on load / per add |  |  |
| `npm test` |  |  |

## 7. Two sentences

- One thing the AI got right that you might not have thought of:
- One thing you will never accept from an AI without checking again:

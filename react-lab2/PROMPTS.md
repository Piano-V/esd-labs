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

## Prompt 2 —

**Why I sent it:** (for a fix prompt: which decision in AUDIT.md it carries out)

**Sent:**

```text

```

**What came back:**

**What I kept, and what I rejected:**

---

<!-- Copy the "Prompt 2" block for each further prompt. -->

## Afterwards

- How many prompts did the whole feature take?
- Which of your prompts would you write differently now, and how?
- One thing the rules in prompt 1 prevented (or failed to prevent):

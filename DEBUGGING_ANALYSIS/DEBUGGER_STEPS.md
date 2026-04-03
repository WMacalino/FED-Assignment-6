### Breakpoint 1: Form Submission & User Input
**Location:** I placed a breakpoint inside the `handleFormSubmit` function, specifically on the line where the code attempts to read the value of the username input field: `const playerName = document.getElementById("username").value`.

**Initial State (Screenshot 1):** I clicked "Finish Game" without typing a name. The debugger paused execution exactly on my breakpoint. Looking at the "Scope" panel, the `playerName` variable was marked as `<value unavailable>` because the line had not executed yet.

**Stepping Through (Screenshot 2):** I clicked "Step over next function call". Execution moved forward, and the `playerName` variable evaluated to an empty string (`""`). Because an empty string is a "falsy" value in JavaScript, the program correctly bypassed the `if (playerName)` block and jumped directly down to calculate the score, preventing a blank cookie from being saved.

### Breakpoint 2: API Fetch & Error Handling
**Location:** I placed a breakpoint inside the `fetchQuestions` function, specifically on the `console.error` line within the `.catch` block.

**Initial State (Screenshot 1):** I intentionally triggered a "429 Too Many Requests" error by rapidly submitting the form to hit the API's rate limit. The debugger paused execution inside the catch block. Looking at the "Scope" panel, I could see the `error` variable populated with a `TypeError: Failed to fetch`.

**Stepping Through (Screenshot 2):** I stepped forward one line. The execution moved to `showLoading(false);`. This state confirms that my program successfully caught the failed network request. Instead of throwing an unhandled exception and completely crashing the application, it handled the error and moved to hide the loading skeleton.

# Debugging Analysis

### Breakpoint 1: Form Submission & User Input
* **Location:** Inside `handleFormSubmit`, paused on the line: `const playerName = document.getElementById("username").value`.
* **Initial State:** I clicked "Finish Game" without typing a name. The debugger paused, and the "Scope" panel showed `playerName` as `<value unavailable>`.
* **Stepping Through:** After stepping forward, `playerName` evaluated to an empty string `""`. Because this is a falsy value, the program correctly bypassed the `if (playerName)` block and jumped down to calculate the score, preventing an empty cookie from being created.

### Breakpoint 2: API Fetch & Error Handling
* **Location:** Inside `fetchQuestions`, paused on the `console.error` line within the `.catch` block.
* **Initial State:** I intentionally hit the API rate limit to trigger a 429 error. The debugger paused inside the catch block, and the "Scope" panel showed the `error` variable populated with `TypeError: Cannot read properties of undefined`.
* **Stepping Through:** I stepped forward, and execution moved to `showLoading(false)`. The program successfully caught the failed request, handled the error gracefully, and hid the loading skeleton instead of crashing.

### Breakpoint 3: DOM Updates & Data Rendering
**Location:** Inside `displayScores`, paused on the loop initialization: `existingScores.forEach( (scoreEntry) => {`.

**Initial State:** After finishing a game, the debugger paused right before building the table. The "Scope" panel showed the `existingScores` array successfully populated with parsed JSON data from `localStorage`.

**Stepping Through:** I stepped into the loop. The `row` variable populated with a dynamically constructed HTML string containing the current `scoreEntry` data, confirming the DOM update logic was formatting the table rows correctly.

---

### Critical State Analysis (Breakpoint 2)
**What does this state tell me about my program's logic?**
The state captured in Breakpoint 2 proves that my program's asynchronous architecture is resilient. By utilizing a `.catch()` block on the Fetch API promise, the application anticipates external server failures (like rate-limiting). 

**Is the program behaving as expected?**
Yes. When the API failed to return the expected array of trivia questions, `data.results` was undefined. Without the `.catch` block, attempting to run `.forEach()` on undefined data would have resulted in an unhandled exception, completely freezing the UI. Instead, the state proves the program gracefully bypassed the broken rendering logic, logged the specific error, and proceeded to clean up the UI by hiding the loading skeleton. This ensures the user isn't stuck staring at an infinite loading animation when the server goes down.

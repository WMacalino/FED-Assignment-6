/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    checkUsername();
    fetchQuestions();
    displayScores();

    function setCookie(username, value) {
            document.cookie = `${username}=${value}; path=/`;
        }
        
    function getCookie(username) {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${username}=`))
            ?.split("=")[1];
        }
    
    /**
     * Checks for an existing username cookie and updates the UI accordingly.
     * Hides the username input and shows the "New Player" button if a returning user is found.
     */
    function checkUsername() {
        const savedName = getCookie("username")

        if (savedName) {
            const username_input = document.getElementById("username")
            username_input.classList.add("hidden")
            
            const new_player = document.getElementById("new-player")
            new_player.classList.remove("hidden")
        }
    }

    /**
     * Clears the current session by expiring the username cookie and resets the UI
     * to allow a new player to enter their name.
     */
    function newPlayer() {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.getElementById("username").classList.remove("hidden");
        document.getElementById("username").value = "";
        document.getElementById("new-player").classList.add("hidden")
    }

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false);
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Calculates the player's score by tallying the selected correct answers.
     * @returns {number} The total number of correct answers.
     */
    function calculateScore() {
        let score = 0
        const checkedAnswers = document.querySelectorAll('input[type="radio"]:checked')

        checkedAnswers.forEach( (userAnswer) => {
            if (userAnswer.dataset.correct === "true") {
                score++;
            }
        });

        return score
    }

    /**
     * Saves the player's new score to localStorage alongside their username.
     * @param {number} newScore - The score achieved in the current game.
     */
    function saveScore(newScore) {
        const existingScoresString = localStorage.getItem("triviaScores");
        const existingScores = JSON.parse(existingScoresString) || [];
        const currentPlayer = getCookie("username")
        const scoreData = { player: currentPlayer, score: newScore};

        existingScores.push(scoreData);

        localStorage.setItem("triviaScores", JSON.stringify(existingScores));
    }

    /**
     * Retrieves the array of saved scores from localStorage and dynamically 
     * renders them into the score table.
     */
    function displayScores() {
        const existingScoresString = localStorage.getItem("triviaScores");
        const existingScores = JSON.parse(existingScoresString) || [];
        const tableBody = document.querySelector("#score-table tbody");
        tableBody.innerHTML = "";

        existingScores.forEach( (scoreEntry) => {
            const row = `
            <tr>
                <td>${scoreEntry.player}</td>
                <td>${scoreEntry.score}</td>
            </tr>`
            tableBody.innerHTML += row;
        });
    }
    
    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        const playerName = document.getElementById("username").value

        if (playerName) {
            setCookie("username", playerName)
            checkUsername()
        }

        const currentScore = calculateScore()
        console.log(currentScore) 
        
        saveScore(currentScore)
        displayScores()
        fetchQuestions()
    }
});
const questions = [
    { question: "¿Cuánto es 5x60?", options: ["30", "8", "0", "300"], answer: 3 },
    { question: "¿Cuál es la capital de Ecuador?", options: ["Madrid", "Berlín", "Quito", "Caracas"], answer: 2 },
    { question: "¿Cuántas copas de fútbol nacionales e internacionales tiene el Barça?", options: ["200", "100", "50", "102"], answer: 3 },
    { question: "¿Quién es el Rey de España?", options: ["Carlos I", "Felipe VI", "Fernando VI", "Alfonso XII"], answer: 1 },
    { question: "¿Cuántas comunidades tiene España?", options: ["19", "17", "30", "22"], answer: 1 },
    { question: "¿Cuál es la moneda de Reino Unido?", options: ["Libra Esterlina", "Dólar", "Euro", "Yen"], answer: 0 }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const scoreContainer = document.getElementById("score-container");
const scoreDisplay = document.getElementById("score");

function loadQuestion(index) {
    const question = questions[index];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((option, i) => {
        const optionBtn = document.createElement("button");
        optionBtn.textContent = option;
        optionBtn.classList.add("option-btn");
        optionBtn.onclick = () => selectOption(i);
        optionsContainer.appendChild(optionBtn);
    });
}

function selectOption(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].answer;

    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach(button => button.classList.remove("selected"));

    optionButtons[selectedIndex].classList.add("selected");
    nextBtn.disabled = false;
    if (selectedIndex === correctIndex) {
        score++;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
        nextBtn.disabled = true;
    } else {
        showScore();
    }
}

function showScore() {
    questionText.textContent = "¡Cuestionario finalizado!";
    optionsContainer.classList.add("hidden");
    nextBtn.classList.add("hidden");
    scoreContainer.classList.remove("hidden");

    const totalQuestions = questions.length;
    const incorrectAnswers = totalQuestions - score;

    scoreDisplay.textContent =
        score === totalQuestions
            ? "¡Perfecto! Todas tus respuestas son correctas. 🎉"
            : score === 0
            ? "Has fallado todas las preguntas. 😢"
            : `Has acertado ${score} y fallado ${incorrectAnswers}.🤔`;
}

loadQuestion(currentQuestionIndex);
nextBtn.addEventListener("click", nextQuestion);

const questions = document.querySelectorAll("#faq .question");
const answers = document.querySelectorAll('#faq .answer');
const buttonOpenAndClose = document.querySelectorAll("#faq .open-close");

questions.forEach((question, index) => {
    question.addEventListener("click", () => {
        const hiddenAnswer = answers[index].classList.contains("hidden");

        if (hiddenAnswer) {
            hideAnswer();
            showAnswer(index);
        } else {
            hideAnswer();
        }
    })
})

function hideAnswer() {
    answers.forEach((answer) => {
        answer.classList.add("hidden");
    })
    buttonOpenAndClose.forEach((button) => {
        button.classList.remove("rotate-180");
    })
}

function showAnswer(index) {
    answers[index].classList.remove("hidden");
    buttonOpenAndClose[index].classList.add("rotate-180");
}
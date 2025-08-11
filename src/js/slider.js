const coverageSlides = document.querySelectorAll("#coverages .slide");
const coverageIndicators = document.querySelectorAll("#coverages .indicators");
const buttonStopAndResume = document.getElementById('pause-continue');

let sliderCounter = 0;

coverageIndicators.forEach((currentValue, index) => {
    currentValue.addEventListener("click", () => {
        hideSlide();
        sliderCounter = index;
        showSlide();
    })
})

function hideSlide() {
    coverageIndicators[sliderCounter].classList.remove("bg-orange-400");
    coverageSlides[sliderCounter].classList.add("hidden");
}

function showSlide() {
    coverageIndicators[sliderCounter].classList.add("bg-orange-400");
    coverageSlides[sliderCounter].classList.remove("hidden");
}

let stopAuto = setInterval(changeSlide, 4000);

function changeSlide() {
    if (sliderCounter < coverageSlides.length - 1) {
        hideSlide();
        sliderCounter += 1;
        showSlide();
    } else {
        hideSlide();
        sliderCounter = 0;
        showSlide();
    }
}

buttonStopAndResume.addEventListener("click", () => {
    if (buttonStopAndResume.src.includes('../images/pause-circle.svg')) {
        clearInterval(stopAuto);
        buttonStopAndResume.src = '../images/play-circle.svg';
    } else {
        buttonStopAndResume.src = '../images/pause-circle.svg';
        stopAuto = setInterval(changeSlide, 3000)
    }
})
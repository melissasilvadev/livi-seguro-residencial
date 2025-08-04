const progressBar = document.querySelectorAll(".progress");
const progressSteps = document.querySelectorAll(".progress-step");

const formStepOne = document.getElementById("form-step-one");
const formStepTwo = document.getElementById("form-step-two");
const formStepThree = document.getElementById("form-step-three");
const formSuccess = document.getElementById("form-success")

const fieldsStepOne = document.querySelectorAll(".step-one");
const fieldsStepTwo = document.querySelectorAll(".step-two");

const forwardButtonStepOne = document.getElementById("forward-step-one");
const backButtonStepTwo = document.getElementById("back-step-two");
const forwardButtonStepTwo = document.getElementById("forward-step-two");
const backButtonStepThree = document.getElementById("back-step-three");
const submitButton = document.getElementById("forward-step-three");

const postalCodeField = document.getElementById("cep");

// status da validação
const formOneValidity = {
    fullname: false,
    mail: false,
    phone: false
};

const formTwoValidity = {
    cep: false,
    street: false,
    district: false,
    cityState: false
};

// validação dos campos
fieldsStepOne.forEach((field) => {
    field.addEventListener("blur", () => {
        if (field.name == "full-name") {
            if (field.value.length != 0 && field.value.trim() != "") {
                hideErrorMessage(field);
                formOneValidity.fullname = true;
            } else {
                showErrorMessage(field, "Preenchimento obrigatório");
                formOneValidity.fullname = false;
            }
        }

        if (field.name == "user-mail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(field.value)) {
                hideErrorMessage(field);
                formOneValidity.mail = true;
            } else {
                showErrorMessage(field, "Digite um e-mail válido");
                formOneValidity.mail = false;
            }
        }

        if (field.name == "phone") {
            const regex = /^(\(\d{2}\)\d{5}-\d{4}|\(\d{2}\)\d{9}|\d{7}-\d{4}|\d{11})$/;
            // Formatos (XX)XXXXX-XXXX, (XX)XXXXXXXXX, XXXXXXX-XXXX, XXXXXXXXXXX

            if (regex.test(field.value)) {
                hideErrorMessage(field);
                formOneValidity.phone = true;
            } else {
                showErrorMessage(field, "Digite um número válido");
                formOneValidity.phone = false;
            }
        }
        checkformOneValidity();
    })
})

fieldsStepTwo.forEach((field) => {
    field.addEventListener("input", () => {
        if (field.value.length != 0 && field.value.trim() != "") {
            hideErrorMessage(field);
            formTwoValidity[field.name] = true;
            checkformTwoValidity();
        } else {
            showErrorMessage(field, "Preenchimento obrigatório")
            formTwoValidity[field.name] = false;
            checkformTwoValidity();
        }
    })
})

postalCodeField.addEventListener("blur", () => {
    const postalCodeValue = postalCodeField.value.replace(/\D/g, "");
    if (postalCodeValue.length == 8) {
        hideErrorMessage(postalCodeField);
        formTwoValidity.cep = true;
        getAddress(postalCodeValue);
    } else {
        showErrorMessage(postalCodeField, "Preencha o campo com 8 dígitos")
        formTwoValidity.cep = false;
        checkformTwoValidity();
    }
})

// navagação das etapas
forwardButtonStepOne.addEventListener("click", () => {
    changeForm(formStepOne, formStepTwo);
    increaseProgress(0, 1);
})

backButtonStepTwo.addEventListener("click", () => {
    changeForm(formStepTwo, formStepOne);
    decreaseProgress(1, 0);
})

forwardButtonStepTwo.addEventListener("click", () => {
    changeForm(formStepTwo, formStepThree);
    increaseProgress(1, 2);
})

backButtonStepThree.addEventListener("click", () => {
    changeForm(formStepThree, formStepTwo);
    decreaseProgress(2, 1);
})

submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    showSuccessFeedback();
    sessionStorage.setItem("formFilled", "true");
})

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const status = sessionStorage.getItem("formFilled");
    if (status === "true") {
        showSuccessFeedback();
    }
})


function showErrorMessage(field, message) {
    field.nextElementSibling.innerText = message;
}

function hideErrorMessage(field) {
    field.nextElementSibling.innerText = "";
}

function changeForm(hideForm, showForm) {
    hideForm.classList.remove("flex");
    hideForm.classList.add("hidden");
    showForm.classList.remove("hidden");
    showForm.classList.add("flex");
}

function increaseProgress(lastIndex, nextIndex) {
    progressBar[lastIndex].classList.add("bg-orange-400");
    progressSteps[lastIndex].classList.remove("shadow-dark-small");
    progressSteps[nextIndex].classList.remove("bg-amber-50");
    progressSteps[nextIndex].classList.add("bg-orange-400");
    progressSteps[nextIndex].classList.add("shadow-dark-small");
}

function decreaseProgress(lastIndex, nextIndex) {
    progressBar[lastIndex - 1].classList.remove("bg-orange-400"); //progress bar é 0
    progressSteps[lastIndex].classList.remove("shadow-dark-small");
    progressSteps[lastIndex].classList.remove("bg-orange-400");
    progressSteps[lastIndex].classList.add("bg-amber-50");
    progressSteps[nextIndex].classList.add("shadow-dark-small");
}

function checkformOneValidity() {
    const allValid = Object.values(formOneValidity).every(currentValue => currentValue === true);

    if (allValid) {
        forwardButtonStepOne.disabled = false;
    } else {
        forwardButtonStepOne.disabled = true;
    }
}

function checkformTwoValidity() {
    const allValid = Object.values(formTwoValidity).every(currentValue => currentValue === true);
    if (allValid) {
        forwardButtonStepTwo.disabled = false;
    } else {
        forwardButtonStepTwo.disabled = true;
    }
}

async function getAddress(postalCodeValue) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${postalCodeValue}/json/`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.erro) {
            showErrorMessage(postalCodeField, "CEP Inexistente");
            return;
        }
        fillAddress(data);
        enableAddressFields();
        checkformTwoValidity();
    } catch (error) {
        showErrorMessage(postalCodeField, "Erro no servidor, por favor tente novamente mais tarde");
    }
}

function fillAddress(data) {
    document.getElementById("street").value = data.logradouro;
    document.getElementById("district").value = data.bairro;
    document.getElementById("city-and-state").value = `${data.localidade} - ${data.uf}`;
    fieldsStepTwo.forEach((currentValue) => {
        formTwoValidity[currentValue.name] = true;
    })
    checkformTwoValidity();
}

function enableAddressFields() {
    fieldsStepTwo.forEach((currentValue) => {
        currentValue.disabled = false;
    })
}

function showSuccessFeedback() {
    changeForm(formStepThree, formSuccess);

    progressBar.forEach((currentValue) => {
        currentValue.classList.add("hidden")
    });
    progressSteps.forEach((currentValue) => {
        currentValue.classList.add("hidden")
    });
    formStepOne.classList.remove("flex");
    formStepOne.classList.add("hidden");
}
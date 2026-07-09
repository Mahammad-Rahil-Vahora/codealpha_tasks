const display = document.getElementById("display");
display.value = "";

let firstNumber = "";
let secondNumber = "";
let operator = "";
let isSecondNumber = false;

function appendValue(value) {

    if(value === "."){
        if(isSecondNumber === false){
            if(firstNumber.includes(".")){
                return;
            }
        }
        else{
            if(secondNumber.includes(".")){
                return;
            }
        }
    }

    if(isSecondNumber === false) { 
        firstNumber += value;
        display.value = firstNumber;
    }
    else {
        secondNumber += value;
        display.value = firstNumber + " " + operator + " " + secondNumber;
    }
    
}

function chooseOperator(ope) {
     if(firstNumber === ""){
        return;
    }

     if (operator !== "") {
        return;
    }

    operator = ope;
    isSecondNumber = true;
    display.value = firstNumber + " " + operator;

}


function calculate() {

    let ans;

    switch(operator){
        case "+":
            ans = Number(firstNumber) + Number(secondNumber);
            break;

        case "-":
            ans = Number(firstNumber) - Number(secondNumber);
            break;

        case "*":
            ans = Number(firstNumber) * Number(secondNumber);
            break;

        case "/":
            if(Number(secondNumber) === 0){
                display.value = "Error";
                return;
            }
            ans = Number(firstNumber) / Number(secondNumber);
            break;

        default:
            return;
    }

    display.value = ans;
    firstNumber = ans.toString();
    secondNumber = "";
    operator = "";
    isSecondNumber = false;

}


function deleteLast() {
    if(isSecondNumber === false){
        firstNumber = firstNumber.slice(0,-1);
        display.value = firstNumber;
    }
    else if (isSecondNumber && secondNumber === "") {
        operator = "";
        isSecondNumber = false;
        display.value = firstNumber;
        return;
    }
    else{
        secondNumber = secondNumber.slice(0,-1);
        display.value = firstNumber + " " + operator + " " + secondNumber;
    }
    
    
}

function toggleSign() {
    if (isSecondNumber === false) {
        if (firstNumber === "") return;

        firstNumber = (Number(firstNumber) * -1).toString();
        display.value = firstNumber;
    } 
    else {
        if (secondNumber === "") return;

        secondNumber = (Number(secondNumber) * -1).toString();
        display.value = firstNumber + " " + operator + " " + secondNumber;
    }
}

function percentage() {
    if (isSecondNumber === false) {
        if (firstNumber === "") return;

        firstNumber = (Number(firstNumber) / 100).toString();
        display.value = firstNumber;
    } 
    else {
        if (secondNumber === "") return;

        secondNumber = (Number(secondNumber) / 100).toString();
        display.value = firstNumber + " " + operator + " " + secondNumber;
    }
}

function clearDisplay() {

    display.value = "";
    firstNumber = "";
    secondNumber = "";
    operator = "";
    isSecondNumber = false;
}

document.addEventListener("keydown", function(event) {

    if (event.key >= "0" && event.key <= "9") {
        appendValue(event.key);
    }

    else if (event.key === ".") {
        appendValue(".");
    }

    else if (event.key === "+") {
        chooseOperator("+");
    }

    else if (event.key === "-") {
        chooseOperator("-");
    }

    else if (event.key === "*") {
        chooseOperator("*");
    }

    else if (event.key === "/") {
        chooseOperator("/");
    }

    else if (event.key === "Enter") {
        calculate();
    }

    else if (event.key === "Backspace") {
        deleteLast();
    }

    else if (event.key === "Escape") {
        clearDisplay();
    }

});
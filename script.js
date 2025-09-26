function display(value) {
    document.getElementById("result").value += value;
}

function clearScreen() {
    document.getElementById("result").value = "";
}

function calculate() {
    var p = document.getElementById("result").value;
    try {
        var q = eval(p);
        document.getElementById("result").value = q;
    } catch (e) {
        document.getElementById("result").value = "Error";
    }
}
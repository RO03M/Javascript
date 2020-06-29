const timer_attr = document.querySelector('.loader').getAttribute('timer');//time to the next number
let valuesArray = []
let count = 0;
let line = 0;
document.querySelector('.bubble').addEventListener('click', function() {
    clearInterval(window.interval);
    reset(1);
    window.interval = setInterval(loader, 1, timer_attr);
});

function loader(timer_attr) {
    const width = 100 / (timer_attr * 1000);
    let loaderBar = document.querySelector('.loader');
    let actualWidth = loaderBar.getBoundingClientRect().width;//return width in percentage
    if (actualWidth >= 100) {
        actualWidth = 0;
        sorter();
    }
    actualWidth += width;
    loaderBar.style.width = actualWidth + '%';
}

function sorter() {
    document.querySelector('.reset-text').innerHTML = "";
    let randomNumber = Math.floor((Math.random() * valuesArray.length));
    document.querySelector('.number').innerHTML = valuesArray[randomNumber];
    SpeechCaller(valuesArray[randomNumber].toString());
    addTable(valuesArray[randomNumber]);
    valuesArray.splice(randomNumber, 1);

    if (valuesArray.length <= 1) {
        reset();
        clearInterval(window.interval);
    }
}

function reset(canText) {
    canText = canText || 0
    valuesArray = [];
    for (let i = 1; i <= 75; i++) {
        valuesArray.push(i)
    }
    if (canText == 0) document.querySelector('.reset-text').innerHTML = "Resetou!";
    document.querySelector('.gone-table').innerHTML = '';
    
}

function addTable(value) {
    let mainTable = document.querySelector('.gone-table');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let number = document.createTextNode(value)
    td.appendChild(number);
    if (count >= 25) {
        count = 0;
        line++;
    }
    tr.setAttribute('line', line);
    if (count == 0) {
        mainTable.appendChild(tr);
    }
    document.querySelectorAll('[line]', line)[line].appendChild(td);
    count++;
}

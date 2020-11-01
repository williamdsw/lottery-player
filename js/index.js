'use strict';

// Fields

const global = this;

let userNumbers = [];
let machineNumbers = [];
let matchedNumbers = [];
let timesPlayed = 0;

// Event Listeners

document.addEventListener ('DOMContentLoaded', function() {

    generateNumbersList();

    // References
    const numbersSpan = document.querySelectorAll('.number');
    const ticketOverlay = document.querySelector('.ticket-overlay');
    const playButton = document.querySelector('#playButton');
    const numberOfTimesPlayed = document.querySelector ('#numberOfTimesPlayed');
    const resultScoreParagraph = document.querySelector ('.result-score p');
    const matchedNumbersRow = document.querySelector ('.matched-numbers');

    if (numbersSpan.length !== 0 && ticketOverlay && playButton && numberOfTimesPlayed && resultScoreParagraph) {

        // References
        global._ticketOverlay = ticketOverlay;
        global._playButton = playButton;
        global._numberOfTimesPlayed = numberOfTimesPlayed;
        global._resultScoreParagraph = resultScoreParagraph;
        global._matchedNumbersRow = matchedNumbersRow;
        
        numbersSpan.forEach(span => {
            span.addEventListener('click', function (){
                const number = parseInt(this.textContent);
                if (userNumbers.length < 6) {
                    if (userNumbers.indexOf (number) === -1) {
                        userNumbers.push(number);
                        this.classList.add('number-selected');
                        manipulateElement ('user', 'create', this.textContent);
                    }
                    else {
                        userNumbers.splice (userNumbers.indexOf (number), 1);
                        this.classList.remove ('number-selected');
                        manipulateElement ('user', 'remove', this.textContent);
                    }
                }
                else {
                    if (userNumbers.indexOf (number) !== -1) {
                        userNumbers.splice (userNumbers.indexOf (number), 1);
                        this.classList.remove ('number-selected');
                        manipulateElement ('user', 'remove', this.textContent);
                    }
                }
    
                playButton.disabled = (userNumbers.length !== 6);
            });
        });
    
        // Block and excludes some elements
        playButton.addEventListener ('click', function () {
            this.disabled = true;
            onPlay();
        });
    }
});

function generateNumbersList() {
    const container = document.querySelector('.row.numbers-list');
    if (container) {
        const rows = 10;
        const cols = 5;

        let counter = 0;
        for (let r = 0; r < rows; r++) {
            const row = document.createElement('div');
            row.className = 'row m-auto';

            for (let c = 0; c < cols; c++) {
                counter++;
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `<span class="number"> ${counter < 10 ? '0' + counter : counter} </span>`;
                row.appendChild (col);
            }

            container.appendChild (row);
        }
    }
}

function onPlay () {
    timesPlayed++;
    global._numberOfTimesPlayed.textContent = timesPlayed;
    global._ticketOverlay.style.display = 'block';

    // References
    const outputNumbers = document.querySelectorAll ('.output-numbers.machine, .output-numbers.matched');
    const noMatches = document.querySelector ('#noMatches');

    outputNumbers.forEach ((element) => element.remove ());
    if (noMatches) {
        noMatches.remove();
    }

    global._resultScoreParagraph.textContent = '';
    generateMachineNumbers ();
}

/**
 * Generates six random numbers between 1 / 50
 */
function generateMachineNumbers () {
    const TIMEOUT = 500;
    machineNumbers = [];

    const internalId = setInterval (function () {
        const number = Math.round (Math.random () * 50) + 1;

        // Add to array and render the element
        if (machineNumbers.indexOf (number) === -1) {
            machineNumbers.push (number);
            const value = (number < 10 ? '0' + number : number.toString());
            manipulateElement ('machine', 'create', value);
        }

        if (machineNumbers.length === 6) {
            clearInterval (internalId);
            compareNumbers (userNumbers, machineNumbers);
        }
    }, TIMEOUT);
}

/**
 * Compares the user and machine arrays
 * @param {Array} userNumbers 
 * @param {Array} machineNumbers 
 */
function compareNumbers (userNumbers, machineNumbers) {
    const TIMEOUT = 500;
    matchedNumbers = [];

    // Compare values
    matchedNumbers = machineNumbers.filter (number => userNumbers.includes (number));

    // Render elements
    let index = 0;
    let intervalId = setInterval (function (e) {
        if (matchedNumbers.length !== 0) {
            const value = (matchedNumbers[index] < 10 ? '0' + matchedNumbers[index] : matchedNumbers[index]);
            manipulateElement ('matched', 'create', value.toString ());
            index++;
        }
        else  {
            if (global._matchedNumbersRow && global._resultScoreParagraph) {
                index = 0;
                const div = document.createElement ('div');
                div.id = 'noMatches';
                div.className = 'col';
                div.innerHTML = '<p> None </p>';
                global._matchedNumbersRow.appendChild (div);
                global._resultScoreParagraph.textContent = `You didn't score`;
            }
        }

        if (index === matchedNumbers.length)  {
            clearInterval (intervalId);

            if (index > 0) {
                const message = `You got ${matchedNumbers.length} numbers right!`;
                global._resultScoreParagraph.textContent = message;
            }

            global._playButton.disabled = false;
            global._ticketOverlay.style.display = 'none';
        }
    }, TIMEOUT);
}

/**
 * Create ou remove elements based on operator, action and value informed
 * @param {String} operator 
 * @param {String} action 
 * @param {String} value 
 */
function manipulateElement (operator, action, value) {
    value = value.trim();
    const rowSelector = (operator === 'user' ? '.player-numbers' : (operator === 'machine' ? '.machine-numbers' : '.matched-numbers'));
    const row = document.querySelector (rowSelector);
    if (row) {
        if (action === 'create') {
            const div = document.createElement ('div');
            div.className = 'col output-numbers';
            div.className += (operator === 'user' ? ' user' : (operator === 'machine' ? ' machine' : ' matched'));
            div.innerText = value;
            row.appendChild (div);
        }
        else  {
            row.childNodes.forEach ((child) => {
                if (child.textContent === value) {
                    row.removeChild (child);
                }
            });
        }
    }
}
"use strict";

//-----------------------------------------------------------------------------------//
// PARAMETERS

let spanNumbers = null;
let divBlocker = null;
let btnPlay = null;
let userNumbers = [];
let machineNumbers = [];
let matchedNumbers = [];
let numberOfTimesPlayed = 0;

//-----------------------------------------------------------------------------------//
// HELPER FUNCTIONS

window.addEventListener ("load", function ()
{
    spanNumbers = document.getElementsByClassName ("number");
    divBlocker = document.getElementById ("blocker");
    btnPlay = document.getElementById ("btnPlay");

    // Define events
    for (let index = 0; index < spanNumbers.length; index++)
    {
        let element = spanNumbers[index];
        element.addEventListener ("click", function ()
        {
            let number = parseInt (this.textContent);
            if (userNumbers.length < 6)
            {
                if (userNumbers.indexOf (number) === -1)
                {
                    userNumbers.push (number);
                    this.classList.add ("number-selected");
                    manipulateElement ("user", "create", this.textContent);
                }
                else 
                {
                    userNumbers.splice (userNumbers.indexOf (number), 1);
                    this.classList.remove ("number-selected");
                    manipulateElement ("user", "remove", this.textContent);
                }
            }
            else 
            {
                if (userNumbers.indexOf (number) > -1)
                {
                    userNumbers.splice (userNumbers.indexOf (number), 1);
                    this.classList.remove ("number-selected");
                    manipulateElement ("user", "remove", this.textContent);
                }
            }

            btnPlay.disabled = (userNumbers.length !== 6);
        });
    }

    btnPlay.addEventListener ("click", function ()
    {
        // Block and excludes some elements
        this.disabled = true;
        numberOfTimesPlayed++;
        document.getElementById ("number_of_times_played").textContent = numberOfTimesPlayed;
        divBlocker.style.display = "block";
        document.querySelectorAll (".output-numbers.machine, .output-numbers.matched").forEach ((element) => element.remove ());

        if (document.querySelector ("#no_matches") !== null)
        {
            document.querySelector ("#no_matches").remove ();
        }

        document.querySelector ("#score_result h4").innerText = "";
        generateMachineNumbers ();
    });
});

/**
 * Generates six random numbers between 1 / 50
 */
function generateMachineNumbers ()
{
    const TIMEOUT = 500;
    machineNumbers = [];

    let intervalID = setInterval (function ()
    {
        let number = Math.round (Math.random () * 50) + 1;

        // Add to array and render the element
        if (machineNumbers.indexOf (number) === -1)
        {
            machineNumbers.push (number);
            let value = (number < 10 ? "0" + number : number);
            manipulateElement ("machine", "create", value);
        }

        if (machineNumbers.length === 6)
        {
            clearInterval (intervalID);
            compareNumbers (userNumbers, machineNumbers);
        }
    }, TIMEOUT);
}

/**
 * Compares the user and machine arrays
 * @param {Array} user 
 * @param {Array} machine 
 */
function compareNumbers (user, machine)
{
    const TIMEOUT = 500;
    matchedNumbers = [];

    // Compare values
    machine.forEach ((value, index) => 
    {
        if (user.indexOf (value) > -1) { matchedNumbers.push (value); }
    });

    // Render elements
    let index = 0;
    let ID = setInterval (function (e)
    {
        if (matchedNumbers.length > 0)
        {
            let value = (matchedNumbers[index] < 10 ? "0" + matchedNumbers[index] : matchedNumbers[index]);
            manipulateElement ("matched", "create", value);
            index++;
        }
        else 
        {
            index = 0;
            let div = document.createElement ("div");
            div.id = "no_matches";
            div.className = "col";
            div.innerHTML = "<h4> None </h4>"
            document.querySelector ("#matched_numbers .row").appendChild (div);
            document.querySelector ("#score_result h4").innerHTML = "You didn't score";
        }

        if (index === matchedNumbers.length) 
        {
            clearInterval (ID);

            if (index > 0)
            {
                let numberOfPoints = 10 * matchedNumbers.length;
                document.querySelector ("#score_result h4").innerHTML = `${numberOfPoints} points`;
            }

            btnPlay.disabled = false;
            divBlocker.style.display = "none";
        }
    }, TIMEOUT);
}


/**
 * Create ou remove elements based on operator, action and value informed
 * @param {String} operator 
 * @param {String} action 
 * @param {String} value 
 */
function manipulateElement (operator, action, value)
{
    let rowID = (operator === "user" ? "#player_numbers .row" : (operator === "machine" ? "#machine_numbers .row" : "#matched_numbers .row"));
    let row = document.querySelector (rowID);
    if (action === "create")
    {
        let div = document.createElement ("div");
        div.id = value;
        div.className = "col output-numbers";
        div.className += (operator === "user" ? " user" : (operator === "machine" ? " machine" : " matched"));
        div.innerText = value;
        row.appendChild (div);
    }
    else 
    {
        let div = document.getElementById (value);
        row.removeChild (div);
    }
}
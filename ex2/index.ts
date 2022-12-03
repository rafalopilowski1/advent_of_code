#!/usr/bin/env node

import { readFile } from 'fs';

enum Choice {
    Rock = 1,
    Paper = 2,
    Scissors = 3
}

function make_to_choice(letter: string): Choice {
    switch (letter) {
        case "A":
        case "X":
            return Choice.Rock;
        case "B":
        case "Y":
            return Choice.Paper;
        case "C":
        case "Z":
            return Choice.Scissors;
    }
}

enum Outcome {
    Loss = -1,
    Draw = 0,
    Win = 1
}

function make_to_outcome(letter: string): Outcome {
    switch (letter) {
        case "X":
            return Outcome.Loss;
        case "Y":
            return Outcome.Draw;
        case "Z":
            return Outcome.Win;
    }
}

// Zadanie 1

readFile('./puzzle_input.txt', (_, data) => {
    let parsedData: String = data.toString('utf8');
    let myTotalScore = parsedData
        .split("\n")
        .map(fight => fight.split(" "))
        .map(letters => {
            let elfChoice = make_to_choice(letters[0]);
            let myChoice = make_to_choice(letters[1]);
            if (elfChoice == myChoice) {
                return 3 + myChoice;
            } else if (
                (elfChoice == Choice.Paper && myChoice != Choice.Scissors) || 
                (elfChoice == Choice.Scissors && myChoice != Choice.Rock) || 
                (elfChoice == Choice.Rock && myChoice != Choice.Paper)
            ) {
                return 0 + myChoice;
            } else {
                return 6 + myChoice;
            }
        })
        .reduce((a, b) => a + b);
    console.log("Total score (part 1): " + myTotalScore);
});

// Zadanie 2
readFile('./puzzle_input.txt', (_, data) => {
    let parsedData: String = data.toString('utf8');
    let myTotalScore = parsedData
        .split("\n")
        .map(fight => fight.split(" "))
        .map(letters => {
            let elfChoice = make_to_choice(letters[0]);
            let myOutcome = make_to_outcome(letters[1]);
            switch (myOutcome) {
                case Outcome.Draw: {
                    return 3 + elfChoice;
                }
                case Outcome.Loss: {
                    switch (elfChoice) {
                        case Choice.Paper:{
                            return 0 + Choice.Rock;
                        }
                        case Choice.Rock:{
                            return 0 + Choice.Scissors;
                        }
                        case Choice.Scissors:{
                            return 0 + Choice.Paper;
                        }
                    }
                }
                case Outcome.Win: {
                    switch (elfChoice) {
                        case Choice.Paper:{
                            return 6 + Choice.Scissors;
                        }
                        case Choice.Rock:{
                            return 6 + Choice.Paper;
                        }
                        case Choice.Scissors:{
                            return 6 + Choice.Rock;
                        }
                    }
                }
            }
        })
        .reduce((a, b) => a + b);
    console.log("Total score (part 2): " + myTotalScore);
});



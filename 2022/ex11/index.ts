import { readFile } from "fs/promises";

enum DataType {
    Monkey = "Monkey", items = "items", Operation = "Operation", Test = "Test", If = "If"
}

interface OperationProps {
    method: string;
    value: bigint | undefined;
}

interface MonkeyProps {
    index: number;
    operation: OperationProps;
    testValue: bigint;
    test: (value: bigint) => boolean;
    throwItem: { ifTrue: number, ifFalse: number };
    items: bigint[];
}

class Monkey {
    static allMonkeys: Monkey[] = [];
    static modulo = BigInt(1);
    index: number;
    items: bigint[];
    inspectCounter: number;
    operation: (old: bigint) => bigint;
    testValue: bigint;
    test: (value: bigint) => boolean;
    throwItem: (item: bigint, currentMonkey: Monkey) => void;
    constructor({ index, operation, test, testValue, throwItem, items }: MonkeyProps) {
        this.index = index;
        if (operation.method == "*") {
            this.operation = (old: bigint) => old * (operation.value === undefined ? old : operation.value);
        } else if (operation.method == "+") {
            this.operation = (old: bigint) => old + (operation.value === undefined ? old : operation.value);
        }
        this.test = test;
        this.testValue = testValue;
        this.throwItem = (item: bigint, currentMonkey: Monkey) => {
            if (test(item))
                Monkey.allMonkeys[throwItem.ifTrue].items.push(item);
            else
                Monkey.allMonkeys[throwItem.ifFalse].items.push(item);
            currentMonkey.items.shift();

        };
        this.items = items;
        this.inspectCounter = 0;
    }
    doWork() {
        const length = this.items.length;
        for (let i = 0; i < length; i++) {
            this.items[0] = this.operation(this.items[0]);
            this.items[0] %= Monkey.modulo; // Uncomment for Part 2
            // this.items[0] /= 3; // Uncomment for Part 1
            // this.items[0] = Math.floor(this.items[0]); // Uncomment for Part 1
            this.inspectCounter++;
            this.throwItem(this.items[0], this);
        }
    }
}

const data = await readFile("./puzzle_input.txt");

const reduntantWords = ["new", "divisible", "by", "throw", "to", "monkey", "true", "false", "Starting"];

const monkeysData = Array.from(data.toString("utf-8").matchAll(/[\d\w*+]+/g)).map(match => match[0]).filter(word => !reduntantWords.includes(word));

let state: DataType | undefined;
let counter = 0;
let currentIndex: number | undefined;
let currentItems: bigint[] = [];
let currentOperation: OperationProps;
let currentTest: (value: bigint) => boolean;
let currentTestValue: bigint;
let currentThrowItem: { ifTrue: number, ifFalse: number };

while (counter < monkeysData.length) {
    const data = monkeysData[counter];
    if (DataType[data] !== undefined) {
        state = DataType[data];
        counter++;
        continue;
    }
    if (state == DataType.Monkey) {
        if (currentIndex !== undefined) {
            Monkey.allMonkeys.push(new Monkey({ index: currentIndex, operation: currentOperation, test: currentTest, testValue: currentTestValue, throwItem: currentThrowItem, items: currentItems }));
            currentItems = [];
        }
        currentIndex = new Number(data).valueOf();
        counter++;
    } else if (state == DataType.items) {
        currentItems.push(BigInt(data));
        counter++;
    } else if (state == DataType.Operation) {
        if (monkeysData[counter + 2] == "old")
            currentOperation = { method: monkeysData[counter + 1], value: undefined };
        else
            currentOperation = { method: monkeysData[counter + 1], value: BigInt(monkeysData[counter + 2]) };
        counter += 3;
    } else if (state == DataType.Test) {
        currentTestValue = BigInt(data);
        Monkey.modulo *= currentTestValue;
        currentTest = (value: bigint) => (value % BigInt(data)) == BigInt(0);
        counter++;
    } else if (state == DataType.If) {
        currentThrowItem = { ifTrue: new Number(data).valueOf(), ifFalse: new Number(monkeysData[counter + 2]).valueOf() };
        counter += 3;
    }
}
Monkey.allMonkeys.push(new Monkey({ index: currentIndex, operation: currentOperation, test: currentTest, testValue: currentTestValue, throwItem: currentThrowItem, items: currentItems }));
// // Part 1 : 20 rounds
// for (let i = 0; i < 20; i++) {
//     for (const monkey of Monkey.allMonkeys) {
//         monkey.doWork();
//     }
// }
// Part 2 : 10000 rounds
for (let i = 0; i < 10000; i++) {
    for (const monkey of Monkey.allMonkeys) {
        monkey.doWork();
    }
    console.log("Round " + i);
}
console.log("End: " + Monkey.allMonkeys.map(monkey => monkey.inspectCounter).sort((a, b) => b - a));
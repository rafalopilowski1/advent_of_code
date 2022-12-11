import { DataType } from "./DataType";
import { MonkeyProps } from "./MonkeyProps";
import { OperationProps } from "./OperationProps";

export class Monkey {
    static allMonkeys: Monkey[] = [];
    static modulo = BigInt(1);
    index: number;
    items: bigint[];
    inspectCounter: number;
    operation: (old: bigint) => bigint;
    testValue: bigint;
    test: (value: bigint) => boolean;
    throwItem: (item: bigint, currentMonkey: Monkey) => void;
    doWork: () => void;
    constructor({ index, operation, test, testValue, throwItem, items, doWorkParts }: MonkeyProps) {
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
        this.doWork = () => {
            const length = this.items.length;
            for (let i = 0; i < length; i++) {
                this.items[0] = this.operation(this.items[0]);
                this.items[0] = doWorkParts(this.items[0]);
                this.inspectCounter++;
                this.throwItem(this.items[0], this);
            }
        };
    }
    static parseMonkeys(monkeyData: string[], part: number) {
        let state: DataType | undefined;
        let counter = 0;
        let currentIndex: number | undefined;
        let currentItems: bigint[] = [];
        let currentOperation: OperationProps;
        let currentTest: (value: bigint) => boolean;
        let currentTestValue: bigint;
        let currentThrowItem: { ifTrue: number; ifFalse: number; };
        let currentDoWorkParts: (value: bigint) => bigint;

        while (counter < monkeyData.length) {
            const data = monkeyData[counter];
            if (DataType[data] !== undefined) {
                state = DataType[data];
                counter++;
                continue;
            }
            if (state == DataType.Monkey) {
                if (currentIndex !== undefined) {
                    if (part == 1) {
                        currentDoWorkParts = (value) => value / BigInt(3);
                    } else {
                        currentDoWorkParts = (value) => value % Monkey.modulo; // Uncomment for Part 2
                    }
                    Monkey.allMonkeys.push(new Monkey({ index: currentIndex, operation: currentOperation, test: currentTest, testValue: currentTestValue, throwItem: currentThrowItem, items: currentItems, doWorkParts: currentDoWorkParts }));
                    currentItems = [];
                }
                currentIndex = new Number(data).valueOf();
                counter++;
            } else if (state == DataType.items) {
                currentItems.push(BigInt(data));
                counter++;
            } else if (state == DataType.Operation) {
                if (monkeyData[counter + 2] == "old")
                    currentOperation = { method: monkeyData[counter + 1], value: undefined };


                else
                    currentOperation = { method: monkeyData[counter + 1], value: BigInt(monkeyData[counter + 2]) };
                counter += 3;
            } else if (state == DataType.Test) {
                currentTestValue = BigInt(data);
                Monkey.modulo *= currentTestValue;
                currentTest = (value: bigint) => (value % BigInt(data)) == BigInt(0);
                counter++;
            } else if (state == DataType.If) {
                currentThrowItem = { ifTrue: new Number(data).valueOf(), ifFalse: new Number(monkeyData[counter + 2]).valueOf() };
                counter += 3;
            }
        }
        Monkey.allMonkeys.push(new Monkey({ index: currentIndex, operation: currentOperation, test: currentTest, testValue: currentTestValue, throwItem: currentThrowItem, items: currentItems, doWorkParts: currentDoWorkParts }));
    }
}

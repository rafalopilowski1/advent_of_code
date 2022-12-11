import { OperationProps } from "./OperationProps";

export interface MonkeyProps {
    index: number;
    operation: OperationProps;
    testValue: bigint;
    test: (value: bigint) => boolean;
    throwItem: { ifTrue: number; ifFalse: number; };
    items: bigint[];
    doWorkParts: (value: bigint) => bigint;
}

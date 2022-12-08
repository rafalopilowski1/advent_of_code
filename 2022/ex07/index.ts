import { readFile } from "fs/promises";
import { Directory, FileEntry } from "./Directory";
import { DirSize, iterate } from "./DirSize";

const data = await readFile("./puzzle_input.txt");
const parsedDataLines = data.toString("utf-8").split("\n");

const root = new Directory("/", null);
let currentDir = root;

parsedDataLines
    .filter(line => !line.match(/^\$ ls/g))
    .forEach(line => {
        let test = line.split(" ");
        if (line.match(/^\$/g)) {
            test = test.splice(1, test.length);
            if (test[0] == "cd")
                currentDir = currentDir.getDirectory(test[1]);
        } else {
            if (line.match(/^dir/g))
                currentDir.addDirectory(new Directory(test[1], currentDir));
            else
                currentDir.addFile(new FileEntry(test[1], new Number(test[0]).valueOf()));
        }
    });

root.print();

const array: DirSize[] = [];
iterate(root, array);

// Part 1
const dirStats = array.filter(dirSize => dirSize.size <= 100000).sort((a, b) => b.size - a.size);
console.log("Part 1: " + dirStats.map(dirStat => dirStat.size).reduce((acc, value) => acc + value));

// Part 2
const freeSpace = 70000000 - array.find(dirStat => dirStat.dir = root).size;
const spaceToFree = 30000000 - freeSpace;
const dirStatToDelete = array.filter(dirStats => dirStats.size >= spaceToFree).sort((a, b) => a.size - b.size)[0];
console.log("Part 2: " + dirStatToDelete.dir.absolutePath + " (" + dirStatToDelete.size + ")");
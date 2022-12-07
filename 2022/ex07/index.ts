import { dir } from "console";
import { readFile } from "fs/promises";

class FileEntry {
    name: string;
    size: number;
    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
}

class Directory {
    parent: Directory | null;
    absolutePath: string;
    path: string;
    innerDirectories: Directory[];
    innerFiles: FileEntry[];

    constructor(path: string, parent: Directory | null) {
        this.parent = parent;
        this.path = path;
        this.absolutePath = parent != null ? (parent.absolutePath + "/" + this.path) : ".";
        this.innerDirectories = [];
        this.innerFiles = [];
    }
    getSize = () => {
        let sum = 0;
        if (this.innerFiles.length != 0)
            sum += this.innerFiles.map(file => file.size).reduce((acc, value) => acc + value);
        for (const directory of this.innerDirectories) {
            sum += directory.getSize();
        }
        return sum;
    };
    getDirectory = (path: string) => {
        if (path === "..") { return this.parent; }
        if (path === this.path) { return this; }
        for (const directory of this.innerDirectories) {
            const foundDirectory = directory.getDirectory(path);
            if (foundDirectory != null) {
                return foundDirectory;
            }
        }
        return null;
    };
    getFile = (name: string) => {
        const innerFind = this.innerFiles.filter(file => file.name === name);
        let result = null;
        if (innerFind.length > 0) {
            result = innerFind[0];
        } else {
            for (const directory of this.innerDirectories) {
                const find = directory.getFile(name);
                if (find != null) {
                    result = find;
                    break;
                }
            }
        }
        return result;
    };
    addFile = (file: FileEntry) => this.innerFiles.push(file);
    addDirectory = (dir: Directory) => { this.innerDirectories.push(dir); };
    print = () => {
        if (this.parent != null) {
            console.log(this.absolutePath);
        } else {
            console.log("Root: " + this.absolutePath);
        }
        for (const dir of this.innerDirectories) {
            dir.print();
        }
        for (const file of this.innerFiles) {
            console.log(this.absolutePath + "/" + file.name + ": " + file.size);
        }
    };
}

interface DirSize {
    dir: Directory;
    size: number;
}

const iterate = (dir: Directory, array: DirSize[]) => {
    array.push({ "dir": dir, "size": dir.getSize() });
    for (const innerDir of dir.innerDirectories) {
        iterate(innerDir, array);
    }
};

const data = await readFile("./puzzle_input.txt");
const root = new Directory("/", null);
const parsedDataLines = data.toString("utf-8").split("\n");
let currentDir = root;
let lsCommand = false;
parsedDataLines.forEach(line => {
    let test = line.split(" ");
    if (line.match(/^\$/g)) {
        test = test.splice(1, test.length);
        if (test[0] === "cd" && test[1] !== "/") {
            lsCommand = false;
            if (test[1] === "..") {
                currentDir = currentDir.parent;
            } else {
                const nextCurrent = new Directory(test[1], currentDir);
                currentDir.addDirectory(nextCurrent);
                currentDir = nextCurrent;
            }
        } else if (test[0] === "ls") {
            lsCommand = true;
        }
    } else if (lsCommand && test[0] !== "dir") {
        currentDir.addFile(new FileEntry(test[1], new Number(test[0]).valueOf()));
    }
});

const array: DirSize[] = [];
iterate(root, array);
const dirStats = array.filter(dirSize => dirSize.size <= 100000).sort((a, b) => b.size - a.size);
// Part 1
console.log("Part 1: " + dirStats.map(dirStat => dirStat.size).reduce((acc, value) => acc + value));
// Part 2
const freeSpace = 70000000 - array.find(dirStat => dirStat.dir = root).size;
const spaceToFree = 30000000 - freeSpace;
const dirStatToDelete = array.filter(dirStats => dirStats.size >= spaceToFree).sort((a, b) => a.size - b.size)[0];
console.log("Part 2: " + dirStatToDelete.dir.absolutePath + " (" + dirStatToDelete.size + ")");
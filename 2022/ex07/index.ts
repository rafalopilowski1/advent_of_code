import {readFile} from "fs/promises";

class FileEntry {
    name: string;
    size:number;
    constructor(name:string,size:number) {
        this.name=name;
        this.size=size;
    }
}

class Directory {
    parent: Directory | null;
    absolutePath: string;
    path: string;
    innerDirectories: Directory[];
    innerFiles: FileEntry[];

    constructor(path:string,parent:Directory|null) {
        this.parent=parent;
        this.path=path;
        this.absolutePath=parent!= null ? (parent.absolutePath+"/"+this.path) : this.path;
        this.innerDirectories=[];
        this.innerFiles=[];
    }

    getDirectory = (path:string) => {
        if (path === "..") {return this.parent;}
        if (path === this.path) {return this;}
        for (const directory of this.innerDirectories) {
            const foundDirectory = directory.getDirectory(path);
            if (foundDirectory != null) {
                return foundDirectory;
            }
        }
        return null;
    };
    getFile = (name:string) => {
        const innerFind = this.innerFiles.filter(file => file.name == name);
        let result = null;
        if (innerFind.length != 0) {
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
    addFile=(file:FileEntry) => this.innerFiles.push(file);
    addDirectory=(dir:Directory) => {this.innerDirectories.push(dir);};
    print = () => {
        if (this.parent != null) {
            console.log(this.absolutePath);
        } else {
            console.log("Root: "+this.absolutePath);
        }
        for (const dir of this.innerDirectories) {
            dir.print();
        }
        for (const file of this.innerFiles) {
            console.log(this.absolutePath+"/"+file.name+": "+file.size);
        }
    };
}



const data = await readFile("./puzzle_input.txt");
const root = new Directory("/",null);
const parsedDataLines = data.toString("utf-8").split("\n");
let currentDir = root;
let lsCommand = false;
parsedDataLines.forEach(line => {
    let test = line.split(" ");
    if (line.match(/^\$/g)) {
        test = test.splice(1,test.length);
        if (test[0] == "cd") {
            lsCommand = false;
            currentDir = currentDir.getDirectory(test[1]);
            if (currentDir == null) {
                console.log(test[1]);
                console.log("Tree: ");
                root.print();
            }
        } else {
            lsCommand = true;
        }
    } else if (line.match(/^dir/g)) {
        currentDir.addDirectory(new Directory(test[1],currentDir));
    } else if (lsCommand) {
        currentDir.addFile(new FileEntry(test[1],new Number(test[0]).valueOf()));
    }
});
console.log("Tree: ");
root.print();

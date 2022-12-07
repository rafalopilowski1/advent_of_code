import {readFile} from "fs";

class FileEntry {
    name: string;
    size:number;
    constructor(name:string,size:number) {
        this.name=name;
        this.size=size;
    }
}

class Directory {
    path: string;
    innerDirectories: Directory[];
    innerFiles: FileEntry[];
    constructor(path:string) {
        this.path=path;
        this.innerDirectories=[];
        this.innerFiles=[];
    }

    getDirectory = (path:string): Directory => {
        if (path == this.path) {return this;}
        else {
            this.innerDirectories.forEach(directory => {
                return directory.getDirectory(path);
            });
        }
    }
    getFile = (name:string): FileEntry => {
        
    }
}

enum Command {
    List,
    Directory
}

class Task {
    command: Command;
    dir: Directory;
    constructor(command:string,dir:Directory) {
        this.dir=dir;
        switch (command) {
        case "ls":
            this.command=Command.List;
            break;
        case "dir":
            this.command=Command.Directory;
            break;
        default:
            break;
        }
    }
}

readFile("./puzzle_input.txt",(_,data)=> {
    const root = new Directory("/");
    const parsedDataLines = data.toString("utf-8").split("\n");
    parsedDataLines.forEach(line => {
        if (line.match(/^\$/g)) {
            const test = line.split(" ");
            const comm = new Task(test[0],root.);
        } else {
            
        }
    });

});
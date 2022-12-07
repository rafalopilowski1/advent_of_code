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
    parent: Directory | null;
    path: string;
    innerDirectories: Directory[];
    innerFiles: FileEntry[];
    constructor(path:string) {this.parent=null;
        this.path=path;
        this.innerDirectories=[];
        this.innerFiles=[];
    }

    getDirectory = (path:string) => {
        if (path == "..") {return this.parent;}
        if (path == this.path) {return this;}
        else {
            this.innerDirectories.forEach(directory => {
                const foundDirectory = directory.getDirectory(path);
                if (foundDirectory != null) {
                    return foundDirectory;
                }
            });
            return null;
        }
    };
    getFile = (name:string) => {
        const innerFind = this.innerFiles.filter(file => file.name == name);
        if (innerFind.length != 0) {
            return innerFind[0];
        } else {
            for (const directory of this.innerDirectories) {
                const find = directory.getFile(name);
                if (find != null) {
                    return find;
                }
            }
            return null;
        }  
    };
    addFile=(file:FileEntry) => this.innerFiles.push(file);
    addDirectory=(dir:Directory) => {dir.parent = this;this.innerDirectories.push(dir);};
    print = () => {
        console.log(this.path);
        for (const dir of this.innerDirectories) {
            dir.print();
        }
        for (const file of this.innerFiles) {
            console.log(file.size+ " "+file.name);
        }
    };
}


readFile("./puzzle_input.txt",(_,data)=> {
    const root = new Directory("/");
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
            } else {
                lsCommand = true;
            }
        } else if (line.match(/^dir/g)) {
            currentDir.addDirectory(new Directory(test[1]));
        } else if (lsCommand) {
            currentDir.addFile(new FileEntry(test[1],new Number(test[0]).valueOf()));
        }
    });
});
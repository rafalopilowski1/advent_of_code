export class FileEntry {
    name: string;
    size: number;
    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
}

export class Directory {
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
    getSize(): number {
        let sum = 0;
        if (this.innerFiles.length != 0)
            sum += this.innerFiles.map(file => file.size).reduce((acc, value) => acc + value);
        for (const directory of this.innerDirectories) {
            sum += directory.getSize();
        }
        return sum;
    }
    getDirectory(path: string): Directory | null {
        if (path === "..") { return this.parent; }
        if (path === this.path) { return this; }
        for (const directory of this.innerDirectories) {
            if (directory.path === path) {
                return directory;
            }
        }
        for (const directory of this.innerDirectories) {
            const foundDirectory = directory.getDirectory(path);
            if (foundDirectory != null) {
                return foundDirectory;
            }
        }
        return null;
    }
    getFile(name: string): FileEntry | null {
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
        }
        return null;
    }
    addFile = (file: FileEntry) => this.innerFiles.push(file);
    addDirectory = (dir: Directory) => this.innerDirectories.push(dir);
    print() {
        console.log(this.absolutePath);
        for (const dir of this.innerDirectories) {
            dir.print();
        }
        for (const file of this.innerFiles) {
            console.log(this.absolutePath + "/" + file.name + ": " + file.size);
        }
    }
}

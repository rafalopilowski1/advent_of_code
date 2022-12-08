import { Directory } from "./Directory";

export interface DirSize {
    dir: Directory;
    size: number;
}
export const iterate = (dir: Directory, array: DirSize[]) => {
    array.push({ "dir": dir, "size": dir.getSize() });
    for (const innerDir of dir.innerDirectories) {
        iterate(innerDir, array);
    }
};

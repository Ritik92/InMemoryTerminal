import { FileSystemNode } from './models/Node';

export class FileSystem {
    private root: FileSystemNode;
    private currentDirectory: FileSystemNode;

    constructor() {
        this.root = new FileSystemNode('/', true);
        this.currentDirectory = this.root;
    }

    private resolvePath(path: string): FileSystemNode | null {
        if (path === '/' || path === '~') return this.root;
        
        const parts = path.split('/').filter(Boolean);
        let current = path.startsWith('/') ? this.root : this.currentDirectory;

        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') {
                current = current.parent || current;
                continue;
            }
            
            const next = current.children.get(part);
            if (!next) return null;
            current = next;
        }

        return current;
    }

    public mkdir(path: string): void {
        const parts = path.split('/').filter(Boolean);
        let current = path.startsWith('/') ? this.root : this.currentDirectory;

        for (const part of parts) {
            if (part === '.' || part === '..') {
                throw new Error('Invalid directory name');
            }

            if (!current.children.has(part)) {
                const newDir = new FileSystemNode(part, true, current);
                current.children.set(part, newDir);
            }
            current = current.children.get(part)!;
            
            if (!current.isDirectory) {
                throw new Error(`${part} is not a directory`);
            }
        }
    }

    public cd(path: string): void {
        const target = this.resolvePath(path);
        if (!target) {
            throw new Error(`Directory not found: ${path}`);
        }
        if (!target.isDirectory) {
            throw new Error(`${path} is not a directory`);
        }
        this.currentDirectory = target;
    }

    public ls(path?: string): string[] {
        const target = path ? this.resolvePath(path) : this.currentDirectory;
        if (!target) {
            throw new Error(`Path not found: ${path}`);
        }
        if (!target.isDirectory) {
            throw new Error(`${path} is not a directory`);
        }
        return Array.from(target.children.keys());
    }

    public touch(filename: string): void {
        if (this.currentDirectory.children.has(filename)) {
            throw new Error(`File already exists: ${filename}`);
        }
        const newFile = new FileSystemNode(filename, false, this.currentDirectory);
        this.currentDirectory.children.set(filename, newFile);
    }

    public cat(filename: string): string {
        const file = this.currentDirectory.children.get(filename);
        if (!file) {
            throw new Error(`File not found: ${filename}`);
        }
        if (file.isDirectory) {
            throw new Error(`${filename} is a directory`);
        }
        return file.content;
    }

    public echo(content: string, filename: string): void {
        const file = this.currentDirectory.children.get(filename);
        if (!file) {
            this.touch(filename);
        }
        const targetFile = this.currentDirectory.children.get(filename)!;
        if (targetFile.isDirectory) {
            throw new Error(`${filename} is a directory`);
        }
        targetFile.content = content;
        targetFile.modifiedAt = new Date();
    }

    private copyNode(node: FileSystemNode, newParent: FileSystemNode): FileSystemNode {
        const copy = new FileSystemNode(node.name, node.isDirectory, newParent);
        if (node.isDirectory) {
            for (const [name, child] of node.children) {
                copy.children.set(name, this.copyNode(child, copy));
            }
        } else {
            copy.content = node.content;
        }
        return copy;
    }

    public cp(sourcePath: string, destPath: string): void {
        const source = this.resolvePath(sourcePath);
        if (!source) {
            throw new Error(`Source not found: ${sourcePath}`);
        }

        const destDir = this.resolvePath(destPath);
        if (!destDir || !destDir.isDirectory) {
            throw new Error(`Invalid destination: ${destPath}`);
        }

        const copy = this.copyNode(source, destDir);
        destDir.children.set(copy.name, copy);
    }

    public mv(sourcePath: string, destPath: string): void {
        const source = this.resolvePath(sourcePath);
        if (!source) {
            throw new Error(`Source not found: ${sourcePath}`);
        }

        const destDir = this.resolvePath(destPath);
        if (!destDir || !destDir.isDirectory) {
            throw new Error(`Invalid destination: ${destPath}`);
        }

        source.parent!.children.delete(source.name);
        source.parent = destDir;
        destDir.children.set(source.name, source);
    }

    public rm(path: string): void {
        const target = this.resolvePath(path);
        if (!target) {
            throw new Error(`Path not found: ${path}`);
        }
        if (target === this.root) {
            throw new Error('Cannot remove root directory');
        }
        target.parent!.children.delete(target.name);
    }

    public pwd(): string {
        return this.currentDirectory.getFullPath();
    }
}

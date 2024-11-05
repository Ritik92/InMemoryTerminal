export class FileSystemNode {
    public children: Map<string, FileSystemNode>;
    public content: string;
    public modifiedAt: Date;
    public createdAt: Date;

    constructor(
        public name: string,
        public isDirectory: boolean,
        public parent: FileSystemNode | null = null
    ) {
        this.children = isDirectory ? new Map() : null!;
        this.content = isDirectory ? null! : '';
        this.createdAt = new Date();
        this.modifiedAt = this.createdAt;
    }

    public getFullPath(): string {
        if (!this.parent) return '/';
        const path: string[] = [this.name];
        let current: FileSystemNode = this;
        
        while (current.parent) {
            current = current.parent;
            if (current.name !== '/') path.unshift(current.name);
        }
        
        return '/' + path.join('/');
    }
}
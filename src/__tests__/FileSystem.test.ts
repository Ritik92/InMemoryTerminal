// src/__tests__/FileSystem.test.ts
import { FileSystem } from '../FileSystem';

describe('FileSystem', () => {
    let fs: FileSystem;

    beforeEach(() => {
        fs = new FileSystem();
    });

    describe('mkdir', () => {
        it('should create a new directory', () => {
            fs.mkdir('test');
            expect(fs.ls()).toContain('test');
        });

        it('should create nested directories', () => {
            fs.mkdir('test/nested');
            fs.cd('test');
            expect(fs.ls()).toContain('nested');
        });

        it('should throw error for invalid directory names', () => {
            expect(() => fs.mkdir('..')).toThrow('Invalid directory name');
        });
    });

    describe('cd', () => {
        it('should change to specified directory', () => {
            fs.mkdir('test');
            fs.cd('test');
            expect(fs.pwd()).toBe('/test');
        });

        it('should support .. navigation', () => {
            fs.mkdir('test');
            fs.cd('test');
            fs.cd('..');
            expect(fs.pwd()).toBe('/');
        });

        it('should support absolute paths', () => {
            fs.mkdir('test');
            fs.mkdir('test/nested');
            fs.cd('/test/nested');
            expect(fs.pwd()).toBe('/test/nested');
        });
    });

    describe('file operations', () => {
        it('should create and read files', () => {
            fs.touch('test.txt');
            fs.echo('Hello World', 'test.txt');
            expect(fs.cat('test.txt')).toBe('Hello World');
        });

        it('should copy files', () => {
            fs.mkdir('dir1');
            fs.touch('test.txt');
            fs.echo('Hello World', 'test.txt');
            fs.cp('test.txt', 'dir1');
            fs.cd('dir1');
            expect(fs.cat('test.txt')).toBe('Hello World');
        });

        it('should move files', () => {
            fs.mkdir('dir1');
            fs.touch('test.txt');
            fs.echo('Hello World', 'test.txt');
            fs.mv('test.txt', 'dir1');
            expect(fs.ls()).not.toContain('test.txt');
            fs.cd('dir1');
            expect(fs.cat('test.txt')).toBe('Hello World');
        });

        it('should remove files and directories', () => {
            fs.mkdir('dir1');
            fs.touch('test.txt');
            fs.rm('test.txt');
            fs.rm('dir1');
            expect(fs.ls()).toHaveLength(0);
        });
    });
});
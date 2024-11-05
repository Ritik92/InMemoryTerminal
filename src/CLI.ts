import { FileSystem } from './FileSystem';
import * as readline from 'readline';

export class CLI {
    private fs: FileSystem;
    private rl: readline.Interface;

    constructor() {
        this.fs = new FileSystem();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '$ '
        });
    }

    private parseCommand(input: string): [string, string[]] {
        const parts = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
        const command = parts[0];
        const args = parts.slice(1).map(arg => 
            arg.startsWith('"') || arg.startsWith("'") 
                ? arg.slice(1, -1) 
                : arg
        );
        //@ts-ignore
        return [command, args];
    }

    public async start(): Promise<void> {
        console.log('Welcome to TypeScript File System!');
        console.log('Type "exit" to quit\n');

        this.rl.prompt();

        this.rl.on('line', async (line) => {
            try {
                const [command, args] = this.parseCommand(line.trim());
                
                switch (command) {
                    case 'exit':
                        this.rl.close();
                        return;
                    case 'mkdir':
                        this.fs.mkdir(args[0]);
                        break;
                    case 'cd':
                        this.fs.cd(args[0]);
                        break;
                    case 'ls':
                        const files = this.fs.ls(args[0]);
                        console.log(files.join('\n'));
                        break;
                    case 'pwd':
                        console.log(this.fs.pwd());
                        break;
                    case 'touch':
                        this.fs.touch(args[0]);
                        break;
                    case 'cat':
                        console.log(this.fs.cat(args[0]));
                        break;
                    case 'echo':
                        if (args.length >= 3 && args[args.length - 2] === '>') {
                            const content = args.slice(0, -2).join(' ');
                            this.fs.echo(content, args[args.length - 1]);
                        }
                        break;
                    case 'cp':
                        this.fs.cp(args[0], args[1]);
                        break;
                    case 'mv':
                        this.fs.mv(args[0], args[1]);
                        break;
                    case 'rm':
                        this.fs.rm(args[0]);
                        break;
                    default:
                        console.log(`Unknown command: ${command}`);
                }
            } catch (error) {
                //@ts-ignore
                console.error(`Error: ${error.message}`);
            }
            this.rl.prompt();
        });

        this.rl.on('close', () => {
            console.log('\nGoodbye!');
            process.exit(0);
        });
    }
}
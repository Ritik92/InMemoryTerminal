# In-Memory File System

An in-memory file system implementation in TypeScript, supporting various file and directory operations.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Data Structures and Design](#data-structures-and-design)
- [Implemented Functionalities](#implemented-functionalities)
- [Improvements and Extensions](#improvements-and-extensions)
- [Installation and Setup](#installation-and-setup)
- [Usage and Testing](#usage-and-testing)
- [Complexity Analysis](#complexity-analysis)
- [License](#license)

## Introduction
This project is an implementation of an in-memory file system, created as part of a coding assignment. The file system supports various operations, such as creating directories, navigating the file system, listing directory contents, creating and modifying files, and performing file and directory management tasks.

## Features
The in-memory file system supports the following operations:

1. `mkdir`: Create a new directory.
2. `cd`: Change the current directory, supporting relative (`.`, `..`) and absolute (`/`) paths, as well as the root directory (`/` or `~`).
3. `ls`: List the contents of the current directory or a specified directory.
4. `cat`: Display the contents of a file.
5. `touch`: Create a new empty file.
6. `echo`: Write text to a file.
7. `mv`: Move a file or directory to another location.
8. `cp`: Copy a file or directory to another location.
9. `rm`: Remove a file or directory.

## Data Structures and Design
The core of the file system is the `FileSystemNode` class, which represents a file or a directory. Each node has the following properties:

- `name`: The name of the file or directory.
- `isDirectory`: A flag indicating whether the node represents a directory or a file.
- `parent`: A reference to the parent node (for directories).
- `children`: A `Map` storing the child nodes (for directories).
- `content`: The contents of the file (for files).
- `createdAt`: The timestamp of when the node was created.
- `modifiedAt`: The timestamp of the last modification.

The `FileSystem` class manages the overall file system, providing methods for performing various operations. It uses the `resolvePath` method to navigate the file system based on the provided paths.

## Implemented Functionalities
The implemented functionalities cover all the requirements specified in the assignment, including:

1. **Directory Operations**: `mkdir`, `cd`, `ls`
2. **File Operations**: `touch`, `cat`, `echo`
3. **File/Directory Management**: `mv`, `cp`, `rm`
4. **Error Handling**: Comprehensive error checking and clear error messages for invalid operations.
5. **Command-Line Interface (CLI)**: A user-friendly CLI for interacting with the file system.

## Improvements and Extensions
While the current implementation meets the core requirements, there are several potential improvements and extensions that could be made:

1. **File Permissions**: Implement a permission system to control access to files and directories.
2. **User Management**: Introduce the concept of users and their ownership of files and directories.
3. **Symlink Support**: Implement symbolic links to allow for more flexible file system navigation.
4. **File Size Limits**: Impose limits on the size of files to manage memory usage.
5. **Directory Size Tracking**: Keep track of the total size of directories to provide more detailed file system information.
6. **Advanced File Operations**: Implement additional file operations, such as appending to files, truncating files, and more.

## Installation and Setup
1. Clone the repository
2. npm install
3. npm start
## Usage and Testing
Run the following commands:
mkdir documents
cd documents
touch test.txt
echo "Hello, World!" > test.txt
cat test.txt
Run the automated tests: npm test
This will execute the Jest-based unit tests for the file system implementation.

## Complexity Analysis
1. **Path Resolution**: O(n), where n is the depth of the path.
2. **Directory Operations**:
- `mkdir`: O(n), where n is the number of path components.
- `cd`: O(n), where n is the depth of the path.
- `ls`: O(1).
3. **File Operations**:
- `touch`: O(1).
- `cat`: O(1).
- `echo`: O(1).
4. **Copy Operations**: O(n), where n is the size of the subtree being copied.
5. **Move Operations**: O(1), as it involves only reference updates.


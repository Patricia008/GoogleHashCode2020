import { readFileContent, writeToFile } from './fileHandlers/FileHandler'

console.log('Hi')
const contents = readFileContent('./in/inputFile.txt')
console.log(contents)
writeToFile('./out/outputFile.txt', contents)

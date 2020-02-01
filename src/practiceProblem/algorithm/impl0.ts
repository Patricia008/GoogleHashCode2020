import { readInputData, writeSubmissionResult } from '../dataParsers/dataParser'

const contents = readInputData('files/practice/in/b_small.in')
console.log(contents)

writeSubmissionResult('files/practice/out/impl0/test.out', ['0', '2', '3'])

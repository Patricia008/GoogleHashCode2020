import { readInputData, writeSubmissionResult } from '../dataParsers/dataParser'

const contents = readInputData('files/20feb/in/a_example.in')
console.log(contents)

writeSubmissionResult('files/20feb/out/impl0/test.out', ['0', '2', '3'])

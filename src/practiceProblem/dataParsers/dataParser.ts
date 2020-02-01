import { readFileContent, writeToFile } from '../../fileHandlers/fileHandler'


export const readInputData = (fileName: string) => {
	const contents = readFileContent(fileName)
	const firstRow = contents.split('\n')[0]
	const numbers = firstRow.split(' ')
	const maxNrOfSlices = numbers[0]
	const nrTypesOfPizza = numbers[1]
	const nrSlicesInEachType = contents.split('\n')[1].split(' ')

	return {
		maxNrOfSlices,
		nrTypesOfPizza,
		nrSlicesInEachType,
	}
}

export const writeSubmissionResult = (fileName: string, types: string[]) => {
	const stringToBeWritten = types.length + '\n' + types.join(' ')
	writeToFile(fileName, stringToBeWritten)
}

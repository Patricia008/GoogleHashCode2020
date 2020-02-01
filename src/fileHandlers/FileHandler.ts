import * as fs from 'fs'

export const readFileContent = (fileName: string) => {
	const contents = fs.readFileSync(fileName, 'utf8')

	return contents
}

export const writeToFile = (fileName: string, stringToWrite: string) => {
	fs.writeFileSync(fileName, stringToWrite)
}

import { readInputData, writeSubmissionResult } from '../dataParsers/dataParser'

const files = {
	a: 'a_example',
	b: 'b_read_on',
	c: 'c_incunabula',
	d: 'd_tough_choices',
	e: 'e_so_many_books',
	f: 'f_libraries_of_the_world',
}

const fileName = files.f

const contents = readInputData(`files/20feb/in/${fileName}.txt`)
// console.log(contents)

let scannedBooks: number[] = []
let selectedLibs = []

// while (contents.libraries.length > 0) {

// 	findMaxScoresLibs()
// }

// console.log(selectedLibs)
selectedLibs = contents.libraries

const bySignUpDuration = (a, b) => {
	// days to complete lib
	const aScore = a.signupDuration
	const bScore = b.signupDuration

	return aScore - bScore
}

selectedLibs.sort(bySignUpDuration)

selectedLibs.forEach(lib => {
	lib.bookIds.sort((a, b) => {
		// days to complete lib
		const aScore = contents.bookScores.get(a)
		const bScore = contents.bookScores.get(b)

		return bScore - aScore
	})
})

writeSubmissionResult(`files/20feb/out/patriciaImpl/${fileName}_bySignUp_out.txt`, selectedLibs)

function findMaxScoresLibs() {
	contents.libraries.sort((a, b) => {
		const aScore = a.bookIds.reduce((acc, curr) => {
			if (scannedBooks.includes(curr)) {
				return acc
			}

			return (acc + contents.bookScores.get(curr))
		}, 0)
		const bScore = b.bookIds.reduce((acc, curr) => {
			if (scannedBooks.includes(curr)) {
				return acc
			}

			return (acc + contents.bookScores.get(curr))
		}, 0)

		return bScore - aScore
	})
	const chosenLib = contents.libraries[0]
	// remove selected lib from the list to be sorted
	contents.libraries.shift()
	// add selected lib to the selected list
	selectedLibs.push(chosenLib)
	// mark books as scaned
	scannedBooks = scannedBooks.concat(chosenLib.bookIds)
}


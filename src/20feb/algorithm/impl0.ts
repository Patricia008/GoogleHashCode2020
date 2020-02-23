import { readInputData, writeSubmissionResult } from '../dataParsers/dataParser'
import {Library, InputData} from '../algorithm/Entities'


const compareTupleAscending = (a, b) => {
    if (a[1] > b[1]) return 1
    if (a[1] < b[1]) return -1
    return 0
}

const compareTupleDescending = (a,b) => { return ( compareTupleAscending(a,b) * -1) }

class LibraryResult {
    library: Library
    bookSequence: number[]
    scoreYield: number
}

const libraryPotential = (library: Library, alreadyScanned: number[], daysRemaining: number, bookScores: Map<number,number>): LibraryResult => {
    // console.time('libraryPotential')
    const productiveDays = daysRemaining - library.signupDuration
    if (productiveDays <= 0) { 
        return {
        library,
        bookSequence: [],
        scoreYield: 0
    }
}

    const notScannedBookIds = library.bookIds.filter(x => !alreadyScanned.includes(x))
    const maxBookYield = Math.min((productiveDays * library.shippableBookCount), notScannedBookIds.length)
    // console.log('Max book yield:', maxBookYield)
    const libraryBookScores = new Map<number,number>(notScannedBookIds.map(id => { return [id, bookScores.get(id)]}))
    // console.log('NotScannedBooks: ', libraryBookScores)
    const sortedBooks = Array.from(libraryBookScores).sort(compareTupleDescending)
    // console.log('Sorted books:', sortedBooks)

    const chosenBookIds = sortedBooks.slice(0, maxBookYield).map(tuple => tuple[0])
    const totalScoreYield = sortedBooks.map(tuple => tuple[1]).reduce((previousValue, currentValue) => previousValue + currentValue)
    // console.log('Library ', library.id, ' bookIds: ', chosenBookIds, ' totalScore ', totalScoreYield)

    // console.timeEnd('libraryPotential')
    return {
        library,
        bookSequence: chosenBookIds,
        scoreYield: totalScoreYield
    }
}

const getNextBestLibrary = (availableLibraries: Library[], alreadyScanned: number[], daysRemaining: number, bookScores: Map<number,number>): LibraryResult => {
    if (availableLibraries.length === 0) return null
    const sortedLibraryYields = availableLibraries.map(library => libraryPotential(library, alreadyScanned, daysRemaining, bookScores))
        .sort((a, b) => {
            if (a.scoreYield > b.scoreYield) return -1
            if (a.scoreYield < b.scoreYield) return 1
            return 0
        })

    return sortedLibraryYields[0]
}

// const inputData: InputData = readInputData('files/20feb/in/a_example.txt')
// const inputData: InputData = readInputData('files/20feb/in/b_read_on.txt')
// const inputData: InputData = readInputData('files/20feb/in/c_incunabula.txt')
const inputData: InputData = readInputData('files/20feb/in/d_tough_choices.txt')
// const inputData: InputData = readInputData('files/20feb/in/f_libraries_of_the_world.txt')
// const inputData: InputData = readInputData('files/20feb/in/e_so_many_books.txt')


// console.log(inputData)

const chosenLibraries: LibraryResult[] = []
let alreadyScanned: number[] = []
let daysRemaining = inputData.dayCount
let currentScore = 0

// const start = Date.now(); console.time('getNextBestLibrary')
// let currentLibraryResult: LibraryResult = getNextBestLibrary(inputData.libraries,alreadyScanned,daysRemaining,inputData.bookScores)
// const stop = Date.now(); console.timeEnd('getNextBestLibrary')

// console.log('Duration of getNextBestLibrary: ', stop - start, 'ms - id:', currentLibraryResult.library.id, ' - score - ', currentLibraryResult.scoreYield);


while (true) {
    let currentLibraryResult: LibraryResult = getNextBestLibrary(inputData.libraries,alreadyScanned,daysRemaining,inputData.bookScores)
    if (currentLibraryResult == null) break;
    if (currentLibraryResult.scoreYield === 0) break;

    chosenLibraries.push(currentLibraryResult)
    inputData.libraries.splice(inputData.libraries.indexOf(currentLibraryResult.library),1)

    alreadyScanned = alreadyScanned.concat(currentLibraryResult.bookSequence)
    currentScore = currentScore + currentLibraryResult.scoreYield
    daysRemaining = daysRemaining - currentLibraryResult.library.signupDuration

    console.log('Next best library: ', currentLibraryResult.library.id, ' - score: ', currentLibraryResult.scoreYield, '. Remaining days: ', daysRemaining)

}

console.log('Chosen Libraries' , chosenLibraries)
console.log('TotalScore: ', currentScore)

writeSubmissionResult('files/20feb/out/dutzu/e.out', chosenLibraries.map(libResult => {
    return {
        id: libResult.library.id,
        bookCount: libResult.bookSequence.length,
        bookIds: libResult.bookSequence
    }
}) )

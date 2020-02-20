import { readInputData, writeSubmissionResult } from '../dataParsers/dataParser'
import {Library, InputData} from '../algorithm/Entities'

const libraryPotential = (library: Library, alreadyScanned: number[], daysRemaining: number, bookScores: Map<number,number>): number => {
    const productiveDays = daysRemaining - library.signupDuration
    if (productiveDays <= 0) { return 0 }

    const notScannedBookIds = library.bookIds.filter(x => !alreadyScanned.includes(x))
    const maxBookYield = Math.min((productiveDays * library.shippableBookCount), notScannedBookIds.length)
    console.log('Max book yield:', maxBookYield)
    const libraryBookScores = new Map<number,number>(notScannedBookIds.map(id => { return [id, bookScores.get(id)]}))
    console.log('NotScannedBooks: ', libraryBookScores)
    const sortedBooks = Array.from(libraryBookScores).sort((a, b) => {
            if (a[1] > b[1]) return 1
            if (a[1] < b[1]) return -1
            return 0
        }
    )
    console.log('Sorted books:', sortedBooks)

    const chosenBookIds = sortedBooks.slice(0, maxBookYield).map(tuple => tuple[0])
    const totalScoreYield = sortedBooks.map(tuple => tuple[1]).reduce((previousValue, currentValue) => previousValue + currentValue)
    console.log('Library ', library.id, ' bookIds: ', chosenBookIds, ' totalScore ', totalScoreYield)
    return totalScoreYield
}

const inputData: InputData = readInputData('files/20feb/in/a_example.txt')
console.log(inputData)

console.log(libraryPotential(inputData.libraries[0],[],inputData.dayCount,inputData.bookScores))


// writeSubmissionResult('files/20feb/out/impl0/test.out', ['0', '2', '3'])

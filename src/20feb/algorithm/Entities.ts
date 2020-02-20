export class Library {
    id: number
    bookCount: number
    signupDuration: number
    shippableBookCount: number
    bookIds: number[]
}

export class InputData {
    libraries: Library[] = new Array<Library>()
    bookScores: Map<number, number>
    dayCount: number
}
export class Library {
    id: Number
    bookCount: string
    signupDuration: string
    shippableBookCount: string
    bookIds: Number[]
}

export class InputData {
    libraries: Library[] = new Array<Library>()
    bookScores: Map<Number, Number>
    dayCount: Number
}
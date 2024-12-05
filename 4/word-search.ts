import * as fsPromise from 'fs/promises';

class WordSearcher {
    wordSearch: Array<string> = [];
    searchWord: Array<string> = ['X', 'M', 'A', 'S'];
    lineLengthOffset = 141;
    backwardHorizontalOffset = -1;
    forwardHorizontalOffset = 1;
    backwardVerticalOffset: number = -this.lineLengthOffset;
    forwardVerticalOffset: number = this.lineLengthOffset;
    upRightDiagonalOffset: number = 1-this.lineLengthOffset;
    upLeftDiagonalOffset: number = -this.lineLengthOffset-1;
    downLeftDiagonalOffset: number = this.lineLengthOffset-1;
    downRightDiagonalOffset: number = this.lineLengthOffset+1;

    constructor(fileInput: string) {
        this.wordSearch = [...fileInput];
    }

    findLetterAtIndex(searchLetter: String, index: number): boolean {
        if (this.wordSearch[index] == searchLetter) {
            return true;
        }
        return false;
    }

    searchForString(searchIndex: number, currentIndex: number, offset: number): number {
        if (this.findLetterAtIndex(this.searchWord[searchIndex], currentIndex+offset)){
            if (searchIndex == 3){
                return 1;
            }
            return this.searchForString(searchIndex+1, currentIndex+offset, offset);
        }
        return 0;
    }

    searchPartOne(): number {
        let found = 0;
        this.wordSearch.forEach((letter, index) => {
            if (letter == this.searchWord[0]){
                found += this.searchForString(1, index, this.backwardHorizontalOffset);
                found += this.searchForString(1, index, this.forwardHorizontalOffset);
                found += this.searchForString(1, index, this.backwardVerticalOffset);
                found += this.searchForString(1, index, this.forwardVerticalOffset);
                found += this.searchForString(1, index, this.upRightDiagonalOffset);
                found += this.searchForString(1, index, this.upLeftDiagonalOffset);
                found += this.searchForString(1, index, this.downLeftDiagonalOffset);
                found += this.searchForString(1, index, this.downRightDiagonalOffset);
            }
        });
        return found;
    }

    searchPartTwo(): number {
        let found = 0;
        this.wordSearch.forEach((letter, index) => {
            let search: number = 0;
            if (letter == 'A') {
                if (this.findLetterAtIndex('M', index+this.upLeftDiagonalOffset)) {
                    if (this.findLetterAtIndex('S', index+this.downRightDiagonalOffset)){
                        search += 0.5
                    }
                }
                else if (this.findLetterAtIndex('S', index+this.upLeftDiagonalOffset)) {
                    if (this.findLetterAtIndex('M', index+this.downRightDiagonalOffset)) {
                        search += 0.5
                    }
                }
                if (this.findLetterAtIndex('M', index+this.upRightDiagonalOffset)) {
                    if (this.findLetterAtIndex('S', index+this.downLeftDiagonalOffset)) {
                        search += 0.5
                    }
                }
                else if (this.findLetterAtIndex('S', index+this.upRightDiagonalOffset)) {
                    if (this.findLetterAtIndex('M', index+this.downLeftDiagonalOffset)) {
                        search += 0.5
                    }
                }

                if (search == 1){
                    found++;
                }
            }
        });
        return found;
    }
}

async function main() {
    const fileInput = await fsPromise.readFile('/home/benshe01/src/advent24/4/resources/input.txt', 'utf-8');

    const wordSearch: WordSearcher = new WordSearcher(fileInput);

    const foundPartOne: number = wordSearch.searchPartOne();

    console.log('Found (part1):', foundPartOne);

    const foundPartTwo: number = wordSearch.searchPartTwo();

    console.log('Found (part2):', foundPartTwo);
}

main().catch(console.error);
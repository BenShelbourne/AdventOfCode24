import * as fsPromise from 'fs/promises';

function getMuls(fileInput: String): number {
    const matches = fileInput.match(/mul\([0-9]{1,3},[0-9]{1,3}\)/gm);
    let result: number = 0;

    // for (const match of matches) {
    //     const multiplication = match.match(/([0-9]{1,3}),([0-9]{1,3})/);
    //     const leftSide: number = Number(multiplication[1]);
    //     const rightSide: number = Number(multiplication[2]);
    //     result += leftSide * rightSide;
    // }
    return result;
}

function checkDos(fileInput: String): Array<String> {
    return fileInput.split('do()');
}

async function main() {

    const fileInput = await fsPromise.readFile('/home/benshe01/src/advent24/3/resources/input.txt', 'utf-8');
    // Part 1 solution
    // const matches = fileInput.match(/mul\([0-9]{1,3},[0-9]{1,3}\)/gm);

    // let result: number = 0;

    // for (const match of matches) {
    //     const multiplication = match.match(/([0-9]{1,3}),([0-9]{1,3})/);
    //     const leftSide: number = Number(multiplication[1]);
    //     const rightSide: number = Number(multiplication[2]);
    //     result += leftSide * rightSide;
    // }

    // console.log('Result:', result);

    let result: number = 0;

    const muls: Array<String> = fileInput.split('don\'t()');
    result += getMuls(muls[0]);

    for (let i = 1; i < muls.length; i++){
        const dos: Array<String> = checkDos(muls[i]).slice(1);
        for (const todo of dos){
            result += getMuls(todo);
        }
    }
    console.log('Result:', result);
}

main().catch(console.error);

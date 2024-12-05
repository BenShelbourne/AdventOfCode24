import * as fsPromise from 'fs/promises';

async function main() {
    let leftList: Array<number> = [];
    let rightList: Array<number> = [];
    let totalDistance: number = 0;
    let similarityScore: number = 0;

    const fileInput = await fsPromise.open('/home/benshe01/src/advent24/1/resources/input.txt', 'r');
    for await (const line of fileInput.readLines()) {
        const lineSplit = line.split('   ');
        leftList.push(+lineSplit[0]);
        rightList.push(+lineSplit[1]);
    }

    leftList.sort();
    rightList.sort();

    if (leftList.length != rightList.length){
        throw new EvalError('Lists length do no match');
    }

    for (let i = 0; i < leftList.length; i++){
        totalDistance += Math.abs(leftList[i] - rightList[i]);
    }

    console.log('Total Distance:', totalDistance);

    for (const leftItem of leftList) {
        let occurrences: number = 0;
        for (const rightItem of rightList) {
            if (leftItem == rightItem){
                occurrences++;
            }
        }
        similarityScore += leftItem * occurrences;
    }

    console.log('Similarity Score:', similarityScore);
}

main().catch(console.error);
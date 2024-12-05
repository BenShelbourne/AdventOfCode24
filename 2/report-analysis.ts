import * as fsPromise from 'fs/promises';

function parseReport(report: Array<number>): boolean {
    let isSafe: boolean = false;
    const firstLevel: number = report[0];
    const lastLevel: number = report[report.length-1];

    if (firstLevel > lastLevel) {
        isSafe = checkDescendingReportIsSafe(report);
    }
    else {
        isSafe = checkAscendingReportIsSafe(report);
    }

    if (isSafe) {
        return true;
    }

    // UNSAFE Report
    // If we remove a level, is it safe?

    let isLevelSafe: number = 0;

    for (let i = 0; i < report.length; i++) {
        let newReport = Object.assign([], report);
        newReport.splice(i, 1);
        const firstLevel: number = newReport[0];
        const lastLevel: number = newReport[newReport.length-1];

        if (firstLevel > lastLevel) {
            isLevelSafe += checkDescendingReportIsSafe(newReport) ? 1 : 0;
        }
        else {
            isLevelSafe += checkAscendingReportIsSafe(newReport) ? 1 : 0;
        }
    }
    if (isLevelSafe > 0){
        return true;
    } else {
        return false;
    }
}

function checkAscendingReportIsSafe(report: Array<number>): boolean {
    let prevLevel: number = report[0];
    let currentLevel: number = 0;
    for (let i = 1; i < report.length; i++){
        currentLevel = report[i];
        if (currentLevel <= prevLevel) {
            return false;
        } else if (currentLevel - prevLevel > 3) {
            return false;
        } else {
            prevLevel = currentLevel;
        }
    }
    return true;
}

function checkDescendingReportIsSafe(report: Array<number>): boolean {
    let prevLevel = report[0];
    let currentLevel = 0;
    for (let i = 1; i < report.length; i++){
        currentLevel = report[i];
        if (currentLevel >= prevLevel) {
            return false;
        } else if (prevLevel - currentLevel > 3) {
            return false;
        } else {
            prevLevel = currentLevel;
        }
    }
    return true;
}

async function main () {
    let safeReports: number = 0;

    const fileInput = await fsPromise.open('/home/benshe01/src/advent24/2/resources/input.txt', 'r');
    for await (const line of fileInput.readLines()) {
        const report: Array<number> = line.split(" ").map(Number);
        const isSafe: boolean = parseReport(report);
        safeReports += isSafe ? 1 : 0;
    }

    console.log('Safe Reports:', safeReports);
}

main().catch(console.error);
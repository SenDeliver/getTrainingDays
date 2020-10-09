function validateInput(startDate, trainingCount, schedule) {
    let errMsg;
    if (typeof startDate !== 'string') errMsg = 'startDate must be a string';
    else if (!Number.isInteger(trainingCount)) errMsg = 'trainingCount must be a int';
    else if (!Array.isArray(schedule) || schedule.filter(sc => Number.isInteger(sc)).length !== schedule.length) errMsg = 'schedule must be a array of int';

    if (errMsg) throw new Error(errMsg);
}

const LAST_DAY_POSITION_IN_WEEK = 7;
const FIRST_DAY_POSITION_IN_WEEK = 1;

/**
 * @param startDate {String}
 * @param trainingCount {number}
 * @param schedule {Array<number>}
 */
function getDaysBySchedule(startDate, trainingCount, schedule) {
    validateInput(startDate, trainingCount, schedule);

    const startDayPosition = new Date(startDate).getDay();
    let passedTraining = 0, passedDays = 0;

    let currentDayPosition = startDayPosition;

    let shouldRepeat = true;
    while (shouldRepeat) {
        // handle 1 week
        if (passedDays <= (LAST_DAY_POSITION_IN_WEEK - startDayPosition) && schedule.includes(currentDayPosition) && currentDayPosition >= startDayPosition) {
            passedTraining++;
        }
        // handle next week
        else if (schedule.includes(currentDayPosition)) {
            passedTraining++;
        }

        currentDayPosition = currentDayPosition === LAST_DAY_POSITION_IN_WEEK ? FIRST_DAY_POSITION_IN_WEEK : currentDayPosition + 1;
        passedDays++;
        shouldRepeat = passedTraining < trainingCount;
    }

    return passedDays;
}

setImmediate(async () => {
    const params = [
        {startDate: '2016.04.18', trainingCount: 6, schedule: [2, 4, 6], expectedCount: 13},
        {startDate: '2016.04.18', trainingCount: 6, schedule: [1, 3, 5], expectedCount: 12},
        {startDate: '2016.04.18', trainingCount: 6, schedule: [1, 4], expectedCount: 18},
        {startDate: '2016.04.19', trainingCount: 6, schedule: [2, 4, 6], expectedCount: 12},
        {startDate: '2016.04.21', trainingCount: 1, schedule: [2, 4, 6], expectedCount: 1},
        {startDate: '2016.05.01', trainingCount: 2, schedule: [2], expectedCount: 10},
        {startDate: '2016.05.10', trainingCount: 12, schedule: [2, 4, 6], expectedCount: 26},
        {startDate: '2016.05.30', trainingCount: 3, schedule: [2], expectedCount: 16},
        {startDate: '2016.05.30', trainingCount: 3, schedule: [1, 2, 3, 4, 5, 6], expectedCount: 3},
        {startDate: '2016.10.12', trainingCount: 2, schedule: [1], expectedCount: 13},
        {startDate: '2016.10.10', trainingCount: 200, schedule: [2, 4, 6], expectedCount: 466},
        {startDate: '2016.10.10', trainingCount: 200, schedule: [7], expectedCount: 1400},
    ];

    for (const {startDate, trainingCount, schedule, expectedCount} of params) {
        try {
            const days = getDaysBySchedule(startDate, trainingCount, schedule)

            console.log(`Get days - ${days}, expected - ${expectedCount}`);
        } catch (e) {
            console.error(e)
        }
    }
});

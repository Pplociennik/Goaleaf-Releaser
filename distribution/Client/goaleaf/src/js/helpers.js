export function changeDateFormat(date) {

    const dateObj = new Date(date);
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();
    const finalDate = day + "/" + month + "/" + year;

    return finalDate;
}
export function changeDateFormat1(date) {

    const dateObj = new Date(date);
    const day = dateObj.getUTCDate();
    let month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();
    month = getStringMonth(month);
    const finalDate = day + " " + month + " " + year;

    return finalDate;
}

function getStringMonth(month){
    let monthString;
    switch(month){
        case 1: monthString = 'January'; break;
        case 2: monthString = 'February'; break;
        case 3: monthString = 'March'; break;
        case 4: monthString = 'April'; break;
        case 5: monthString = 'May'; break;
        case 6: monthString = 'June'; break;
        case 7: monthString = 'July'; break;
        case 8: monthString = 'August'; break;
        case 9: monthString = 'September'; break;
        case 10: monthString = 'October'; break;
        case 11: monthString = 'November'; break;
        case 12: monthString = 'December'; break;
        default: break;
    }
    return monthString;
}
// https://www.youtube.com/watch?v=6ZrO90AI0c8&ab_channel=Mathologer
const canvas = document.getElementById('vortex-canvas');
const context = canvas.getContext('2d');

const multiplier = 2;
const modulus = 9;
const base = 10;

const width = canvas.offsetWidth;
const height = canvas.offsetHeight;
const shortestSide = Math.min(width,height);

const centerX = width/2;
const centerY = height/2;
const radius = (shortestSide/2)-10;

// draw the circle
context.beginPath();
context.arc(centerX, centerY, radius, 0, 2 * Math.PI); // 0 = start angle, 2 * Math.PI = end angle
context.stroke();
// draw points (with labels)
const pointCoords=calculatePointCoords(modulus);
Object.values(pointCoords).forEach(function([pointX, pointY]){
    drawPoint(context, pointX, pointY,3);
})

// draw lines between points
const lines = calculateVortex(multiplier, modulus);
console.log(lines)
lines.forEach(function(line){
    let prevNumber = line[line.length - 1];
    line.forEach(function(number){
        if(prevNumber !== null){
            const [x1, y1] = pointCoords[prevNumber];
            const [x2, y2] = pointCoords[number];
            drawLine(context, x1, y1, x2, y2);
        }
        prevNumber = number;
    });
})
// let prevNumber = numbers[numbers.length - 1];
// numbers.forEach(function(number){
//     if(prevNumber !== null){
//         const [x1, y1] = pointCoords[prevNumber];
//         const [x2, y2] = pointCoords[number];
//         drawLine(context, x1, y1, x2, y2);
//     }
//     prevNumber = number;
// })


/*
    Functions
*/

function digitalRoot(number) {
    // Convert the number to a string to extract its digits
    let numString = number.toString();

    // Base case: If the number is already a single digit, return it
    if (numString.length === 1) return parseInt(numString);

    // Sum the digits of the number
    let sum = 0;
    for (let digit of numString) sum += parseInt(digit);

    return digitalRoot(sum);
}

function calculateVortex(multiplier, modulus, base = 10){
    let numbers = [];
    let prevNumber, dr;
    let passedNumbers=[];

    for(let i = 1; i < modulus; i++){
        numbers[i-1]=[]; prevNumber = i; dr = i;
        if(passedNumbers.includes(dr)) continue;
        while(!numbers[i-1].includes(dr)){
            passedNumbers.push(dr);
            numbers[i-1].push(dr);
            const number = prevNumber * multiplier;
            dr = number % modulus
            // dr = digitalRoot(number) % modulus
            prevNumber = number;
        }
    }


    return numbers;
}

function drawPoint(context,x,y,radius=2){
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, true);
    context.fill();
}
function drawLine(context,x1,y1,x2,y2,radius=2){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}

function deg2Rad(deg)
{
  return deg * (Math.PI/180);
}

function calculatePointCoords(modulus){
    const angleBetweenPoints = 360 / modulus;
    let angle = angleBetweenPoints;

    let pointCoords={}, i = 0;

    for(i = 0; i < modulus; i++){
        const sin = Math.sin(deg2Rad(angle)), cos = Math.cos(deg2Rad(angle))
        const pointX = centerX + radius * sin;
        const pointY = centerY + -radius * cos;
        pointCoords[i+1]=[pointX, pointY];
        angle+=angleBetweenPoints;
    }

    pointCoords[0] = pointCoords[i];

    return pointCoords;
}
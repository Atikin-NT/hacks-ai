const data = [
    {'id': 0, 'time': 200, 'st': 1, 'free_carriage': null, 'onboard': [0, 1, 4, 0]},
    {'id': 1, 'time': 200, 'st': 2, 'free_carriage': null, 'onboard': [0, 1, 4, 5]},
    {'id': 0, 'time': 238, 'st': 1, 'free_carriage': 21, 'onboard': [0, 1, 4, 5]},
    {'id': 1, 'time': 444, 'st': 3, 'free_carriage': null, 'onboard': [7, 0, 4, 0]},
    {'id': 0, 'time': 448, 'st': 3, 'free_carriage': null, 'onboard': [0, 10, 4, 0]},
    {'id': 1, 'time': 609, 'st': 3, 'free_carriage': null, 'onboard': [0, 1, 4, 10]},
    {'id': 0, 'time': 611, 'st': 3, 'free_carriage': 21, 'onboard': [0, 1, 4, 5]},
    {'id': 0, 'time': 1335, 'st': 2, 'free_carriage': null, 'onboard': [3, 1, 2, 0]},
    {'id': 1, 'time': 240, 'st': 2, 'free_carriage': 10, 'onboard': [0, 1, 4, 5]},
    {'id': 0, 'time': 1358, 'st': 2, 'free_carriage': null, 'onboard': [0, 5, 4, 5]}
];

function getSt(ind) {
    return data.filter(function (el) {
        return el.st == ind;
    });
}

function getImport(station) {
    return station.filter(function (el) {
        return el.free_carriage == null;
    });
}
function getExport(station) {
    return station.filter(function (el) {
        return el.free_carriage != null;
    });
}

function shawTrains(station, time) {
    const trains = station.filter(function (el) {
        return el.time == time;
    });
    console.log(trains);
    // document.getElementById("Test").textContent = trains;
}

function getIdOnClick(clickedId) {
    alert(this.id);
}

function shawTime(stationImport) {
    const timeBox = document.getElementById("time");
    for (let i = 0; i < stationImport.length; i++) {
        const button = document.createElement("button");
        button.id = `timeButton${i}`;
        button.classList.add("btn", "btn-outline-light", "timeButton");
        button.type = "button";
        button.textContent = stationImport[i].time;
        button.onclick = getIdOnClick;

        timeBox.appendChild(button);
    }
}


const stationCount = 3;
const st1 = getSt(3);
// console.log(st1);

const st1Import = getImport(st1);
const st1Export = getExport(st1);

// console.log(st1Import.length);

shawTime(st1Import);







const uploadFile = document.getElementById("upload-file");
const uploadBtn = document.getElementById("upload-btn");

uploadBtn.addEventListener("click", function () {
    uploadFile.click();
})

uploadFile.addEventListener("change", function() {
    if (uploadFile.value) {

    }
})

const file = {
    dom: document.getElementById("upload-file"),
    binary: null,
}

const reader = new FileReader();

reader.addEventListener("load", ()=> {
    file.binary = reader.result;
})

if (file.dom.files[0]) {
    reader.readAsArrayBuffer(file.dom.files[0]);
}

file.dom.addEventListener("change", () => {
if (reader.readyState === FileReader.LOADING) {
  reader.abort();
}

reader.readAsBinaryString(file.dom.files[0]);
});

// sendData is our main function
function sendData() {
// If there is a selected file, wait until it is read
// If there is not, delay the execution of the function
if (!file.binary && file.dom.files.length > 0) {
  setTimeout(sendData, 10);
  return;
}

// To construct our multipart form data request,
// We need an XMLHttpRequest instance
const XHR = new XMLHttpRequest();

// We need a separator to define each part of the request
const boundary = "blob";

// Store our body request in a string.
let data = "";

// So, if the user has selected a file
if (file.dom.files[0]) {
  // Start a new part in our body's request
  data += `--${boundary}\r\n`;

  // Describe it as form data
  data +=
    "content-disposition: form-data; " +
    // Define the name of the form data
    `name="${file.dom.name}"; ` +
    // Provide the real name of the file
    `filename="${file.dom.files[0].name}"\r\n`;
  // And the MIME type of the file
  data += `Content-Type: ${file.dom.files[0].type}\r\n`;

  // There's a blank line between the metadata and the data
  data += "\r\n";

  // Append the binary data to our body's request
  data += file.binary + "\r\n";
}

// Text data is simpler
// Start a new part in our body's request
data += `--${boundary}\r\n`;

// // Say it's form data, and name it
// data += `content-disposition: form-data; name="${text.name}"\r\n`;
// // There's a blank line between the metadata and the data
// data += "\r\n";

// // Append the text data to our body's request
// data += text.value + "\r\n";

// Once we are done, "close" the body's request
// data += `--${boundary}--`;

// Define what happens on successful data submission
// XHR.addEventListener("load", (event) => {
//   alert("Yeah! Data sent and response loaded.");
// });
//
// // Define what happens in case of an error
// XHR.addEventListener("error", (event) => {
//   alert("Oops! Something went wrong.");
// });
//
// // Set up our request
// XHR.open("GET", "/api/v1.0/put_data");
//
// // Add the required HTTP header to handle a multipart form data POST request
// XHR.setRequestHeader(
//   "Content-Type",
//   `multipart/form-data; boundary=${boundary}`,
// );
//
// // Send the data
// XHR.send(data);
  putData(data);
}

const form = document.getElementById("myForm");
form.addEventListener("file", (event) => {
    event.preventDefault();

    sendData();
})






//------------------------------------------------------------------------------------------------



function chosenStation() {
    const id = this.id;
    updatePage(id);
}

async function showStations() {
    const res = await getStationList();
    const data = res.data;

    const myDropdown = document.getElementById("myDropdown");

    console.log();

    for (let i = 0; i < data.length; i++) {
        const a = document.createElement("a");

        a.id = `${data[i].id}`;
        a.text = `${data[i].id}: ${data[i].name}`;
        a.onclick = chosenStation;
        myDropdown.appendChild(a);
    }
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
// Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// нужно заново отрисовать все объекты на сайте
let activeBtn = -1;
let trainsData = NaN;
async function updatePage(pageNumber) {
    trainsData = await getSheduleByStation(pageNumber)
    trainsData = trainsData.data;
    console.log(trainsData);
    updateEvents();
}


function updateEvents() {
    document.getElementById("time").innerHTML = "";
    shawTime(getImport(trainsData));
}

function updateRecommendations() {
    document.getElementById("recommendations").innerHTML = "";
    shawRecommendations();
}

function timeConverter(time) {
    time = time.toString();
    const min = time.slice(-2);
    const hour = time.replace(min, "");
    return hour + " : " + min;
}

function shawTime(stationImport) {
    const timeBox = document.getElementById("time");
    console.log(stationImport);
    for (let i = 0; i < stationImport.length; i++) {
        const button = document.createElement("button");
        button.id = `${stationImport[i].time}`;
        button.classList.add("btn", "btn-outline-light", "timeButton");
        button.type = "button";
        button.textContent = `${timeConverter(stationImport[i].time)} - Поезд №${stationImport[i].id}`;
        button.onclick = getIdOnClick;

        timeBox.appendChild(button);
    }
}

function getIdOnClick() {
    const id = this.id;
    activeBtn = id;
    updateRecommendations()
}

function shawRecommendations() {
    const recommendationBox = document.getElementById("recommendations");
    const incomingTrains = getImport(trainsData);
    const outcomingTrains = getExport(trainsData);

    const id = incomingTrains.find(el => el.time == activeBtn).id;

    console.log(incomingTrains);
    console.log(outcomingTrains);

    let incomingTrain = incomingTrains.find(el => el.id == id);
    let outcomingTrain = outcomingTrains.find(el => el.id == id);

    console.log(incomingTrain);
    console.log(outcomingTrain);

    const idParentTrain = outcomingTrain.id;

    incomingTrain = incomingTrain.onboard;
    outcomingTrain = outcomingTrain.onboard;

    console.log(incomingTrain);
    console.log(outcomingTrain);

    const dictIn = [];
    const dictOut = [];

    for (let j = 0; j < incomingTrain.length; j++) {
        const el = dictIn.find((el) => el.name == incomingTrain[j]);
        if (el) el.count++;
        else dictIn.push({name: incomingTrain[j], count: 1});
    }
    for (let j = 0; j < outcomingTrain.length; j++) {
        const el = dictOut.find((el) => el.name == outcomingTrain[j]);
        if (el) el.count++;
        else dictOut.push({name: outcomingTrain[j], count: 1});
    }

    let detach = [];
    let attach = [];

    for (let j = 0; j < dictIn.length; j++) {
        const name = dictIn[j].name;
        let param = dictOut.find(el => el.name == name);
        param = param? param.count : 0;
        const tmp = dictIn[j].count - param;
        console.log(dictIn[j]);
        if (tmp > 0) detach.push({name: name, count: tmp, trainParent: idParentTrain});
    }
    for (let j = 0; j < dictOut.length; j++) {
        const name = dictOut[j].name;
        let param = dictIn.find(el => el.name == name);
        param = param? param.count : 0;
        const tmp = dictOut[j].count - param;
        if (tmp > 0) attach.push({name: name, count: tmp, trainParent: idParentTrain});
    }

    console.log(detach);
    console.log(attach);
    showTasks(detach, attach);
}

function createIncome(name, count, parent) {
    const divIncome = document.createElement("div");
    divIncome.classList.add("income", "col-md-12");
    const pIn = document.createElement("p");
    pIn.textContent = `Присоединить ${count} вагон(ов) следующих до станции ${name} локомативом ${parent}`;
    divIncome.appendChild(pIn);
    return divIncome;
}

function createOutcome(name, count, parent) {
    const divOutcome = document.createElement("div");
    divOutcome.classList.add("outcome", "col-md-12");
    const pOut = document.createElement("p");
    pOut.textContent = `Отсоединить ${count} вагон(ов) следующих до станции ${name} локомативом ${parent}`;
    divOutcome.appendChild(pOut);
    return divOutcome;
}

function showTasks(detach, attach) {
    const recommendations = document.getElementById("recommendations");

    console.log(detach);
    console.log(attach);

    for (let i = 0; i < detach.length; i++) {
        const divIncome = createIncome(detach[i].name, detach[i].count, detach[i].trainParent);
        recommendations.appendChild(divIncome);
    }

    for (let i = 0; i < attach.length; i++) {
        const divOutcome = createOutcome(attach[i].name, attach[i].count, attach[i].trainParent);
        recommendations.appendChild(divOutcome);
    }
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


showStations();









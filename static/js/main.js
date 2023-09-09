// /* Когда пользователь нажимает на кнопку, переключаться раскрывает содержимое */
//
// const data = [
//     {'id': 0, 'time': 200, 'st': 1, 'free_carriage': null, 'onboard': [0, 1, 4, 0]},
//     {'id': 1, 'time': 200, 'st': 2, 'free_carriage': null, 'onboard': [0, 1, 4, 5]},
//     {'id': 0, 'time': 238, 'st': 1, 'free_carriage': 21, 'onboard': [0, 1, 4, 5]},
//     {'id': 1, 'time': 444, 'st': 3, 'free_carriage': null, 'onboard': [7, 0, 4, 0]},
//     {'id': 0, 'time': 448, 'st': 3, 'free_carriage': null, 'onboard': [0, 10, 4, 0]},
//     {'id': 1, 'time': 609, 'st': 3, 'free_carriage': null, 'onboard': [0, 1, 4, 10]},
//     {'id': 0, 'time': 611, 'st': 3, 'free_carriage': 21, 'onboard': [0, 1, 4, 5]},
//     {'id': 0, 'time': 1335, 'st': 2, 'free_carriage': null, 'onboard': [3, 1, 2, 0]},
//     {'id': 1, 'time': 240, 'st': 2, 'free_carriage': 10, 'onboard': [0, 1, 4, 5]},
//     {'id': 0, 'time': 1358, 'st': 2, 'free_carriage': null, 'onboard': [0, 5, 4, 5]}
// ];
//
// function getSt(ind) {
//     return data.filter(function (el) {
//         return el.st == ind;
//     });
// }
//
// const stationCount = 3;
// const st1 = getSt(1);
// console.log(st1);
//
// const myDropdown = document.getElementById("myDropdown");
// for (let i = 0; i < stationCount; i++) {
//     const a = document.createElement("a");
//     a.onclick = test;
//     a.href = "#";
//     a.text = `Station ${i + 1}`;
//
//     myDropdown.appendChild(a);
// }
//
// function myFunction() {
//   document.getElementById("myDropdown").classList.toggle("show");
// }
// // Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }
//
// function test(ind = undefined) {
//     console.log(ind);
// }
//
// function infoRender() {
//
// }
"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminateSpaces = exports.capitalizeFirst = void 0;
exports.generatePerson = generatePerson;
exports.createPublication = createPublication;
exports.showPublication = showPublication;
exports.computeSpace = computeSpace;
exports.fetchStateColor = fetchStateColor;
exports.retrieveFirstItem = retrieveFirstItem;
exports.locateById = locateById;
function generatePerson(personId, personName, personEmail) {
    return { id: personId, name: personName, email: personEmail, isActive: true };
}
function displayPerson(person) {
    console.log("Id: ".concat(person.id));
    console.log("Name: ".concat(person.name));
    if (person.email != undefined) {
        console.log("Email: ".concat(person.email));
    }
}
var personA = generatePerson(20, "Егор");
var personB = generatePerson(13, "Ktoto", "tryegor41@gmail.com");
console.log("Person A:");
displayPerson(personA);
console.log("\nPerson B:");
displayPerson(personB);
function createPublication(publication) {
    return publication;
}
function showPublication(publication) {
    console.log("Title: ".concat(publication.title));
    console.log("Author: ".concat(publication.author));
    if (publication.year != undefined) {
        console.log("Year: ".concat(publication.year));
    }
    console.log("Category: ".concat(publication.category));
}
var pubOne = {
    title: "Сетевое программирования",
    author: "Не помню",
    category: "non-fiction",
    year: 2022
};
var pubTwo = {
    title: "Совершенный код",
    author: "Макконел",
    category: "non-fiction",
};
var itemX = createPublication(pubOne);
var itemY = createPublication(pubTwo);
console.log("\nItem X:");
showPublication(itemX);
console.log("\nItem Y:");
showPublication(itemY);
function computeSpace(figure, dimensions) {
    var _a, _b;
    if (figure == "circle") {
        var r = (_a = dimensions.radius) !== null && _a !== void 0 ? _a : 0;
        return 3.14 * r * r;
    }
    else {
        var s = (_b = dimensions.side) !== null && _b !== void 0 ? _b : 0;
        return s * s;
    }
}
var circleArea = computeSpace('circle', { radius: 15 });
var squareArea = computeSpace('square', { side: 5 });
console.log("\nCircle Area: ".concat(circleArea));
console.log("Square Area: ".concat(squareArea));
var stateColorMapping = {
    active: 'green',
    inactive: 'gray',
    new: 'yellow',
    deleted: 'red'
};
function fetchStateColor(state) {
    return stateColorMapping[state];
}
console.log("\nactive: " + fetchStateColor('active'));
console.log("inactive: " + fetchStateColor('inactive'));
console.log("new: " + fetchStateColor('new'));
console.log("deleted: " + fetchStateColor('deleted'));
var capitalizeFirst = function (input, toUppercase) {
    if (toUppercase === void 0) { toUppercase = false; }
    if (!input)
        return '';
    var result = input[0].toUpperCase() + input.slice(1);
    if (toUppercase) {
        result = result.toUpperCase();
    }
    return result;
};
exports.capitalizeFirst = capitalizeFirst;
var eliminateSpaces = function (input, toUppercase) {
    if (toUppercase === void 0) { toUppercase = false; }
    if (!input)
        return '';
    var result = input.trim();
    if (toUppercase) {
        result = result.toUpperCase();
    }
    return result;
};
exports.eliminateSpaces = eliminateSpaces;
var textSample = "maybe baby";
var textSample2 = "   new year   ";
console.log("\ncapitalizeFirst: \"" + textSample + "\" ---> \"" + (0, exports.capitalizeFirst)(textSample) + "\"");
console.log("capitalizeFirst: \"" + textSample + "\" ---> \"" + (0, exports.capitalizeFirst)(textSample, true) + "\"");
console.log("eliminateSpaces: \"" + textSample2 + "\" ---> \"" + (0, exports.eliminateSpaces)(textSample2) + "\"");
console.log("eliminateSpaces: \"" + textSample2 + "\" ---> \"" + (0, exports.eliminateSpaces)(textSample2, true) + "\"");
function retrieveFirstItem(collection) {
    return collection.length > 0 ? collection[0] : undefined;
}
var numberCollection = [10, 20, 21, 30, 99];
var stringCollection = ["Один", "Два", "Три", "Четыре"];
var emptyCollection = [];
var firstNumber = retrieveFirstItem(numberCollection);
var firstString = retrieveFirstItem(stringCollection);
var firstEmpty = retrieveFirstItem(emptyCollection);
console.log("\nnumberCollection: " + firstNumber);
console.log("stringCollection: " + firstString);
console.log("emptyCollection: " + firstEmpty);
function locateById(elements, targetId) {
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        if (element.id === targetId) {
            return element;
        }
    }
    return undefined;
}
var identifiableItems = [
    { id: 1, name: "Светка" },
    { id: 2, name: "Викусик" },
    { id: 3, name: "Кирюшка" }
];
console.log("\ntry id = 1: " + ((_a = locateById(identifiableItems, 1)) === null || _a === void 0 ? void 0 : _a.name));
console.log("try id = 4: " + ((_b = locateById(identifiableItems, 4)) === null || _b === void 0 ? void 0 : _b.name));
console.log("try id = 3: " + ((_c = locateById(identifiableItems, 3)) === null || _c === void 0 ? void 0 : _c.name));

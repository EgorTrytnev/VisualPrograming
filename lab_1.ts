interface Person {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function generatePerson(personId: number, personName: string, personEmail?: string) : Person {
    return { id: personId, name: personName, email: personEmail, isActive: true };
}

function displayPerson(person: Person) : void {
    console.log(`Id: ${person.id}`);
    console.log(`Name: ${person.name}`);
    if(person.email != undefined) {
        console.log(`Email: ${person.email}`);
    }
}

const personA = generatePerson(20, "Егор");
const personB = generatePerson(13, "Ktoto", "tryegor41@gmail.com");

console.log("Person A:")
displayPerson(personA);
console.log("\nPerson B:")
displayPerson(personB);

type Category = 'fiction' | 'non-fiction';

interface Publication {
    title: string;
    author: string;
    year?: number;
    category: Category;
}

export function createPublication(publication: Publication) : Publication {
    return publication;
}

export function showPublication(publication: Publication) : void {
    console.log(`Title: ${publication.title}`);
    console.log(`Author: ${publication.author}`);
    if(publication.year != undefined) {
        console.log(`Year: ${publication.year}`);
    }
    console.log(`Category: ${publication.category}`);
}

const pubOne: Publication = {
    title: "Сетевое программирования",
    author: "Не помню",
    category: "non-fiction",
    year: 2022
};

const pubTwo: Publication = {
    title: "Совершенный код",
    author: "Макконел",
    category: "non-fiction",
};

const itemX = createPublication(pubOne);
const itemY = createPublication(pubTwo);

console.log("\nItem X:");
showPublication(itemX);
console.log("\nItem Y:");
showPublication(itemY);


export function computeSpace(figure: 'circle', dimensions: { radius: number }) : number;
export function computeSpace(figure: 'square', dimensions: { side: number }) : number;

export function computeSpace(figure: 'circle' | 'square', dimensions: { radius?: number; side?: number }) : number {
    if(figure == "circle") {
        const r = dimensions.radius ?? 0;
        return 3.14 * r * r;
    }
    else {
        const s = dimensions.side ?? 0;
        return s * s;
    }
}

const circleArea = computeSpace('circle', { radius: 15 });
const squareArea = computeSpace('square', { side: 5 });

console.log(`\nCircle Area: ${circleArea}`);
console.log(`Square Area: ${squareArea}`);

type State = 'active' | 'inactive' | 'new' | 'deleted';

const stateColorMapping: Record<State, string> = {
    active: 'green',
    inactive: 'gray',
    new: 'yellow',
    deleted: 'red'


};

export function fetchStateColor(state: State) : string {
    return stateColorMapping[state];
}

console.log("\nactive: " + fetchStateColor('active'));
console.log("inactive: " + fetchStateColor('inactive'));
console.log("new: " + fetchStateColor('new'));
console.log("deleted: " + fetchStateColor('deleted'));

type TextProcessor = (input: string, toUppercase?: boolean) => string;

export const capitalizeFirst: TextProcessor = (input, toUppercase = false) => {
    if(!input) return '';
    let result = input[0].toUpperCase() + input.slice(1);

    if(toUppercase) {
        result = result.toUpperCase();
    }

    return result;
}

export const eliminateSpaces: TextProcessor = (input, toUppercase = false) => {
    if(!input) return '';
    let result = input.trim();

    if(toUppercase) {
        result = result.toUpperCase();
    }

    return result;
}

let textSample = "Hi, my name is (who?), my name is(why?), chi chi SlimShady....";
let textSample2 = "   Wayaaaaaa";

console.log("\ncapitalizeFirst: \"" + textSample + "\" ---> \"" + capitalizeFirst(textSample) + "\"");
console.log("capitalizeFirst: \"" + textSample + "\" ---> \"" + capitalizeFirst(textSample, true) + "\"");

console.log("eliminateSpaces: \"" + textSample2 + "\" ---> \"" + eliminateSpaces(textSample2) + "\"");
console.log("eliminateSpaces: \"" + textSample2 + "\" ---> \"" + eliminateSpaces(textSample2, true) + "\"");



export function retrieveFirstItem<T>(collection: T[]): T | undefined {
    return collection.length > 0 ? collection[0] : undefined;
}

let numberCollection: number[] = [10, 20, 21, 30, 99];
let stringCollection: string[] = ["Один", "Два", "Три", "Четыре"];
let emptyCollection: number[] = [];

let firstNumber = retrieveFirstItem(numberCollection);
let firstString = retrieveFirstItem(stringCollection);
let firstEmpty = retrieveFirstItem(emptyCollection);

console.log("\nnumberCollection: " + firstNumber);
console.log("stringCollection: " + firstString);
console.log("emptyCollection: " + firstEmpty);


interface Identifiable {
    id: number;
    name: string;
}

export function locateById<T extends Identifiable>(elements: T[], targetId: number) : T | undefined {
    for(const element of elements) {
        if(element.id === targetId) {
            return element;
        }
    }
    return undefined;
}

let identifiableItems: Identifiable[] = [
    {id: 1, name: "Даша"},
    {id: 2, name: "Егор"},
    {id: 3, name: "Яся"}
];

console.log("\ntry id = 1: " + locateById(identifiableItems, 1)?.name);
console.log("try id = 4: " + locateById(identifiableItems, 4)?.name);
console.log("try id = 3: " + locateById(identifiableItems, 3)?.name);
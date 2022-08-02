const showArray = (arr) => {
    arr.forEach((place) => {
        let newPiece = document.createElement('div');
        newPiece.setAttribute("class", "square");
        newPiece.style.gridColumnStart = place.column;
        newPiece.style.gridRowStart = place.row;
        newPiece.innerText = count;
        document.getElementById('board').appendChild(newPiece);
        count++;
    });
    count = 0;
}

let places = [];

const pushSix = (arr, c1, r1, c2, r2) => {
    for (let i = 0; i < 6; i++) {
        arr.push({ column: (c1 + i * (c2 - c1) / 5), row: (r1 + i * (r2 - r1) / 5) });
    }
}

const addPlaces = (c1, r1, c2, r2, c3, r3, c4, r4, c5, r5) => {
    pushSix(places, c1, r1, c2, r2);
    pushSix(places, c3, r3, c4, r4);
    places.push({ column: c5, row: r5 });
}

addPlaces(1, 7, 6, 7, 7, 6, 7, 1, 8, 1);
addPlaces(9, 1, 9, 6, 10, 7, 15, 7, 15, 8);
addPlaces(15, 9, 10, 9, 9, 10, 9, 15, 8, 15);
addPlaces(7, 15, 7, 10, 6, 9, 1, 9, 1, 8);

places.push(places.shift());

let checkpoints = [0,8,13,21,26,34,39,47]

let count = 0;


const showPlaces = () => {
    showArray(places);
}

let corridor = [];

const addCorridor = (c1,r1,c2,r2) =>{
    let way = [];
    pushSix(way,c1,r1,c2,r2);
    corridor.push(way);
}

addCorridor(2,8,7,8);
addCorridor(8,2,8,7);
addCorridor(14,8,9,8);
addCorridor(8,14,8,9);

const showCorridor = () => {
    corridor.forEach((element)=>{
        showArray(element);
    });
}

const pavement = {
    places,
    corridor,
    showPlaces,
    showCorridor,
    checkpoints,
}

export default pavement;
// A function for testing the positioning system implemented for moving the pieces
let piece = document.getElementById('piece');
let position = 0;

const movePiece = () => {
    piece.style.gridColumnStart = places[position].column;
    piece.style.gridRowStart = places[position].row;
}

movePiece();

document.addEventListener('keydown',(e)=>{
    if(e.key == 'ArrowRight'){
        position++;
        if(position==52) position = 0;
        movePiece();
    }
    if(e.key == 'ArrowLeft'){
        position--;
        if(position==-1) position = 51;
        movePiece();
    }
});
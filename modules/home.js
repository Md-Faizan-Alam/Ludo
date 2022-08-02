const board = document.getElementById('board');

class Home {
    static homePieces = [];
    static noOfHome = 0;
    constructor(color,shift) {
        this.piece = [];

        this.home = document.createElement('div');
        this.home.setAttribute('class', 'home');
        this.home.style.gridColumn = `${shift[0]} / span 6`;
        this.home.style.gridRow = `${shift[1]} / span 6`;
        board.appendChild(this.home);

        this.innerHome = document.createElement('div');
        this.innerHome.setAttribute('class', 'innerHome');
        this.home.appendChild(this.innerHome);

        for (let i = 0; i < 4; i++) {
            this.piece.push(document.createElement('div'));
            this.piece[i].setAttribute('class', 'piece');
            this.piece[i].style.backgroundColor = color;
            this.piece[i].style.position = 'absolute';
            this.innerHome.appendChild(this.piece[i]);
            Home.homePieces.push(this.piece[i]);
        }

        this.piece[0].style.top = 0;
        this.piece[0].style.left = 0;
        this.piece[1].style.top = 0;
        this.piece[1].style.right = 0;
        this.piece[2].style.bottom = 0;
        this.piece[2].style.left = 0;
        this.piece[3].style.bottom = 0;
        this.piece[3].style.right = 0;
        
        Home.noOfHome++;
    }
}

new Home("red",[1,1]);
new Home("green",[10,1]);
new Home("yellow",[10,10]);
new Home("blue",[1,10]);

export default Home.homePieces;
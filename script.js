// script.js

const puzzleBoard = document.getElementById('puzzle-board');
const startButton = document.getElementById('start-button');
const levelSelect = document.getElementById('level-select');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let pieces = [];
let emptyIndex;
let movesCount = 0;
let score = 0;
let timer;
let seconds = 0;

function createPuzzle() {
    // Effacer les pièces existantes et réinitialiser les variables
    pieces = [];
    puzzleBoard.innerHTML = '';
    movesCount = 0;
    score = 0;
    seconds = 0;
    clearInterval(timer);

    // Récupérer le niveau sélectionné
    const level = parseInt(levelSelect.value);

    
    const piecesCount = level * level;
    puzzleBoard.style.gridTemplateColumns = `repeat(${level}, 100px)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${level}, 100px)`;

    for (let i = 1; i < piecesCount; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.textContent = i;
        piece.dataset.number = i;
        piece.addEventListener('click', () => movePiece(piece));
        pieces.push(piece);
        puzzleBoard.appendChild(piece);
    }
    
    // Ajouter la pièce vide (la dernière pièce)
    const emptyPiece = document.createElement('div');
    emptyPiece.classList.add('puzzle-piece', 'empty');
    emptyPiece.textContent = '';
    emptyPiece.dataset.number = piecesCount;
    pieces.push(emptyPiece);
    puzzleBoard.appendChild(emptyPiece);

    // Mélanger les pièces
    shufflePieces();

    // Réinitialiser l'affichage du score et du temps
    scoreDisplay.textContent = score;
    timerDisplay.textContent = '0s';

    // Désactiver le bouton de démarrage après le début du jeu
    startButton.disabled = true;

    // Démarrer le chronomètre
    timer = setInterval(updateTimer, 1000);
}

function shufflePieces() {
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach((piece, index) => {
        puzzleBoard.appendChild(piece);
        if (piece.textContent === '') {
            emptyIndex = index;
        }
    });
}

function movePiece(piece) {
    const currentIndex = pieces.indexOf(piece);

    if (isValidMove(currentIndex)) {
        swapPieces(currentIndex);
        movesCount++;
        score += 10;
        scoreDisplay.textContent = score;
        checkWinCondition();
    }
}

function isValidMove(currentIndex) {
    const level = Math.sqrt(pieces.length);
    const currentRow = Math.floor(currentIndex / level);
    const emptyRow = Math.floor(emptyIndex / level);
    const currentCol = currentIndex % level;
    const emptyCol = emptyIndex % level;

    return (
        (currentRow === emptyRow && Math.abs(currentCol - emptyCol) === 1) ||
        (currentCol === emptyCol && Math.abs(currentRow - emptyRow) === 1)
    );
}

function swapPieces(currentIndex) {
    const temp = pieces[currentIndex];
    pieces[currentIndex] = pieces[emptyIndex];
    pieces[emptyIndex] = temp;

    emptyIndex = currentIndex;

    // Mettre à jour l'affichage
    puzzleBoard.innerHTML = '';
    pieces.forEach(piece => puzzleBoard.appendChild(piece));
}

function checkWinCondition() {
    const level = Math.sqrt(pieces.length);
    const correctOrder = Array.from(Array(level * level - 1), (_, index) => index + 1);
    const currentOrder = pieces.slice(0, pieces.length - 1).map(piece => parseInt(piece.textContent));

    if (JSON.stringify(correctOrder) === JSON.stringify(currentOrder)) {
        pieces.forEach(piece => piece.classList.add('correct'));
        clearInterval(timer);
        alert(`Félicitations ! Vous avez résolu le puzzle en ${movesCount} coups avec un score de ${score}.`);
        startButton.disabled = false;
    }
}

function updateTimer() {
    seconds++;
    timerDisplay.textContent = `${seconds}s`;
}

// Événement au clic sur le bouton de démarrage
startButton.addEventListener('click', createPuzzle);

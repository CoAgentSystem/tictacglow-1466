// Game Logic for TicTacGlow
const gameState = {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    gameActive: true,
    scores: { xWins: 0, oWins: 0, draws: 0 },
    aiEnabled: true,
    aiDifficulty: 'medium' // easy, medium, hard
};

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

function initGame() {
    renderBoard();
    updateUI();
    setupDifficultyButtons();
    document.getElementById('reset-btn').addEventListener('click', resetGame);
}

function setupDifficultyButtons() {
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const difficulty = this.getAttribute('data-difficulty');
            setDifficulty(difficulty);
        });
    });
    updateDifficultyUI();
}

function setDifficulty(difficulty) {
    gameState.aiDifficulty = difficulty;
    updateDifficultyUI();
    // If it's AI's turn and game is active, trigger AI move with new difficulty
    if (gameState.gameActive && gameState.aiEnabled && gameState.currentPlayer === 'O') {
        setTimeout(makeAIMove, 300);
    }
}

function updateDifficultyUI() {
    // Update active button styling
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        const difficulty = button.getAttribute('data-difficulty');
        if (difficulty === gameState.aiDifficulty) {
            button.classList.remove('bg-gray-800');
            button.classList.add('bg-primary');
        } else {
            button.classList.remove('bg-primary');
            button.classList.add('bg-gray-800');
        }
    });
    // Update label
    const difficultyLabel = document.getElementById('difficulty-label');
    const difficultyText = gameState.aiDifficulty.charAt(0).toUpperCase() + gameState.aiDifficulty.slice(1);
    difficultyLabel.textContent = `Current: ${difficultyText}`;
}

function renderBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';
    gameState.board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.className = `cell ${cell.toLowerCase()}`;
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleCellClick(index));
        boardElement.appendChild(cellElement);
    });
}

function handleCellClick(index) {
    if (!gameState.gameActive || gameState.board[index] !== '') return;
    gameState.board[index] = gameState.currentPlayer;
    renderBoard();
    if (checkWinner()) {
        gameState.gameActive = false;
        updateScores(gameState.currentPlayer);
        document.getElementById('status').textContent = `${gameState.currentPlayer} Wins!`;
    } else if (isBoardFull()) {
        gameState.gameActive = false;
        gameState.scores.draws++;
        document.getElementById('status').textContent = 'Draw!';
    } else {
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        if (gameState.aiEnabled && gameState.currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
    updateUI();
}

function makeAIMove() {
    if (!gameState.gameActive) return;
    let moveIndex;
    if (gameState.aiDifficulty === 'easy') {
        moveIndex = getRandomMove();
    } else if (gameState.aiDifficulty === 'medium') {
        moveIndex = Math.random() > 0.5 ? getRandomMove() : getSmartMove();
    } else {
        moveIndex = getSmartMove();
    }
    if (moveIndex !== -1) {
        handleCellClick(moveIndex);
    }
}

function getRandomMove() {
    const emptyCells = gameState.board.map((cell, idx) => cell === '' ? idx : -1).filter(idx => idx !== -1);
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;
}

function getSmartMove() {
    // Try to win
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameState.board[a] === 'O' && gameState.board[b] === 'O' && gameState.board[c] === '') return c;
        if (gameState.board[a] === 'O' && gameState.board[c] === 'O' && gameState.board[b] === '') return b;
        if (gameState.board[b] === 'O' && gameState.board[c] === 'O' && gameState.board[a] === '') return a;
    }
    // Try to block
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameState.board[a] === 'X' && gameState.board[b] === 'X' && gameState.board[c] === '') return c;
        if (gameState.board[a] === 'X' && gameState.board[c] === 'X' && gameState.board[b] === '') return b;
        if (gameState.board[b] === 'X' && gameState.board[c] === 'X' && gameState.board[a] === '') return a;
    }
    // Take center if available
    if (gameState.board[4] === '') return 4;
    // Take corners
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(idx => gameState.board[idx] === '');
    if (emptyCorners.length > 0) return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    // Take any edge
    const edges = [1, 3, 5, 7];
    const emptyEdges = edges.filter(idx => gameState.board[idx] === '');
    if (emptyEdges.length > 0) return emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
    // Fallback to random
    return getRandomMove();
}

function checkWinner() {
    return winningCombinations.some(combo => {
        const [a, b, c] = combo;
        return gameState.board[a] && gameState.board[a] === gameState.board[b] && gameState.board[a] === gameState.board[c];
    });
}

function isBoardFull() {
    return gameState.board.every(cell => cell !== '');
}

function updateScores(winner) {
    if (winner === 'X') gameState.scores.xWins++;
    else if (winner === 'O') gameState.scores.oWins++;
}

function updateUI() {
    document.getElementById('current-player').textContent = gameState.currentPlayer;
    document.getElementById('x-wins').textContent = gameState.scores.xWins;
    document.getElementById('o-wins').textContent = gameState.scores.oWins;
    document.getElementById('draws').textContent = gameState.scores.draws;
}

function resetGame() {
    gameState.board = Array(9).fill('');
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    renderBoard();
    document.getElementById('status').textContent = 'Game in progress';
    updateUI();
}

// Initialize game on load
window.addEventListener('DOMContentLoaded', initGame);
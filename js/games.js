// Games Module

// Snake Game
function createSnakeGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <h2>🐍 Snake</h2>
        <div class="snake-score">Punkte: <span id="snake-score">0</span></div>
        <canvas id="snake-canvas" width="400" height="400"></canvas>
        <div class="game-info">
            <p>Steuerung: Pfeiltasten ↑ ↓ ← →</p>
            <button onclick="restartSnake()">Neustart</button>
        </div>
    `;

    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameLoop;

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        // Draw food
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw snake
        snake.forEach((segment, index) => {
            const gradient = ctx.createLinearGradient(
                segment.x * gridSize,
                segment.y * gridSize,
                (segment.x + 1) * gridSize,
                (segment.y + 1) * gridSize
            );
            gradient.addColorStop(0, index === 0 ? '#2ed573' : '#7bed9f');
            gradient.addColorStop(1, index === 0 ? '#26de81' : '#26de81');
            ctx.fillStyle = gradient;
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });
    }

    function moveSnake() {
        if (dx === 0 && dy === 0) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snake-score').textContent = score;
            placeFood();
        } else {
            snake.pop();
        }

        drawGame();
    }

    function placeFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        food = newFood;
    }

    function gameOver() {
        clearInterval(gameLoop);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e94560';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Punkte: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }

    function handleKeydown(e) {
        switch (e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    }

    window.restartSnake = function() {
        clearInterval(gameLoop);
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        document.getElementById('snake-score').textContent = score;
        placeFood();
        gameLoop = setInterval(moveSnake, 150);
        drawGame();
    };

    document.addEventListener('keydown', handleKeydown);
    drawGame();
    gameLoop = setInterval(moveSnake, 150);

    // Cleanup function
    window.cleanupSnake = function() {
        clearInterval(gameLoop);
        document.removeEventListener('keydown', handleKeydown);
    };
}

// Tic-Tac-Toe Game
function createTicTacToe() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <h2>❌⭕ Tic-Tac-Toe</h2>
        <div class="ttt-status" id="ttt-status">Spieler X ist dran</div>
        <div class="ttt-board" id="ttt-board"></div>
        <button class="ttt-reset" onclick="resetTicTacToe()">Neues Spiel</button>
    `;

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function renderBoard() {
        const boardElement = document.getElementById('ttt-board');
        boardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'ttt-cell';
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => handleCellClick(index));
            boardElement.appendChild(cellElement);
        });
    }

    function handleCellClick(index) {
        if (board[index] !== '' || !gameActive) return;

        board[index] = currentPlayer;
        renderBoard();

        if (checkWin()) {
            document.getElementById('ttt-status').textContent = `Spieler ${currentPlayer} gewinnt! 🎉`;
            gameActive = false;
            return;
        }

        if (board.every(cell => cell !== '')) {
            document.getElementById('ttt-status').textContent = 'Unentschieden! 🤝';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('ttt-status').textContent = `Spieler ${currentPlayer} ist dran`;
    }

    function checkWin() {
        return winConditions.some(condition => {
            return condition.every(index => board[index] === currentPlayer);
        });
    }

    window.resetTicTacToe = function() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        document.getElementById('ttt-status').textContent = 'Spieler X ist dran';
        renderBoard();
    };

    renderBoard();
}

// Memory Game
function createMemoryGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <h2>🧠 Memory</h2>
        <div class="memory-stats">
            <span>Züge: <strong id="memory-moves">0</strong></span> | 
            <span>Paare: <strong id="memory-pairs">0</strong>/8</span>
        </div>
        <div class="memory-board" id="memory-board"></div>
        <button onclick="resetMemory()">Neues Spiel</button>
    `;

    const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎬', '🎤'];
    let cards = [...emojis, ...emojis];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderBoard() {
        const boardElement = document.getElementById('memory-board');
        boardElement.innerHTML = '';
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.addEventListener('click', () => flipCard(card));
            boardElement.appendChild(card);
        });
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('memory-moves').textContent = moves;
            canFlip = false;

            if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
                flippedCards.forEach(c => c.classList.add('matched'));
                matchedPairs++;
                document.getElementById('memory-pairs').textContent = matchedPairs;
                flippedCards = [];
                canFlip = true;

                if (matchedPairs === 8) {
                    setTimeout(() => {
                        alert(`Gewonnen! Du hast ${moves} Züge gebraucht! 🎉`);
                    }, 300);
                }
            } else {
                setTimeout(() => {
                    flippedCards.forEach(c => {
                        c.classList.remove('flipped');
                        c.textContent = '';
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }

    window.resetMemory = function() {
        cards = shuffle([...emojis, ...emojis]);
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        canFlip = true;
        document.getElementById('memory-moves').textContent = 0;
        document.getElementById('memory-pairs').textContent = 0;
        renderBoard();
    };

    cards = shuffle(cards);
    renderBoard();
}

// Open game modal
function openGame(gameType) {
    const modal = document.getElementById('game-modal');
    modal.classList.add('active');

    // Cleanup previous game
    if (typeof cleanupSnake === 'function') cleanupSnake();

    switch (gameType) {
        case 'snake':
            createSnakeGame();
            break;
        case 'tictactoe':
            createTicTacToe();
            break;
        case 'memory':
            createMemoryGame();
            break;
    }
}

// Close game modal
function closeGame() {
    const modal = document.getElementById('game-modal');
    modal.classList.remove('active');
    document.getElementById('game-container').innerHTML = '';

    if (typeof cleanupSnake === 'function') cleanupSnake();
}

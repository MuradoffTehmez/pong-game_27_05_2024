const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');
const player1UpBtn = document.getElementById('player1Up');
const player1DownBtn = document.getElementById('player1Down');
const player2UpBtn = document.getElementById('player2Up');
const player2DownBtn = document.getElementById('player2Down');

// Game dimensions
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

if (canvasWidth > 800) {
    canvasWidth = 800;
}

if (canvasHeight > 600) {
    canvasHeight = 600;
}

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Ball
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballRadius = 10;

// Paddles
const paddleHeight = 100;
const paddleWidth = 15;
let player1Y = (canvasHeight - paddleHeight) / 2;
let player2Y = (canvasHeight - paddleHeight) / 2;

// Score
let player1Score = 0;
let player2Score = 0;

// Keyboard control
let player1Up = false;
let player1Down = false;
let player2Up = false;
let player2Down = false;

// Touch control
let touchStartY1 = null;
let touchStartY2 = null;

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Draw paddles
    ctx.beginPath();
    ctx.rect(20, player1Y, paddleWidth, paddleHeight);
    ctx.rect(canvasWidth - 20 - paddleWidth, player2Y, paddleWidth, paddleHeight);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Show score
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Move paddles
    if (player1Up && player1Y > 0) {
        player1Y -= 7;
    } else if (player1Down && player1Y < canvasHeight - paddleHeight) {
        player1Y += 7;
    }

    if (player2Up && player2Y > 0) {
        player2Y -= 7;
    } else if (player2Down && player2Y < canvasHeight - paddleHeight) {
        player2Y += 7;
    }

    // Ball bounces off walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvasHeight) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball bounces off paddles
    if (ballX - ballRadius < 20 + paddleWidth) {
        if (ballY > player1Y && ballY < player1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX * 1.1; // Increase speed
        } else {
            player2Score++;
            resetBall();
        }
    } else if (ballX + ballRadius > canvasWidth - 20 - paddleWidth) {
        if (ballY > player2Y && ballY < player2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX * 1.1; // Increase speed
        } else {
            player1Score++;
            resetBall();
        }
    }

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Reset ball position
function resetBall() {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = 5 * (Math.random() < 0.5 ? -1 : 1);
    ballSpeedY = 5 * (Math.random() < 0.5 ? -1 : 1);
}

// Keyboard control
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    if (event.keyCode === 87) { // W
        player1Up = true;
    } else if (event.keyCode === 83) { // S
        player1Down = true;
    } else if (event.keyCode === 38) { // Up arrow
        player2Up = true;
    } else if (event.keyCode === 40) { // Down arrow
        player2Down = true;
    }
}

function keyUpHandler(event) {
    if (event.keyCode === 87) { // W
        player1Up = false;
    } else if (event.keyCode === 83) { // S
        player1Down = false;
    } else if (event.keyCode === 38) { // Up arrow
        player2Up = false;
    } else if (event.keyCode === 40) { // Down arrow
        player2Down = false;
    }
}

// Touch control
canvas.addEventListener('touchstart', touchStartHandler);
canvas.addEventListener('touchmove', touchMoveHandler);

function touchStartHandler(event) {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const x = touch.clientX;
        const y = touch.clientY;
        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;

        if (canvasX < canvasWidth / 2) {
            touchStartY1 = canvasY;
        } else {
            touchStartY2 = canvasY;
        }
    }
}

function touchMoveHandler(event) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const x = touch.clientX;
        const y = touch.clientY;
        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;

        if (canvasX < canvasWidth / 2) {
            const deltaY = canvasY - touchStartY1;
            player1Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player1Y + deltaY));
            touchStartY1 = canvasY;
        } else {
            const deltaY = canvasY - touchStartY2;
            player2Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player2Y + deltaY));
            touchStartY2 = canvasY;
        }
    }
}

// Button controls
player1UpBtn.addEventListener('touchstart', () => player1Up = true);
player1UpBtn.addEventListener('touchend', () => player1Up = false);
player1DownBtn.addEventListener('touchstart', () => player1Down = true);
player1DownBtn.addEventListener('touchend', () => player1Down = false);
player2UpBtn.addEventListener('touchstart', () => player2Up = true);
player2UpBtn.addEventListener('touchend', () => player2Up = false);
player2DownBtn.addEventListener('touchstart', () => player2Down = true);
player2DownBtn.addEventListener('touchend', () => player2Down = false);

// Additional features
let gameStarted = false;
let gameOverModal = null;

function startGame() {
    gameStarted = true;
    player1Score = 0;
    player2Score = 0;
    resetBall();
    hideGameOverModal();
    gameLoop();
}

function stopGame() {
    gameStarted = false;
    showGameOverModal();
}

function showGameOverModal() {
    if (!gameOverModal) {
        gameOverModal = document.createElement('div');
        gameOverModal.id = 'gameOverModal';
        gameOverModal.style.position = 'absolute';
        gameOverModal.style.top = '50%';
        gameOverModal.style.left = '50%';
        gameOverModal.style.transform = 'translate(-50%, -50%)';
        gameOverModal.style.backgroundColor = '#fff';
        gameOverModal.style.padding = '20px';
        gameOverModal.style.borderRadius = '5px';
        gameOverModal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        gameOverModal.style.zIndex = '999';

        const winnerText = document.createElement('p');
        winnerText.id = 'winnerText';
        winnerText.style.fontSize = '24px';
        winnerText.style.marginBottom = '20px';

        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart';
        restartBtn.style.fontSize = '16px';
        restartBtn.style.padding = '10px 20px';
        restartBtn.style.backgroundColor = '#4CAF50';
        restartBtn.style.color = '#fff';
        restartBtn.style.border = 'none';
        restartBtn.style.borderRadius = '5px';
        restartBtn.style.cursor = 'pointer';
        restartBtn.addEventListener('click', startGame);

        gameOverModal.appendChild(winnerText);
        gameOverModal.appendChild(restartBtn);
        document.body.appendChild(gameOverModal);
    }

    const winnerText = document.getElementById('winnerText');
    if (player1Score === 10) {
        winnerText.textContent = 'Player 1 Wins!';
    } else if (player2Score === 10) {
        winnerText.textContent = 'Player 2 Wins!';
    }
}

function hideGameOverModal() {
    if (gameOverModal) {
        gameOverModal.style.display = 'none';
    }
}

// Game over condition
function checkGameOver() {
    if (player1Score === 10 || player2Score === 10) {
        stopGame();
    }
}

// Start the game
startGame();
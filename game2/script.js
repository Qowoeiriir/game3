const player = document.getElementById('player');
const lifeCountDisplay = document.getElementById('lifeCount');

let lifeCount = 5;
lifeCountDisplay.textContent = lifeCount;

const playerName = prompt("Пожалуйста, введите ваше имя", "Игрок");

const playerNameDisplay = document.getElementById('playerNameDisplay');
playerNameDisplay.textContent = playerName;

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
}

let clockInterval = setInterval(updateClock, 1000);

let gameSeconds = 0;
function updateGameTime() {
    const minutes = Math.floor(gameSeconds / 60).toString().padStart(2, '0');
    const seconds = (gameSeconds % 60).toString().padStart(2, '0');
    document.getElementById('gameTime').textContent = `${minutes}:${seconds}`;
    gameSeconds++;
}

let gameTimeInterval = setInterval(updateGameTime, 1000);

let playerX = 10;
let playerY = 10;
player.style.top = playerY + 'px';
player.style.left = playerX + 'px';

let monsters = [];
let traps = [];

function createMonster() {
    const newMonster = document.createElement('div');
    newMonster.classList.add('monster');
    newMonster.style.left = Math.random() * 1400 + 'px'; 
    newMonster.style.top = Math.random() * 560 + 'px'; 
    document.getElementById('gameBoard').appendChild(newMonster);
    monsters.push(newMonster);
}

function createTrap() {
    const newTrap = document.createElement('div');
    newTrap.classList.add('trap');
    newTrap.style.left = Math.random() * 1400 + 'px'; 
    newTrap.style.top = Math.random() * 560 + 'px'; 
    document.getElementById('gameBoard').appendChild(newTrap);
    traps.push(newTrap);
}

function moveMonster(monster) {
    const randomDirection = Math.floor(Math.random() * 4); // 0 - up, 1 - down, 2 - left, 3 - right

    switch (randomDirection) {
        case 0:
            monster.style.top = parseInt(monster.style.top) - 10 + 'px';
            break;
        case 1:
            monster.style.top = parseInt(monster.style.top) + 10 + 'px';
            break;
        case 2:
            monster.style.left = parseInt(monster.style.left) - 10 + 'px';
            break;
        case 3:
            monster.style.left = parseInt(monster.style.left) + 10 + 'px';
            break;
    }

    if (parseInt(monster.style.left) < -20 || parseInt(monster.style.left) > 1500 ||
        parseInt(monster.style.top) < -20 || parseInt(monster.style.top) > 600) {
        monster.remove();
        monsters.splice(monsters.indexOf(monster), 1);
    }
}

function updateMonsters() {
    for (let i = 0; i < monsters.length; i++) {
        moveMonster(monsters[i]);
    }
}

function updateTraps() {
    for (let i = 0; i < traps.length; i++) {
        // Add trap movement logic here if needed
    }
}

function generateMonster() {
    createMonster();
    createMonster();
    createMonster();
    createMonster();
    createMonster();
    createMonster();
    createMonster();
    createMonster();
}

function generateTraps() {
    createTrap();
    createTrap();
}

setInterval(generateMonster, 3000);
setInterval(generateTraps, 3000);

let isPaused = false;

function updateMonsterPositions() {
    if (!isPaused) {
        updateMonsters();
        updateTraps();

        for (let i = 0; i < monsters.length; i++) {
            const monster = monsters[i];
            const playerCenterX = playerX + 2; 
            const playerCenterY = playerY + 2; 

            if (parseInt(monster.style.left) < playerCenterX + 20 &&
                parseInt(monster.style.left) + 20 > playerCenterX &&
                parseInt(monster.style.top) < playerCenterY + 20 &&
                parseInt(monster.style.top) + 20 > playerCenterY) {
                lifeCount--;
                lifeCountDisplay.textContent = lifeCount;
                monster.remove();
                monsters.splice(i, 1);
            }
        }

        for (let i = 0; i < traps.length; i++) {
            const trap = traps[i];
            const playerCenterX = playerX + 2; 
            const playerCenterY = playerY + 2; 

            if (parseInt(trap.style.left) < playerCenterX + 20 &&
                parseInt(trap.style.left) + 20 > playerCenterX &&
                parseInt(trap.style.top) < playerCenterY + 20 &&
                parseInt(trap.style.top) + 20 > playerCenterY) {
                lifeCount--;
                lifeCountDisplay.textContent = lifeCount;
                trap.remove();
                traps.splice(i, 1);
            }
        }
    }

    if (lifeCount === 0) {
        clearInterval(monsterInterval);
        clearInterval(gameTimeInterval);
        clearInterval(clockInterval);
        const gameOverMessage = "Game Over! Your score: " + gameSeconds + " seconds";
        alert(gameOverMessage);
        const playAgain = confirm("Хотите сыграть еще раз?");
        if (playAgain) {
            lifeCount = 5;
            lifeCountDisplay.textContent = lifeCount;
            gameSeconds = 0;
            gameTimeInterval = setInterval(updateGameTime, 1000);
            clockInterval = setInterval(updateClock, 1000);
            monsters.forEach(monster => monster.remove());
            traps.forEach(trap => trap.remove());
            monsters = [];
            traps = [];
            createMonster();
            createMonster();
            createTrap();
            createTrap();
            monsterInterval = setInterval(updateMonsterPositions, 100);
        }
    }
}

let monsterInterval = setInterval(updateMonsterPositions, 100);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(clockInterval);
            clearInterval(gameTimeInterval);
            clearInterval(monsterInterval);
        } else {
            clockInterval = setInterval(updateClock, 1000);
            gameTimeInterval = setInterval(updateGameTime, 1000);
            monsterInterval = setInterval(updateMonsterPositions, 100);
        }
    } else if (!isPaused) {
        switch (event.key) {
            case 'ArrowUp':
                if (playerY > 0) {
                    playerY -= 10;
                    player.style.top = playerY + 'px';
                }
                break;
            case 'ArrowDown':
                if (playerY < 580) {
                    playerY += 10;
                    player.style.top = playerY + 'px';
                }
                break;
            case 'ArrowLeft':
                if (playerX > 0) {
                    playerX -= 10;
                    player.style.left = playerX + 'px';
                }
                break;
            case 'ArrowRight':
                if (playerX < 1480) {
                    playerX += 10;
                    player.style.left = playerX + 'px';
                }
                break;
        }
        if (playerX >= 1460 && playerY >= 550) {
            showResults();
        }
        updateMonsters(); 
        updateTraps();
    }
});
function showResults() {
    clearInterval(monsterInterval);
    clearInterval(gameTimeInterval);
    clearInterval(clockInterval);
    
    const resultsScreen = document.createElement('div');
    resultsScreen.id = 'resultsScreen';
    
    const gameTimeResult = document.createElement('p');
    gameTimeResult.textContent = `Время в игре: ${gameSeconds} секунд`;
    
    const monsterCountResult = document.createElement('p');
    monsterCountResult.textContent = `Количество монстров: ${5 - lifeCount}`;
    
    const trapCountResult = document.createElement('p');
    trapCountResult.textContent = `Количество ловушек: ${2 - traps.length}`;
    
    const lifeCountResult = document.createElement('p');
    lifeCountResult.textContent = `Оставшиеся жизни: ${lifeCount}`;
    
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Играть сначала';
    playAgainButton.addEventListener('click', () => {
        resultsScreen.remove();
        lifeCount = 5;
        lifeCountDisplay.textContent = lifeCount;
        gameSeconds = 0;
        gameTimeInterval = setInterval(updateGameTime, 1000);
        clockInterval = setInterval(updateClock, 1000);
        monsters.forEach(monster => monster.remove());
        traps.forEach(trap => trap.remove());
        monsters = [];
        traps = [];
        createMonster();
        createMonster();
        createTrap();
        createTrap();
        monsterInterval = setInterval(updateMonsterPositions, 100);
    });
    
    resultsScreen.appendChild(gameTimeResult);
    resultsScreen.appendChild(monsterCountResult);
    resultsScreen.appendChild(trapCountResult);
    resultsScreen.appendChild(lifeCountResult);
    resultsScreen.appendChild(playAgainButton);
    
    const newWindow = window.open('', 'resultsWindow', 'width=400,height=400');
    newWindow.document.body.appendChild(resultsScreen);
}

let resultsGenerated = false;

setInterval(() => {
    if (gameSeconds > 60 && !resultsGenerated) {
        showResults();
        resultsGenerated = true;
    }
}, 1000);



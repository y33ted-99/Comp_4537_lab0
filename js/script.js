// Chatgpt was used for assitance with button scramble and position logic
class Game {
    constructor(ui, buttonManager) {
        this.ui = ui;
        this.buttonManager = buttonManager;
        this.numButtons = 0;
        this.originalOrder = [];
        this.userOrder = [];
        this.currentClickIndex = 0;
        
        this.ui.goButton.addEventListener('click', () => this.startGame());
    }

    startGame() {
        const num = parseInt(this.ui.numInput.value);
        if (isNaN(num) || num < 3 || num > 7) {
            alert("Please enter a valid number between 3 and 7.");
            return;
        }
        
        
        this.resetGame();
        this.numButtons = num;
        this.originalOrder = this.buttonManager.createButtons(this.numButtons);
        setTimeout(() => this.scrambleButtons(this.numButtons), num * 1000);
    }

    resetGame() {
        this.buttonManager.removeButtons();
        this.ui.clearGameContainer();
        this.originalOrder = [];
        this.userOrder = [];
        this.currentClickIndex = 0;
    }

    scrambleButtons(n) {
        let iterations = 0;
        const scrambleInterval = setInterval(() => {
            if (iterations === n) {
                clearInterval(scrambleInterval);
                this.buttonManager.hideNumbers();
                this.enableButtonClick();
                return;
            }
            this.buttonManager.scrambleButtons();
            iterations++;
        }, 2000);
    }

    enableButtonClick() {
        this.buttonManager.buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleButtonClick(index));
        });
    }

    handleButtonClick(index) {
        if (this.originalOrder[this.currentClickIndex] === index) {
            this.buttonManager.revealButton(index);
            this.currentClickIndex++;
            if (this.currentClickIndex === this.numButtons) {
                this.ui.displayMessage(messages.excellentMemory);
            }
        } else {
            this.ui.displayMessage(messages.wrongOrder);
            this.buttonManager.revealAll();
        }
    }
}

class Button {
    constructor(ui) {
        this.ui = ui;
        this.buttons = [];
    }

    createButtons(num) {
        this.buttons = [];
        const order = [];
        for (let i = 0; i < num; i++) {
            const btn = document.createElement('button');
            btn.classList.add('memory-btn');
            btn.style.backgroundColor = this.getRandomColor();
            btn.innerText = i + 1;
            this.ui.gameContainer.appendChild(btn);
            this.buttons.push(btn);
            order.push(i);
        }
        this.positionButtons();
        return order;
    }

    positionButtons() {
        const containerWidth = this.ui.gameContainer.offsetWidth;
        const buttonWidth = this.buttons[0].offsetWidth;
        this.buttons.forEach((btn, index) => {
            btn.style.left = `${(containerWidth / this.buttons.length) * index}px`;
            btn.style.top = '50px';
        });
    }

    scrambleButtons() {
        const containerWidth = this.ui.gameContainer.offsetWidth;
        const containerHeight = this.ui.gameContainer.offsetHeight;

        this.buttons.forEach(btn => {
            const randomLeft = Math.random() * (containerWidth - btn.offsetWidth);
            const randomTop = Math.random() * (containerHeight - btn.offsetHeight);
            btn.style.left = `${randomLeft}px`;
            btn.style.top = `${randomTop}px`;
        });
    }

    hideNumbers() {
        this.buttons.forEach(btn => btn.innerText = '');
    }

    revealButton(index) {
        this.buttons[index].innerText = index + 1;
    }

    revealAll() {
        this.buttons.forEach((btn, index) => btn.innerText = index + 1);
    }

    removeButtons() {
        this.buttons.forEach(btn => btn.remove());
        this.buttons = [];
    }

    getRandomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }
}

class UI {
    constructor() {
        this.numLabel = document.getElementById('num-label');
        this.numInput = document.getElementById('num-input');
        this.goButton = document.getElementById('go-button');
        this.gameContainer = document.getElementById('game-container');
        
        this.numLabel.innerText = messages.inputPrompt;
    }

    clearGameContainer() {
        this.gameContainer.innerHTML = '';
    }

    displayMessage(message) {
        alert(message);
    }
}

const ui = new UI();
const buttonManager = new Button(ui);
const gameController = new Game(ui, buttonManager);


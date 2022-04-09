import { LightningElement, track } from 'lwc';

export default class Snake extends LightningElement {

    width;
    height;
    blockSize = 20;
    rendered = false;
    @track blocks = [];
    xHead;
    yHead;
    xSpeed;
    ySpeed;
    speed;
    xMax;
    yMax;
    xFood;
    yFood;
    justEat;
    tailX = [];
    tailY = [];
    callMove;
    callEat;
    score;

    displayBlocks() {

        this.width = this.template.querySelector(".container").clientWidth;
        this.height = this.template.querySelector(".container").clientHeight;
        this.xMax = Math.floor(this.width/this.blockSize);
        this.yMax = Math.floor(this.height/this.blockSize);

        console.log("w : " + this.width + " ; h : " + this.height + " xMax : " + this.xMax + " ; yMax :" + this.yMax);

        let tempBlocks = [];

        for (let i = 0; i < this.yMax; i++) {
            for (let j = 0; j < this.xMax; j++) {

                let obj = {id: `${j}:${i}`, class : "block"};
                tempBlocks.push(obj);
            }
            
        }
        this.blocks = tempBlocks;
    }

    init() {
        this.xHead = 0;
        this.yHead = 0;

        this.speed = 1;

        this.xSpeed = 1;
        this.ySpeed = 0;

        this.score = 0;

        let currentPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`);
        this.blocks[currentPos].class = "block snake";

        this.callMove = setInterval(() => this.moveSnake(), 300 / this.speed);
        this.callEat = setInterval(() => this.eat(), 300 / this.speed);

    }

    setSpeed() {
        clearInterval(this.callMove);
        clearInterval(this.callEat);
        this.callMove = setInterval(() => this.moveSnake(), 300 / this.speed);
        this.callEat = setInterval(() => this.eat(), 300 / this.speed);
    }

    moveSnake() {
        
        // get head's position
        this.currentPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`
        );

        if (!this.justEat) {
            // change previous head's position's class to .block
            if (this.tailX.length == 0) {
                this.blocks[this.currentPos].class = "block";
            }

            // add head's position before update
            this.tailX.push(`${this.xHead}`);
            this.tailY.push(`${this.yHead}`);

            // add speed to get new head's position
            this.xHead += this.xSpeed;
            this.yHead += this.ySpeed;

            //touched the wall game over
            if ((this.xHead >= this.xMax) || (this.yHead >= this.yMax) || (this.xHead < 0) || (this.yHead < 0)) {
                this.gameOver();
            }

            // change updated head's position class to .block snake
            let nextPos = this.blocks.findIndex(
                (x) => x.id === `${this.xHead}:${this.yHead}`
            );
            this.blocks[nextPos].class = "block snake";

            // delete last element in tail[] and change his class to .block
            console.log("this.tailX.length : " + this.tailX.length)
            if (this.tailX.length != 0) {
                let tX = this.tailX.shift();
                let tY = this.tailY.shift();

                let tXToDelete = this.blocks.findIndex(
                    (x) => x.id === `${tX}:${tY}`);
                this.blocks[tXToDelete].class = 'block';

            }

            if (this.tailX.length != 0) {

                // for each element in tail[], change his class to .block snake (in blocks[])
                for (let i = 0; i < this.tailX.length; i++) {
                let tailChange = this.blocks.findIndex(
                    (x) => x.id === `${this.tailX[i]}:${this.tailY[i]}`);
        
                this.blocks[tailChange].class = "block snake";
                }

            }



        } else { // (justEat)
            this.justEat = false;

            this.tailX.push(`${this.xHead}`);
            this.tailY.push(`${this.yHead}`);

            this.xHead += this.xSpeed;
            this.yHead += this.ySpeed;

            if ((this.xHead >= this.xMax) || (this.yHead >= this.yMax) || (this.xHead < 0) || (this.yHead < 0)) {
                this.gameOver();
            }

            let nextPos = this.blocks.findIndex(
                (x) => x.id === `${this.xHead}:${this.yHead}`);
            this.blocks[nextPos].class = "block snake";

            for (let i = 0; i < this.tailX.length; i++) {
                let tailChange = this.blocks.findIndex(
                    (x) => x.id === `${this.tailX[i]}:${this.tailY[i]}`);
                this.blocks[tailChange].class = "block snake";
            }
        }
    }

    gameOver() {
        console.log("game over");
        this.xHead = 0;
        this.yHead = 0;
        this.xSpeed = 1;
        this.ySpeed = 0;
        this.speed = 1;
        this.setSpeed();
        this.score = 0;
        this.tailX = [];
        this.tailY = [];
        this.displayBlocks();
        this.addFood();
    }

    controls() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp':
                    this.xSpeed = 0;
                    this.ySpeed = -1;
                    break;
                case 'ArrowDown':
                    this.xSpeed = 0;
                    this.ySpeed = 1;
                    break;
                case 'ArrowLeft':
                    this.xSpeed = -1;
                    this.ySpeed = 0;
                    break;
                case 'ArrowRight':
                    this.xSpeed = 1;
                    this.ySpeed = 0;
                    break;
                default:
                    break;
            }
        });
    }

    addFood() {
        this.xFood = Math.floor(Math.random() * this.xMax);
        this.yFood = Math.floor(Math.random() * this.yMax);

        let currentFoodPos = this.blocks.findIndex(
            (x) => x.id === `${this.xFood}:${this.yFood}`);
        this.blocks[currentFoodPos].class = 'block food';
    }

    eat() {
        if (this.xFood == this.xHead && this.yFood == this.yHead) {
            console.log("\nbien mangé\n\n");
            this.addFood();
            this.justEat = true;
            this.speed += 0.1;
            this.setSpeed();
            this.score += 1;
        }
    }

    get speed() {
        return (+this.speed.toFixed(1));
    }

    get score() {
        return this.score;
    }

    renderedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.displayBlocks();
            this.init();
            this.addFood();
            this.controls();

            window.addEventListener('resize', () => {
                console.log("window resized");
                this.gameOver();
            });
        }
    }
}
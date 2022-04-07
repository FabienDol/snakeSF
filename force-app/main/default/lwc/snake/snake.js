import { LightningElement, track } from 'lwc';

export default class Snake extends LightningElement {

    blockSize = 40;
    rendered = false;
    @track blocks = [];
    xHead;
    yHead;
    xSpeed;
    ySpeed;
    width;
    height;
    xMax;
    yMax;
    xFood;
    yFood;
    snake = [];

    displayBlocks() {
        console.log("displayBlocks appelé");

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

        this.xSpeed = 1;
        this.ySpeed = 0;

        let currentPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`
        );

        this.blocks[currentPos].class = "block snake";

        setInterval(() => this.moveSnake(), 500);
        setInterval(() => this.eat(), 500);

    }

    moveSnake() {
        let currentPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`
        );

        this.blocks[currentPos].class = "block";

        console.log("avant : " + this.xHead + ", " + this.yHead);

        this.xHead += this.xSpeed;
        this.yHead += this.ySpeed;

        // loop when out of map
        if (this.xHead >= this.xMax) {
            this.xHead = 0;
        } else if (this.yHead >= this.yMax) {
            this.yHead = 0;
        } else if (this.xHead < 0) {
            this.xHead = this.xMax -1;
        } else if (this.yHead < 0) {
            this.yHead = this.yMax -1;
        }

        let nextPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`
        );

        this.blocks[nextPos].class = "block snake";


        console.log("après : " + this.xHead + ", " + this.yHead);
        console.log("moveSnake appelé");

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
            (x) => x.id === `${this.xFood}:${this.yFood}`
        );

        this.blocks[currentFoodPos].class = 'block food';

    }

    eat() {
        console.log(this.xFood + " " + this.xHead + "   ;   " + this.yFood + " " + this.yHead);

        if (this.xFood == this.xHead && this.yFood == this.yHead) {
            console.log("\nbien mangé\n\n");
            this.addFood();
        }
    }

    renderedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.displayBlocks();
            this.init();
            this.addFood();
            this.controls();
        }
    }

}
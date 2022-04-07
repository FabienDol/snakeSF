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
                let obj = {id: `${j}:${i}`, snake : false};
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
        this.blocks[currentPos].snake = true;
        //this.blocks[newPosIndex].class = "snake";
        console.log("bool snake du block d'id " + currentPos + " (xHead, yHead : " + this.xHead + ", " + this.yHead + ") : " + this.blocks[currentPos].snake);

        setInterval(() => this.moveSnake(), 500);

    }

    moveSnake() {
        let currentPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`
        );
        this.blocks[currentPos].snake = false;

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
        this.blocks[nextPos].snake = true;

        console.log("après : " + this.xHead + ", " + this.yHead);
        console.log("moveSnake appelé");
        console.log("valeur classe snake block " + this.xHead + ", " + this.yHead + " : " + this.blocks[nextPos].snake);


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

    renderedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.displayBlocks();
            this.init();
            this.controls();
        }
    }

}
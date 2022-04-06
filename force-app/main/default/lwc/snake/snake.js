import { LightningElement, track } from 'lwc';

export default class Snake extends LightningElement {

    blockSize = 40;
    rendered = false;
    @track blocks = [];
    xHead;
    yHead;
    xSpeed;
    ySpeed;

    displayBlocks() {
        console.log("displayBlocks appelé");

        // todo : refacto (duplicated)
        let width = this.template.querySelector(".container").clientWidth;
        let height = this.template.querySelector(".container").clientHeight;
        let xMax = Math.floor(width/this.blockSize);
        let yMax = Math.floor(height/this.blockSize);

        console.log("w : " + width + " ; h : " + height + " xMax : " + xMax + " ; yMax :" + yMax);

        let tempBlocks = [];

        for (let i = 0; i < yMax; i++) {
            for (let j = 0; j < xMax; j++) {
                let obj = {id: `${j}:${i}`, snake : false};
                tempBlocks.push(obj);
            }
            
        }
        this.blocks = tempBlocks;
    }

    init() {
        this.xHead = 0;
        this.yHead = 0;
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

        this.xHead++;

        // todo : refacto (duplicated)
        let width = this.template.querySelector(".container").clientWidth;
        let height = this.template.querySelector(".container").clientHeight;
        let xMax = Math.floor(width/this.blockSize);
        let yMax = Math.floor(height/this.blockSize);

        if (this.xHead >= xMax) {
            this.xHead = 0;
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
        }
    }

}
import { LightningElement, track } from 'lwc';

export default class Snake extends LightningElement {

    blockSize = 20;
    rendered = false;
    @track blocks = [];
    xHead;
    yHead;
    xSpeed;
    ySpeed;
    totalSpeed;
    xMax;
    yMax;
    xFood;
    yFood;
    justEat;
    tailX = [];
    tailY = [];

    displayBlocks() {
        console.log("displayBlocks appelé");

        const width = this.template.querySelector(".container").clientWidth;
        const height = this.template.querySelector(".container").clientHeight;
        this.xMax = Math.floor(width/this.blockSize);
        this.yMax = Math.floor(height/this.blockSize);

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

        this.totalSpeed = 1;

        this.xSpeed = 1;
        this.ySpeed = 0;

        let currentPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`);
        this.blocks[currentPos].class = "block snake";

        setInterval(() => this.moveSnake(), 200);
        setInterval(() => this.eat(), 200);
    }

    moveSnake() {
        
        // récupère la position de la tête
        this.currentPos = this.blocks.findIndex(
            (x) => x.id === `${this.xHead}:${this.yHead}`
        );

        if (!this.justEat) {
            // change la classe de la position précédente de la tête en .block
            if (this.tailX.length == 0) {
                this.blocks[this.currentPos].class = "block";
            }

            // push position de la tete avant màj
            this.tailX.push(`${this.xHead}`);
            this.tailY.push(`${this.yHead}`);

            // ajoute speed à la position de la tête
            this.xHead += this.xSpeed;
            this.yHead += this.ySpeed;


            //touched the wall game over
            if ((this.xHead >= this.xMax) || (this.yHead >= this.yMax) || (this.xHead < 0) || (this.yHead < 0)) {
                console.log("game over");
                this.xHead = 0;
                this.yHead = 0;
                this.xSpeed = 1;
                this.ySpeed = 0;
                this.tailX = [];
                this.tailY = [];
                this.displayBlocks();
                this.addFood();
            }

            // change la classe de la nouvelle position de la tête en .block snake
            let nextPos = this.blocks.findIndex(
                (x) => x.id === `${this.xHead}:${this.yHead}`
            );
            this.blocks[nextPos].class = "block snake";

            // supprime le dernier élément de tail[] et change sa classe en .block
            console.log("this.tailX.length : " + this.tailX.length)
            if (this.tailX.length != 0) {
                let tX = this.tailX.shift();
                let tY = this.tailY.shift();

                let tXToDelete = this.blocks.findIndex(
                    (x) => x.id === `${tX}:${tY}`);
                this.blocks[tXToDelete].class = 'block';

            }

            if (this.tailX.length != 0) {

                // pour tous les éléments de tail[], on change la classe à .block snake dans blocks[]
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

            // ajoute speed à la position de la tête
            this.xHead += this.xSpeed;
            this.yHead += this.ySpeed;

            //touched the wall game over
            if ((this.xHead >= this.xMax) || (this.yHead >= this.yMax) || (this.xHead < 0) || (this.yHead < 0)) {
                console.log("game over");
                this.xHead = 0;
                this.yHead = 0;
                this.xSpeed = 1;
                this.ySpeed = 0;
                this.tailX = [];
                this.tailY = [];
                this.displayBlocks();
                this.addFood();
            }

            // change la classe de la nouvelle position de la tête en .block snake
            let nextPos = this.blocks.findIndex(
                (x) => x.id === `${this.xHead}:${this.yHead}`);
            this.blocks[nextPos].class = "block snake";

            // pour tous les éléments de tail[], on change la classe à .block snake dans blocks[]
            for (let i = 0; i < this.tailX.length; i++) {
                let tailChange = this.blocks.findIndex(
                    (x) => x.id === `${this.tailX[i]}:${this.tailY[i]}`);
                this.blocks[tailChange].class = "block snake";
            }
        }
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
        }
    }

    get displaySpeed() {
        return this.speed;
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
                this.xHead = 0;
                this.yHead = 0;
                this.xSpeed = 1;
                this.ySpeed = 0;
                this.tailX = [];
                this.tailY = [];
                this.displayBlocks();
                this.addFood();
            });
        }
    }

}
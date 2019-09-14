class SnakeGame {
    constructor() {
        this.playerLength = [];
        this.playerDirection = "Up";
        this.playerScore = 0;
        this.food = {};
        this.moveInterval = 2;
        this.gameInterval = 12;
        this.gameSpeedIncreaseInterval = 4;
        this.stageReduction = 0;
        this.stageReductionInterval = .05;
        this.targetStageReduction = 0;
        this.targetStageReductionInterval = 10;
        this.backgroundColor = "white";
        this.xPosition;
        this.yPosition;

        this.keyPress;
        this.gameTime;

        this.canvas;
        this.context;

        this.widthOfPlayArea = window.innerHeight-100;
        this.heightOfPlayArea = window.innerHeight-100;

        this.xPlayAreaStartPosition = Math.round((window.innerWidth-this.widthOfPlayArea)/2);

        this.yPlayAreaStartPosition = Math.round((window.innerHeight-this.heightOfPlayArea)/2);

        this.startingXPosition = parseInt(this.widthOfPlayArea/2);
        this.startingYPosition = parseInt(this.heightOfPlayArea/2);

        //Make sure all positions and dimensions are even numbers

        if(this.widthOfPlayArea % 2 != 0)
            this.widthOfPlayArea++;
    
        if(this.heightOfPlayArea % 2 != 0)
            this.heightOfPlayArea++;

        if(this.xPlayAreaStartPosition % 2 != 0)
            this.xPlayAreaStartPosition++;
    
        if(this.yPlayAreaStartPosition % 2 != 0)
            this.yPlayAreaStartPosition++;
    
        if(this.startingXPosition % 2 != 0)
            this.startingXPosition++;
    
        if(this.startingYPosition % 2 != 0)
            this.startingYPosition++;
        
        ////////// All Method Bindings //////////
        
        ////////// Main Method Bindings //////////
        this.newGame = this.newGame.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.increaseDifficulty = this.increaseDifficulty.bind(this);
        this.gameOver = this.gameOver.bind(this);

        ////////// Player Method Bindings //////////
        this.movePlayer = this.movePlayer.bind(this);
        this.addBodyPart = this.addBodyPart.bind(this);
        this.increasePlayerSpeed = this.increasePlayerSpeed.bind(this);

        ////////// Stage Method Bindings //////////
        this.decreaseStageSize = this.decreaseStageSize.bind(this);

        this.resizeStage = this.resizeStage.bind(this);

        ////////// Food Method Bindings //////////
        this.collectFood = this.collectFood.bind(this);
        this.spawnFood = this.spawnFood.bind(this);

        ////////// Hit Detection Bindings //////////
        this.checkFoodHit = this.checkFoodHit.bind(this);
        this.checkFoodSpawnHit = this.checkFoodSpawnHit.bind(this);
        this.checkWallHit = this.checkWallHit.bind(this);
        this.checkPlayerHit = this.checkPlayerHit.bind(this);
        this.checkHit = this.checkHit.bind(this);

        ////////// Print Method Bindings //////////
        this.printPlayerPosition = this.printPlayerPosition.bind(this);
        this.printFoodPosition = this.printFoodPosition.bind(this);
        this.printSingleObjectToCanvas = this.printSingleObjectToCanvas.bind(this);

        ////////// User Interaction Method Bindings //////////
        this.checkKeyPress = this.checkKeyPress.bind(this);

        //////////Initialization Methods//////////
        this.newGame();
    }

    ////////// Main Methods //////////

    newGame() {
        this.keyPress = addEventListener("keydown", this.gameLoop);
        this.gameTime = window.setInterval(this.gameLoop, this.gameInterval);

        //create canvas (playArea)
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        this.canvas.style.top = this.yPlayAreaStartPosition + "px";
        this.canvas.style.left = this.xPlayAreaStartPosition + "px";
        this.canvas.width = this.widthOfPlayArea;
        this.canvas.height = this.heightOfPlayArea;

        this.context = this.canvas.getContext("2d");

        //insert the canvas to the HTML Document
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        //create first player body part and insert into playerLength array
        let newBodyPart = new PlayerBodyPartObject(this.startingXPosition, this.startingYPosition);
        this.playerLength[0] = newBodyPart;

        //make the starting snake body parts
        this.addBodyPart();
        this.addBodyPart();

        //spawn first food object
        this.spawnFood();

        console.log("Game Loaded.");     
    }

    gameLoop() {
        this.resizeStage();

        this.movePlayer();

        this.checkFoodHit();

        this.checkGameOver();

        this.printAllObjectPositions();

        this.checkKeyPress();
    }

    increaseDifficulty() {
        this.increasePlayerSpeed();
        this.decreaseStageSize();
    }

    checkGameOver() {
        if(this.checkWallHit(this.playerLength[0]) || this.checkPlayerHit()) {
            window.clearInterval(this.gameTime);

            window.setTimeout(this.gameOver, 50);
        }
    }

    gameOver() {

        this.context.fillStyle = "black";

        this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);

        console.log("Game Over");
    }

    ////////// Player Methods //////////

    movePlayer() {
        //player movement: checks the direction the player is currently moving, then adds a new head element at the beginning of the playerLength array with the new x/y coordinates based on the direction
        let newBodyPart;
        if(this.playerDirection == "Up") {
            newBodyPart = new PlayerBodyPartObject(this.playerLength[0].xPosition, (this.playerLength[0].yPosition -= this.moveInterval));
        } else if (this.playerDirection == "Down") {
            newBodyPart = new PlayerBodyPartObject(this.playerLength[0].xPosition, (this.playerLength[0].yPosition += this.moveInterval));
        } else if (this.playerDirection == "Left") {
            newBodyPart = new PlayerBodyPartObject((this.playerLength[0].xPosition -= this.moveInterval), this.playerLength[0].yPosition);
        } else if (this.playerDirection == "Right") {
            newBodyPart = new PlayerBodyPartObject((this.playerLength[0].xPosition += this.moveInterval), this.playerLength[0].yPosition);
        }

        //add new body part
        this.playerLength.unshift(newBodyPart);

        //removes old tail from playerLength array
        this.playerLength.pop();
    }

    addBodyPart() {
        for(let i = 0; i < 10; i++) {
            let newBodyPart = new PlayerBodyPartObject(this.playerLength[this.playerLength.length - 1].xPosition, this.playerLength[this.playerLength.length - 1].yPosition);
            
            this.playerLength.push(newBodyPart);
        }
    }

    increasePlayerSpeed() {
        //increase the speed at which the game increases at score 35 and 45
        if(this.playerScore == 35 || this.playerScore == 45)
            this.gameSpeedIncreaseInterval--;

        if(this.playerScore % this.gameSpeedIncreaseInterval == 0) {
            this.gameInterval--;
            window.clearInterval(this.gameTime);
            this.gameTime = window.setInterval(this.gameLoop, this.gameInterval);
            console.log("Speed Increased...");
            console.log("Speed Interval is now " + this.gameInterval);
        }
    }

    ////////// Stage Methods //////////

    decreaseStageSize() {
        //Every 5 points, decrease the stage size
        if(this.playerScore % 5 == 0) {
            //Every 10 points, increase the amount that stage decreases by
            if(this.playerScore % 10 == 0)
                this.targetStageReductionInterval += this.targetStageReductionInterval;

            this.targetStageReduction += this.targetStageReductionInterval;  
        }
    }

    resizeStage() {
        if(this.stageReduction < this.targetStageReduction) {
            this.stageReduction += this.stageReductionInterval;
            if(this.checkWallHit(this.food)) {
                this.spawnFood();
                console.log("Food repositioned during Stage Resize.");
            }
            // this.canvas.style.top = (this.yPlayAreaStartPosition + this.stageReduction) + "px";
            // this.canvas.style.left = (this.xPlayAreaStartPosition + this.stageReduction) + "px";
            // this.canvas.width = this.widthOfPlayArea - (this.stageReduction * 2);
            // this.canvas.height = this.heightOfPlayArea - (this.stageReduction *2);
        }
        if(this.stageReduction > this.targetStageReduction) {
            this.stageReduction = Math.floor(this.stageReduction);
        }
    }

    ////////// Food Methods //////////

    collectFood() {
        this.playerScore++;
        console.log("Player Score = " + this.playerScore);
    }

    spawnFood() {
        let i = 0;
        do {
            this.food = new FoodObject(this.widthOfPlayArea, this.heightOfPlayArea, this.targetStageReduction);
            i++;
            console.log("Food Repositioned " + i + " times.");
        } while(this.checkFoodSpawnHit());

        console.log("Food Spawned");
    }

    ////////// Hit Detection Methods //////////

    checkFoodHit() {
        if (this.checkHit(this.playerLength[0], this.food)) {
            this.collectFood();
            this.spawnFood();
            this.addBodyPart();
            this.increaseDifficulty();
        }
    }

    checkFoodSpawnHit() {
        for(let i = 0; i < this.playerLength.length; i+=this.playerLength[i].width/this.moveInterval) {
            if(this.checkHit(this.playerLength[i], this.food))
                return true;
        }
        return false;
    }

    checkWallHit(firstObj) {
        let firstObjLeft = firstObj.xPosition;
        let firstObjRight = firstObj.xPosition + firstObj.width;

        let firstObjTop = firstObj.yPosition;
        let firstObjBottom = firstObj.yPosition + firstObj.height;

        let secondObjLeft = this.stageReduction - this.moveInterval;
        let secondObjRight = this.widthOfPlayArea + this.moveInterval - this.stageReduction;

        let secondObjTop = this.stageReduction - this.moveInterval;
        let secondObjBottom = this.heightOfPlayArea + this.moveInterval - this.stageReduction;

        let hit = false;

        if ((firstObjBottom >= secondObjBottom) || (firstObjTop <= secondObjTop) || (firstObjRight >= secondObjRight) || (firstObjLeft <= secondObjLeft)) {
            hit = true;
            console.log("Wall Hit..........");
        }
        return hit;
    }

    checkPlayerHit() {
        for(let i = 32; i < this.playerLength.length; i+= 15) {
            if(this.checkHit(this.playerLength[0], this.playerLength[i])) {
                console.log("Player Hit");
                return true;
            }
        }
        return false;
    }

    checkHit(firstObj, secondObj) {
        let firstObjLeft = firstObj.xPosition;
        let firstObjRight = firstObj.xPosition + firstObj.width;

        let firstObjTop = firstObj.yPosition;
        let firstObjBottom = firstObj.yPosition + firstObj.height;

        let secondObjLeft = secondObj.xPosition;
        let secondObjRight = secondObj.xPosition + secondObj.width;

        let secondObjTop = secondObj.yPosition;
        let secondObjBottom = secondObj.yPosition + secondObj.height;

        let hit = true;

        if ((firstObjBottom <= secondObjTop) || (firstObjTop >= secondObjBottom) || (firstObjRight <= secondObjLeft) || (firstObjLeft >= secondObjRight))
            hit = false;
        return hit;
    }

    ////////// Print Methods //////////
    printAllObjectPositions() {
        //clear canvas
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.widthOfPlayArea, this.heightOfPlayArea);
        console.log("Stop");

        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(this.stageReduction, this.stageReduction, this.widthOfPlayArea - (this.stageReduction * 2), this.heightOfPlayArea - (this.stageReduction * 2));

        //update all object positions
        this.printPlayerPosition();
        this.printFoodPosition();
    }

    printPlayerPosition() {
        //loop through the playerLength array and print every player body part
        for(let i = 0; i < this.playerLength.length; i++) {
            let bodyPartXPosition = this.playerLength[i].xPosition;
            let bodyPartYPosition = this.playerLength[i].yPosition;
            let color = this.playerLength[i].color;
            let width = this.playerLength[i].width;
            let height = this.playerLength[i].height;

            this.printSingleObjectToCanvas(bodyPartXPosition, bodyPartYPosition, color, width, height);
        }

        this.printPlayerEyes();
    }

    printPlayerEyes() {
        let xLeftEye;
        let yLeftEye;
        let xRightEye;
        let yRightEye;
        let xEyeInterval = 4;
        let yEyeInterval = 6;
        let eyeRadius = 2;

        switch(this.playerDirection) {
            case "Up":
                xLeftEye = this.playerLength[0].xPosition + xEyeInterval;
                yLeftEye = this.playerLength[0].yPosition + yEyeInterval;
                xRightEye = this.playerLength[0].xPosition + this.playerLength[0].width - xEyeInterval;
                yRightEye = yLeftEye;
                break;
            case "Down":
                xLeftEye = this.playerLength[0].xPosition + xEyeInterval;
                yLeftEye = this.playerLength[0].yPosition + this.playerLength[0].height - yEyeInterval;
                xRightEye = this.playerLength[0].xPosition + this.playerLength[0].width - xEyeInterval;
                yRightEye = yLeftEye;
                break;
            case "Left":
                xLeftEye = this.playerLength[0].xPosition + yEyeInterval;
                yLeftEye = this.playerLength[0].yPosition + this.playerLength[0].height - xEyeInterval;
                xRightEye = xLeftEye;
                yRightEye = this.playerLength[0].yPosition + xEyeInterval;
                break;
            case "Right":
                xLeftEye = this.playerLength[0].xPosition + this.playerLength[0].width - yEyeInterval;
                yLeftEye = this.playerLength[0].yPosition + this.playerLength[0].height - xEyeInterval;
                xRightEye = xLeftEye;
                yRightEye = this.playerLength[0].yPosition + xEyeInterval;
                break;
            default:
                break;
        }

        this.context.fillStyle = "red";
        this.context.strokeStyle = "white";
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.arc(xLeftEye, yLeftEye, eyeRadius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(xRightEye, yRightEye, eyeRadius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();
    }

    printFoodPosition() {
        this.printSingleObjectToCanvas(this.food.xPosition, this.food.yPosition, this.food.color, this.food.width, this.food.height);
    }

    printSingleObjectToCanvas(x, y, color, width, height) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

    ////////// User Interaction Methods //////////

    checkKeyPress() {
        if (event) {
            switch (event.key) {
                case "ArrowUp":
                    if(this.playerDirection != "Down")
                        this.playerDirection = "Up";
                    break;
                case "ArrowDown":
                    if(this.playerDirection != "Up")
                        this.playerDirection = "Down";
                    break;
                case "ArrowLeft":
                    if(this.playerDirection != "Right")
                        this.playerDirection = "Left";
                    break;
                case "ArrowRight":
                    if(this.playerDirection != "Left")
                        this.playerDirection = "Right";
                    break;
                default:
                    break;    
            }  
        } 
    }
} //End of SnakeGame Class

class PlayerBodyPartObject {
    constructor(xPosition, yPosition) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.color = "black";
        this.width = 16;
        this.height = 16;
    }
}

class FoodObject {
    constructor(widthOfPlayArea, heightOfPlayArea, targetStageReduction) {
        this.xPosition;
        this.yPosition;
        this.color = "blue";
        this.height = 12;
        this.width = 12;

        this.targetStageReduction = targetStageReduction;

        ////////// Method Bindings //////////
        this.createFoodXPosition = this.createFoodXPosition.bind(this);
        this.createFoodYPosition = this.createFoodYPosition.bind(this);

        ////////// Initialization Methods //////////
        this.createFoodXPosition(widthOfPlayArea);
        this.createFoodYPosition(heightOfPlayArea);
    }

    //create random x position for food spawn
    createFoodXPosition(widthOfPlayArea) {
        this.xPosition = Math.floor(Math.random() * ((widthOfPlayArea - this.width - this.targetStageReduction) - (this.targetStageReduction)) + this.targetStageReduction)

        if(!(this.xPosition % 2) == 0)
            this.xPosition++;

        if(this.xPosition < this.targetStageReduction) {
            this.xPosition = this.targetStageReduction;
            console.log("Food X Position Adjusted Right.")
        }

        if(this.xPosition > (widthOfPlayArea - this.targetStageReduction - this.width)) {
            this.xPosition = widthOfPlayArea - this.targetStageReduction - this.width;
            console.log("Food X Position Adjusted Left.")
        }
    }

    //create random y position for food spawn
    createFoodYPosition(heightOfPlayArea) {
        this.yPosition = Math.floor(Math.random() * ((heightOfPlayArea - this.height - this.targetStageReduction) - (this.targetStageReduction)) + this.targetStageReduction);

        if(!(this.yPosition % 2) == 0)
            this.yPosition++;

        if(this.yPosition < this.targetStageReduction) {
            this.yPosition = this.targetStageReduction;    
            console.log("Food Y Position Adjusted Down.")
        }

        if(this.yPosition >= (heightOfPlayArea - this.targetStageReduction - this.height)) {
            this.yPosition = heightOfPlayArea - this.targetStageReduction - this.height;
            console.log("Food Y Position Adjusted Up.")
        }
    }
}

let snakeGame;
window.addEventListener("load", () => snakeGame = new SnakeGame());
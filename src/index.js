var playerLength = [];
var playerDirection = "Up";
var playerWidth = 30;
var playerHeight = 30;
var playerColor = "black";
var foodXPosition = 200;
var foodYPosition = 200;
var moveInterval = 5;
var gameInterval = 15;
var playerXPosition;
var playerYPosition;

var widthOfPlayArea = parseInt(Math.round(window.innerWidth/10)) * 10;
var heightOfPlayArea = parseInt(Math.round(window.innerHeight/10)) * 9;

var startingXPosition = parseInt(widthOfPlayArea/2);
var startingYPosition = parseInt(heightOfPlayArea/2);

function bodyPart(newXPosition, newYPosition) {
        this.playerXPosition = newXPosition;
        this.playerYPosition = newYPosition;
        this.width = playerWidth;
        this.height = playerHeight;
        this.color = playerColor;

}

window.onload = newGame;

var keyPress = addEventListener("keydown", move);
var gameTime = window.setInterval(move, gameInterval);


function newGame () {
    food.style.top = foodYPosition + "px";
    food.style.left = foodXPosition + "px";
    let newBodyPart = new bodyPart(startingXPosition, startingYPosition);
    playerLength[0] = newBodyPart;
}

function move () {
    //player movement: checks the direction the player is currently moving, then adds a new head element at the beginning of the playerLength array with the new x/y coordinates based on the direction
    if(playerDirection == "Up") {
            let newBodyPart = new bodyPart(playerLength[0].playerXPosition, (playerLength[0].playerYPosition -= moveInterval));
            playerLength.unshift(newBodyPart);
    } else if (playerDirection == "Down") {
            let newBodyPart = new bodyPart(playerLength[0].playerXPosition, (playerLength[0].playerYPosition += moveInterval));
            playerLength.unshift(newBodyPart);
    } else if (playerDirection == "Left") {
            let newBodyPart = new bodyPart((playerLength[0].playerXPosition -= moveInterval), playerLength[0].playerYPosition);
            playerLength.unshift(newBodyPart);
    } else if (playerDirection == "Right") {
            let newBodyPart = new bodyPart((playerLength[0].playerXPosition += moveInterval), playerLength[0].playerYPosition);
            playerLength.unshift(newBodyPart);
    }

    //removes the old tail from the array
    playerLength.pop();
    
    //check for food hit
    if (checkFoodHitDetection() == true) {
        collectFood();
        spawnFood();
        addBodyPart();
    }

    //updates player position on the screen
    printPlayerPosition(); 

    //checks for new key press
    if (event) {
        switch (event.key) {
            case "ArrowUp":
                playerDirection = "Up";
                break;
            case "ArrowDown":
                playerDirection = "Down";
                break;
            case "ArrowLeft":
                playerDirection = "Left";
                break;
            case "ArrowRight":
                playerDirection = "Right";
                break;
            default:
                break;    
        }  
    }      
}

//function that iterates through the playerLength array and prints all the body parts to the screen
function printPlayerPosition () {
    for (i = 0; i < playerLength.length; i++) {
        //assign the html div ID
        let bodyPart = "player" + i;
        //print to screen
        document.getElementById(bodyPart).style.top = playerLength[i].playerYPosition + "px";
        document.getElementById(bodyPart).style.left = playerLength[i].playerXPosition + "px";
    }
}

//function to spawn food
function spawnFood(){
    //create random x and y position for food
    do {
    foodXPosition = createFoodXPosition();
    foodYPosition = createFoodYPosition();
    food.style.top = foodYPosition + "px";
    food.style.left = foodXPosition + "px";
  } while (checkFoodHitDetection() == true);
}

//create random x position for food spawn
function createFoodXPosition () {
    var x = Math.floor(Math.random() * ((widthOfPlayArea - playerWidth) - 20) + 20);
    return x;
}
  
  //create random y position for food spawn
  function createFoodYPosition () {
    var y = Math.floor(Math.random() * ((heightOfPlayArea - playerHeight) - 20) + 20);
    return y;
}

function checkFoodHitDetection () {
    //create box objects for hit detection
    let playerObj = player0.getBoundingClientRect();
    let foodObj = food.getBoundingClientRect();
    //check for hit
    if (playerObj.left < foodObj.left + foodObj.width  && playerObj.left + playerObj.width  > foodObj.left &&
      playerObj.top < foodObj.top + foodObj.height && playerObj.top + playerObj.height > foodObj.top) {
        return true;
      } else {
        return false;
      }
}

function checkPlayerHitDetection () {
    //for (i = 1)
}

function collectFood () {
    //alert("hit");
}

function addBodyPart () {
   // let newBodyPartXPosition = findNewBodyPartXPosition();
   // let newBodyPartYPosition = findNewBodyPartYPosition();
   for (i = 0; i < 10; i++) {
    let newBodyPart = new bodyPart(playerLength[playerLength.length - 1].playerXPosition, playerLength[playerLength.length - 1].playerYPosition);
    playerLength[playerLength.length] = newBodyPart;
    //create new body part div and add it to the HTML
    let newDiv = document.createElement("div");
    document.getElementById("snake").appendChild(newDiv);
    //set the id of the new body part div
    let newBodyPartName = "player" + (playerLength.length - 1);
    newDiv.id = newBodyPartName;
    //style the new body part div
    document.getElementById(newBodyPartName).style.top = playerLength[playerLength.length - 1].playerYPosition + "px";
    document.getElementById(newBodyPartName).style.left = playerLength[playerLength.length - 1].playerXPosition + "px";
    document.getElementById(newBodyPartName).style.backgroundColor = playerColor;
    document.getElementById(newBodyPartName).style.height = playerHeight + "px";
    document.getElementById(newBodyPartName).style.width = playerWidth + "px";
    document.getElementById(newBodyPartName).style.position = "absolute";
    document.getElementById(newBodyPartName).style.padding = "0";
    document.getElementById(newBodyPartName).style.margin = "0";
   }
}

function findNewBodyPartXPosition () {
    let newBodyPartXPosition;
    if (playerDirection == "Left") {
        newBodyPartXPosition = playerLength[playerLength.length - 1].playerXPosition + playerWidth;
    } else if (playerDirection == "Right") {
        newBodyPartXPosition = playerLength[playerLength.length - 1].playerXPosition - playerWidth;
    } else {
        newBodyPartXPosition = playerLength[playerLength.length - 1].playerXPosition;
    }
    return newBodyPartXPosition;
}    

function findNewBodyPartYPosition () {
    let newBodyPartYPosition;
    if (playerDirection == "Up") {
        newBodyPartYPosition = playerLength[playerLength.length - 1].playerYPosition + playerWidth;
    } else if (playerDirection == "Down") {
        newBodyPartYPosition = playerLength[playerLength.length - 1].playerYPosition - playerWidth;
    } else {
        newBodyPartYPosition = playerLength[playerLength.length - 1].playerYPosition;
    }
    return newBodyPartYPosition;
}  
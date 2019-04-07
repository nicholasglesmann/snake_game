var playerLength;
var playerDirection = "Up";
var foodXPosition;
var foodYPosition;
var gameInterval = 10;

var widthOfPlayArea = parseInt(Math.round(window.innerWidth/10)) * 10;
var heightOfPlayArea = parseInt(Math.round(window.innerHeight/10)) * 9;

var playerXPosition = parseInt(widthOfPlayArea/2);
var playerYPosition = parseInt(heightOfPlayArea/2);

window.onload = spawnFood;


var keyPress = addEventListener("keydown", move);
var gameTime = window.setInterval(move, gameInterval);

function move () {
    if(playerDirection == "Up") {
        playerYPosition--;
        printPlayerPosition(); 
    } else if (playerDirection == "Down") {
        playerYPosition++;
        printPlayerPosition();
    } else if (playerDirection == "Left") {
        playerXPosition--;
        printPlayerPosition();
    } else if (playerDirection == "Right") {
        playerXPosition++;
        printPlayerPosition();
    }

    if (hitDetection() == true) {
        collectFood();
        spawnFood();
      }

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
    }        
}

function printPlayerPosition () {
    document.getElementById('player').style.top = playerYPosition + "px";
    document.getElementById('player').style.left = playerXPosition + "px";
}

//function to spawn word
function spawnFood(){

    //create random x and y position for word
    do {
    foodXPosition = createx();
    foodYPosition = createy();
    food.style.top = foodYPosition + "px";
    food.style.left = foodXPosition + "px";
  } while (hitDetection() == true);
}

//create random x position for word spawn
function createx () {
    var x = Math.floor(Math.random() * ((widthOfPlayArea - 120) - 20) + 20);
    return x;
}
  
  //create random y position for word spawn
  function createy () {
    var y = Math.floor(Math.random() * ((heightOfPlayArea - 170) - 20) + 20);
    return y;
}

function hitDetection (){
    //create box objects for hit detection
    var playerObj = player.getBoundingClientRect();
    var foodObj = food.getBoundingClientRect();
    //check for hit
    if (playerObj.left < foodObj.left + foodObj.width  && playerObj.left + playerObj.width  > foodObj.left &&
      playerObj.top < foodObj.top + foodObj.height && playerObj.top + playerObj.height > foodObj.top) {
        return true;
      } else {
        return false;
      }
}

function collectFood () {
    //alert("hit");
}

// Enemies our player must avoid
var Enemy = function() {
    this.x = -101;              // required for smooth enter into the screen
    this.rowGenerator();
    this.temporarySpeed = 400;
    this.speed = 0;             // moves at (width * dt) pace on axis x
    this.hasStepped = false;    // true if enemy has stepped on object
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers

    // Enemies move in slow speed until x is 15 .
    // That's made so enemies would't appear on screen at top speed
    // so the player can see them coming for longer period of time
    // and try avoid them. It creates more playability and freedom
    // to move around the screen for the player.
    if (this.x > 15) {

        this.x += this.speed * dt;
        // If enemy left the screen
        if (this.x > ctx.canvas.width) {
            // enemy slides into the screen which creates smooth appereance
            this.x = -101;
            // put enemy in random row to randomize their appereance on screen
            this.rowGenerator();
        }

    } else {
        if (player.level >= 3) {
            this.x += this.temporarySpeed * dt;
        } else
        this.x += this.speed * dt;
    }
    // check if player has collided with any of the enemies or rocks
    player.checkCollision(allEnemies);
    player.checkCollision(allRocks);
    // check if enemy has collided with rock
    this.checkCollision(allRocks);

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.setRandomSpeed = function(min, max) {
    this.speed = getRandomInt(min, max);
};

// Creates an enemy object and puts it in the random row.
Enemy.prototype.rowGenerator = function() {
    var randomRow = getRandomRow();
    switch (randomRow) {
        case 1:
        this.y = 63;
        break;
        case 2:
        this.y = 146;
        break;
        case 3:
        this.y = 229;
        break;
        case 4:
        this.y = 312;
        break;
    }
};
// check if enemy has stepped on object
Enemy.prototype.checkCollision = function(arrayOfObjects) {
    arrayOfObjects.forEach(function(object) {
        if (this.x < object.x + 50 && this.x + 50 > object.x && this.y < object.y + 30 && 30 + this.y > object.y ) {
            // if enemy collided , move him up slowly
            if (this.speed > 700) this.y -= 3;
            this.y -= 0.5;
            this.hasStepped = true;
        }
    }, this);
};

// Player class
var Player = function() {
    this.x = 202;
    this.y = 400;
    this.lives = 3;
    this.level = 1;
    this.canMove = true;
    this.sprite = 'images/char-princess-girl.png';
};
// handleInput() updates player position instead of update()
Player.prototype.update = function(dt) {};

Player.prototype.render = function() {
    if (this.lives !== 0) // if player dies he disappears from screen
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Function to reset player state to begining
// We also reset state in egine.js when game is over
// using additional parameters
Player.prototype.reset = function() {
    if (this.lives !== 0) {
        this.x = 202;
        this.y = 400;
        this.lives--;
    }
};
// Function to define player movements
Player.prototype.handleInput = function(keyCode) {
    switch (keyCode) {
        case 'left':
            // Move left and check if we have a collision with rock
            // if collision happened move player back
            this.checkForRock('x', 101);
            if (this.canMove === false) {
                this.canMove = true;
                break;
            }
            // check if we don't move out of bounds
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
            case 'up':
            this.checkForRock('y', 83);
            if (this.canMove === false) {
                this.canMove = true;
                break;
            }
            // check if player reached the water
            if (this.y > 68)
                this.y -= 83;
            else {
                this.x = 202;
                this.y = 400;
                player.level++;
                player.initializeLevel(allEnemies);
                if (player.level % 5 === 0)
                    player.lives++;
            }
            break;
            case 'right':
            this.checkForRock('x', -101);
            if (this.canMove === false) {
                this.canMove = true;
                break;
            }
            // check if we don't move out of bounds
            if (this.x < 505)
                this.x += 101;
            break;
            case 'down':
            this.checkForRock('y', -83);
            if (this.canMove === false) {
                this.canMove = true;
                break;
            }
            // check if we don't move out of bounds
            if (this.y < 400)
                this.y += 83;
            break;
        }
    };
// Chech if collision between the player and enemies or rocks happened
Player.prototype.checkCollision = function(arrayOfObjects) {
    arrayOfObjects.forEach(function(object) {
        if (this.x < object.x + 50 && this.x + 50 > object.x && this.y < object.y + 40 && 40 + this.y > object.y) {
            if (arrayOfObjects.length > 0 && arrayOfObjects[0].constructor.name === 'Enemy')
                player.reset();
            else
                // if collision with object 'Rock' happened the player cannot move
            this.canMove = false;
        }
    }, this);
};
// We pretend to move player on axis x or y and then check if collision with rock happened
Player.prototype.checkForRock = function(axis, offset) {
    // lets pretend we move player on axis x or y
    this[axis] -= offset;
    // check if collisiion could happen between player and rock
    this.checkCollision(allRocks);
    // if collision happed return player back
    if (this.canMove === false) {
        this[axis] += offset;
        return;
    }
    // return player to his current state
    this[axis] += offset;
};

// Function to define levels
Player.prototype.initializeLevel = function(allEnemies) {
    if (this.level === 1) {
        minSpeed = 100;
        maxSpeed = 500;
        allRocks = [];

        var enemy = new Enemy();
        enemy.setRandomSpeed(minSpeed, maxSpeed);
        allEnemies[0] = enemy;

        var enemy = new Enemy();
        enemy.setRandomSpeed(minSpeed, maxSpeed);
        allEnemies[1] = enemy;

        var enemy = new Enemy();
        enemy.setRandomSpeed(minSpeed, maxSpeed);
        allEnemies[2] = enemy;

        var enemy = new Enemy();
        enemy.setRandomSpeed(minSpeed, maxSpeed);
        allEnemies[3] = enemy;
        // leave always 4 enemies when game restarts
        if (allEnemies.length > 4)
            allEnemies.pop();
    }
    if (this.level === 2) {
        minSpeed +=100;
        maxSpeed +=100;
        allEnemies.forEach(function(enemy) {
            enemy.setRandomSpeed(minSpeed, maxSpeed);
        });
    }
    if (this.level === 3) {
        // window.allRocks = []; -> we could initialize allRocks in global scope only from 3rd level
        // Create rock objects
        // x = 202 is collum 2 , y = 312 is row 5
        var rock = new Rock(202 + 101, 312);
        allRocks[0] = rock;

        var rock = new Rock(202 +101 * 2, 312);
        allRocks[1] = rock;

        var rock = new Rock(202 + 101 * 3, 312 - 83 *2);
        allRocks[2] = rock;

        var rock = new Rock(202 , 312 - 83 * 2);
        allRocks[3] = rock;

        var rock = new Rock(202 + 101, 312 - 83 * 3);
        allRocks[4] = rock;

        allEnemies.forEach(function(enemy) {
            enemy.setRandomSpeed(minSpeed, maxSpeed);
        })
    }
    if (this.level === 4) {
        minSpeed +=100;
        maxSpeed +=100;
        allEnemies.forEach(function(enemy) {
            enemy.setRandomSpeed(minSpeed, maxSpeed);
        })
    }
    if (this.level === 5) {
        allRocks = [];
        var rock = new Rock(202 - 101, 312 -83);
        allRocks[0] = rock;

        var rock = new Rock(202 , 312 - 83 *2);
        allRocks[1] = rock;

        var rock = new Rock(202 + 101, 312 - 83 *2);
        allRocks[2] = rock;

        var rock = new Rock(202 + 101 *2, 312 -83);
        allRocks[3] = rock;

        var rock = new Rock(202 + 101 *3, 312 -83 *3);
        allRocks[4] = rock;

        minSpeed +=100;
        maxSpeed +=100;

        allEnemies.forEach(function(enemy) {
            enemy.setRandomSpeed(minSpeed, maxSpeed);
        })
    }

    if (this.level === 6) {
        minSpeed +=100;
        maxSpeed +=100;

        allEnemies.forEach(function(enemy) {
            enemy.setRandomSpeed(minSpeed, maxSpeed);
        })
    }

    if (this.level === 7) {
        allRocks = [];
        var rock = new Rock(202 + 101 , 312 -81 * 4);
        allRocks[0] = rock;

        var rock = new Rock(202 + 101 *2,312 - 81 *4);
        allRocks[1] = rock;

        var rock = new Rock(202 + 101 *3,312 - 81 *4);
        allRocks[2] = rock;

        allEnemies.forEach(function(enemy) {
            enemy.setRandomSpeed(minSpeed, maxSpeed);
        })
    }

    if (this.level === 8) {
        var rock = new Rock(202 - 101 , 312 -81 * 4);
        allRocks[0] = rock;

        var rock = new Rock(202 - 101 *2,312 - 81 *4);
        allRocks[3] = rock;

        var rock = new Rock(202 + 101 ,312 - 81 *4);
        allRocks[4] = rock;


        allEnemies.forEach(function(enemy) {
            enemy.setRandomSpeed(minSpeed, maxSpeed);
        })
    }

    if (this.level > 8) {
        allRocks = [];
        if (this.speed !== 1300) {
            minSpeed +=100;
            maxSpeed +=100;
            allEnemies.forEach(function(enemy) {
                enemy.setRandomSpeed(minSpeed, maxSpeed);
            })
        }
    }
}

var Rock = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Rock.png';
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Get random row from 1 to 4
getRandomRow = function() {
    return Math.floor((Math.random() * 4) + 1);
};

// NOT USED ANYMORE!!!!!  CHANGED TO --> Enemy.prototype.rowGenerator
// which works the same way but is binded to the enemy object
// Creates an enemy object and puts it in the random row .
enemyRowGenerator = function() {
    var randomRow = getRandomRow();
    switch (randomRow) {
        case 1:
        var enemy = new Enemy(-101, 63);
        return enemy;
        break;
        case 2:
        var enemy = new Enemy(-101, 146);
        return enemy;
        break;
        case 3:
        var enemy = new Enemy(-101, 229);
        return enemy;
        break;
        case 4:
        var enemy = new Enemy(-101, 312);
        return enemy;
        break;
    }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Instantiation of player enemy and rock objects
var allEnemies = [];
var player = new Player();
var allRocks = [];
var minSpeed = 100;
var maxSpeed = 500;
// this time the function creates enemies for level 1
// later on we use it in engine.js
player.initializeLevel(allEnemies);
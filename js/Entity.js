//the general entity skeleton used by the walls, the ball, the mines and the cleaver
//additional properties/functions needed by specific entities may be defined under those entities
function Entity() {
	
	//position of the entity in 2d space
	this.position = {
		x : null,
		y : null
	};
	
	//size of the entity in 2d space relative to its sprites' sizes
	this.scale = null;
	
	//the identifier of the entity, which tells us what type of object it is (eg. the ball, a spike, etc.)
	this.id = null;
	
	//direction the entity is facing (unit vector format)
	this.direction = {
		x : null,
		y : null
	};
	
	//speed of the entity, if it is dynamic
	this.speed = null,
	
	//needed for physics body to reference the entity
	this.userData = {
	
	};
	
	//flag that's set to true if the entity has been marked for death
	this.killed = null;
	
	//the primary sprite used by the entity
	//not used as of now
	this.spriteName = null;
	
	//the sprite being used in this frame (could be any animation frame)
	//not used as of now
	this.currSpriteSheetName = null;
	
	//the BodyDef object needed by Box2D to apply physics to the entity
	this.physicsBody = null;
	
	//the animation/action state of the entity
	//not used as of now
	this.state = null;
	
	//contains string-spritesheet mappings for animations
	//not used as of now
	this.animations = {
	
	};
	
	//is the entity static or dynamic?
	this.type = null;
	
	//called every cycle of the game engine, if the entity is active
	this.update = function() {
	
	};
	
	//destroys the entity
	this.kill = function(i,j) {
		gPhysicsEngine.removeBody(this.physicsBody);
		entitiesByZindex[i].splice(j,1);
		delete this;
	};
	
	//draws the main sprite of the entity at a specified position
	this.draw = function() {
		
		var sheet = this.animations[this.currSpriteSheetName];
		if(sheet)
		{
			if(this.state == "normal")
				sheet.drawSprite(this.position.x,this.position.y,this.scale,0);
			else
				sheet.drawSprite(this.position.x,this.position.y,this.scale,this.state.frame);
		}
		
	};
	
	//checks if a sprite bearing a certain name exists in a given spritesheet
	//not used as of now
	this.findSprite = function(name) {
		
		var sheet = null;
		
		for(var sheetName in this.animations)
		{
			if(this.animations[sheetName].spriteExists(name))
			{
				sheet = this.animations[sheetName];
				break;
			}
		}
		
		return sheet;
		
	};
	
	//collision handler
	this.onTouch = function() {
	
	};
	
	//sets the status of the player to change current sprite
	//not used as of now
	this.setState = function(name) {
		this.state = name;
		
		//if the sprite is now in an animation state
		if(name != "normal")
		{
			//if it's a beginning-to-end animation
			if(this.animations[name].animationType == "one")
			{
				this.state = {
					state : name,
					frame : 0
				};
				this.currSpriteSheetName = name;
			}
			//if it's a beginning-to-end-to-beginning animation
			else if(this.animations[name].animationType == "seesaw")
			{
				this.state = {
					state : name,
					frame : 0,
					direction : "fwd"
				};
				this.currSpriteSheetName = name;
			}
		}
		else
		{
			this.currSpriteSheetName = this.spriteName;
		}
	};
	
	//for a given animation, returns the index of the next frame
	//not used as of now
	this.updateNextFrame = function() {
		var name = this.state.state;
		
		if(this.animations[name].animationType == "one" && this.state.frame < this.animations[name].spritesArray.length)
		{
			this.state.frame = (this.state.frame+1)%this.animations[name].spritesArray.length;
			if(this.state.frame == 0)
			{
				//stop the action
				this.setState("normal");
			}
		}
		
		else if(this.animations[name].animationType == "seesaw")
		{
			if(this.state.direction == "fwd" && this.state.frame == this.animations[name].spritesArray.length-1)
			{
				//turn back
				this.state.frame -= 1;
				this.state.direction == "back";
			}
			else if(this.state.direction == "back" && this.state.frame == 0)
			{
				//turn back
				this.state.frame += 1;
				this.state.direction == "fwd";
			}
			else if(this.state.direction == "fwd")
			{
				//advance frame to next
				this.state.frame += 1;
			}
			else if(this.state.direction == "back")
			{
				//advance frame to next
				this.state.frame -= 1;
			}
		}
	};

}

var ground = null;

var leftWall = null;

var rightWall = null;

var ceiling = null;

var ball = null;

//the explosion hasn't been made yet
var explosion = null;

//stores all mine entities
var mines = [];

//a metric of difficulty
var mineCount = 0;

function loadGround() 
{
	//the ground object
	ground = new Entity();
	
	ground.id = "Ground";
	
	ground.position.x = canvas.width/2;
	
	ground.position.y = canvas.height+10;
	
	ground.direction.x = 1;
	
	ground.direction.y = 1;
	
	ground.scale = 1;
	
	ground.killed = false;
	
	ground.type = "static";
	
	
	var entityDef = null;
	entityDef = {
		id : "Ground",
		x : ground.position.x,
		y : ground.position.y,
		halfHeight : 10,
		halfWidth : canvas.width/2,
		type : "static",
		userData : {
			entity : ground
		}
	};
	
	ground.physicsBody = gPhysicsEngine.addBody(entityDef);
	
}

function loadWalls() 
{
	//the wall objects, load if you want fixed, invisible walls on the sides
	
	leftWall = new Entity();
	
	leftWall.id = "leftWall"
	
	leftWall.position.x = -10;
	
	leftWall.position.y = canvas.height/2;
	
	leftWall.direction.x = 1;
	
	leftWall.direction.y = 1;
	
	leftWall.scale = 1;
	
	leftWall.killed = false;
	
	leftWall.type = "static";
	
	
	var entityDef = null;
	entityDef = {
		id : "LeftWall",
		x : leftWall.position.x,
		y : leftWall.position.y,
		halfHeight : canvas.height/2,
		halfWidth : 10,
		type : "static",
		settings : {
			density : 1.0,
			friction : 0,
			restitution : 1.0
		},
		userData : {
			entity : leftWall
		}
	};
	
	leftWall.physicsBody = gPhysicsEngine.addBody(entityDef);
	
	rightWall = new Entity();
	
	rightWall.id = "rightWall";
	
	rightWall.position.x = canvas.width+10;
	
	rightWall.position.y = canvas.height/2;
	
	rightWall.direction.x = 1;
	
	rightWall.direction.y = 1;
	
	rightWall.scale = 1;
	
	rightWall.killed = false;
	
	rightWall.type = "static";
	
	
	var entityDef = null;
	entityDef = {
		id : "RightWall",
		x : rightWall.position.x,
		y : rightWall.position.y,
		halfHeight : canvas.height/2,
		halfWidth : 10,
		type : "static",
		settings : {
			density : 1.0,
			friction : 0,
			restitution : 1.0
		},
		userData : {
			entity : rightWall
		}
	};
	
	rightWall.physicsBody = gPhysicsEngine.addBody(entityDef);
	
}

function loadCeiling() 
{
	//the ceiling object
	ceiling = new Entity();
	
	ceiling.id = "Ceiling";
	
	ceiling.position.x = canvas.width/2;
	
	ceiling.position.y = -10;
	
	ceiling.direction.x = 1;
	
	ceiling.direction.y = 1;
	
	ceiling.scale = 1;
	
	ceiling.killed = false;
	
	ceiling.type = "static";
	
	
	var entityDef = null;
	entityDef = {
		id : "Ceiling",
		x : ceiling.position.x,
		y : ceiling.position.y,
		halfHeight : 10,
		halfWidth : canvas.width/2,
		type : "static",
		userData : {
			entity : ceiling
		}
	};
	
	ceiling.physicsBody = gPhysicsEngine.addBody(entityDef);
	
}

function loadBall()
{
	//the ball object
	ball = new Entity();
	
	ball.id = "ball";
	
	ball.direction.x = 1;
	
	ball.direction.y = 1;
	
	ball.scale = canvas.height/14;

	ball.position.x = canvas.width/4;
	
	ball.position.y = canvas.height/2;
	
	ball.killed = false;
	
	ball.type = "dynamic";
	
	ball.draw = function() {
		ctx.beginPath();
		ctx.arc(this.position.x,this.position.y,this.scale,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();
		
		//necessary when FastCanvas is used
		FastCanvas.render();
	};
	
	ball.update = function() {
		
		/*if(!keyPress & this.position.y < canvas.height - this.scale)
			this.physicsBody.SetPosition(this.physicsBody.GetPosition().x,this.physicsBody.GetPosition().y + 1);*/
		this.direction = this.physicsBody.GetLinearVelocity();
		this.position = this.physicsBody.GetPosition();
		this.draw();
	};
	
	ball.onTouch = function(otherBody,point,impulse) {
	
		if(otherBody.GetUserData().entity.id == "mine")
		{
			//if the ball hits a mine, it's game over
			this.killed = true;
			gameOver = true;
		}
		if(otherBody.GetUserData().entity.id == "cleaver")
		{
			//if the cleaver is hit, both the ball and the cleaver will repel each other
			var cleaver = otherBody.GetUserData().entity;
			var power = 1000000000000, directionX = this.position.x - cleaver.position.x, directionY = this.position.y - cleaver.position.y;

			//Remove below comment to make the game harder
			this.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(directionX * power * this.scale * 10,directionY * power * this.scale * 10),this.physicsBody.GetWorldCenter());
			cleaver.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(-1 * directionX * power * cleaver.scale * 10,-1 * directionY * power * cleaver.scale * 10),cleaver.physicsBody.GetWorldCenter());
		}
	};
	
	var entityDef = null;
	entityDef = {
		id : "ball",
		x : ball.position.x,
		y : ball.position.y,
		halfHeight : ball.scale,
		halfWidth : ball.scale,
		type : "dynamic",
		settings : {
			density : 0.1,
			friction : 0,
			restitution : 1.0
		},
		//putting userData->entity so that whenever Box2D returns a body reference, we have a way to get a handler to the corresponding entity
		//(Box2D has a GetUserData function attached to its physics bodies)
		userData : {
			entity : ball
		}
	};
	
	//set the ball's physicsBody for the first time
	ball.physicsBody= gPhysicsEngine.addBody(entityDef);
	
}

function loadMine()
{

		//spawn a random mine
		var mine = new Entity();
		
		//identify this entity as a mine
		mine.id = "mine";
		
		//Keep experimenting with different scales
		mine.scale = canvas.height/20 * (1 + Math.random());
		
		mine.position.x = canvas.width-mine.scale;
		
		mine.position.y = Math.random()*canvas.height;
		
		mine.killed = false;
		
		mine.type = "dynamic";
		
		//the number of game cycles after which the mines redirect themselves towards the ball
		mine.redirectionInterval = 350;
		
		//choose a random value from 0 to 349 to act as the redirection point for this mine
		//this helps to make different mines less likely to redirect at the same time, thus making the game easier
		mine.redirectionValue = Math.random() * (mine.redirectionInterval-1);
		
		mine.redirectionCounter = 0;
		
		mine.setPhysicsBody = function() {
			
			var entityDef = null;
			entityDef = {
				id : "mine",
				x : this.position.x,
				y : this.position.y,
				halfHeight : this.scale,
				halfWidth : this.scale,
				type : "dynamic",
				settings : {
					density : 0.1,
					friction : 0,
					restitution : 1.0
				},
				//putting userData->entity so that whenever Box2D returns a body reference, we have a way to get a handler to the corresponding entity
				//(Box2D has a GetUserData function attached to its physics bodies)
				userData : {
					entity : this
				}
			};
			
			this.physicsBody= gPhysicsEngine.addBody(entityDef);

		};
		
		mine.draw = function() {
			
			ctx.beginPath();
			ctx.arc(this.position.x,this.position.y,this.scale,0,2*Math.PI);
			ctx.closePath();
			ctx.stroke();
			
			//necessary when FastCanvas is used
			FastCanvas.render();
		};
		
		mine.update = function() {
			if(this.position.x < -parseInt(this.scale))
			{
				//if the mine moves out of the screen, just create a new entity
				this.killed = true;
			}
			else
			{
				//periodically apply impulses in the direction of the ball to the mine to keep it moving
				//the mod value for counter here is a direct metric of difficulty
				//higher values make the game easier
				if(this.redirectionCounter % this.redirectionValue == 0)
					this.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2((ball.position.x - this.position.x) * 1000 * this.scale,(ball.position.y - this.position.y) * 1000 * this.scale),this.physicsBody.GetWorldCenter());
				
				this.redirectionCounter = (this.redirectionCounter+1)%this.redirectionInterval;
				this.direction = this.physicsBody.GetLinearVelocity();
				this.position = this.physicsBody.GetPosition();
				this.draw();
			}
		};
		
		mine.onTouch = function(otherBody,point,impulse) {
			if(otherBody.GetUserData().entity.id == "mine")
			{
				//if another mine is hit, both the mines will repel each other
				var otherMine = otherBody.GetUserData().entity;
				var power = 1000000000000, directionX = this.position.x - otherMine.position.x, directionY = this.position.y - otherMine.position.y;

				this.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(directionX * power * this.scale * 10,directionY * power * this.scale * 10),this.physicsBody.GetWorldCenter());
				otherMine.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(-1 * directionX * power * otherMine.scale * 10,-1 * directionY * power * otherMine.scale * 10),otherMine.physicsBody.GetWorldCenter());
			}
	};
		
		
		//set this entity's physics body for the first time
		mine.setPhysicsBody();
		
		//give it some random velocity for no particular reason
		mine.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.random() * 1000000000000 * mine.scale * 10,Math.random() * 1000000000000 * mine.scale * 10),mine.physicsBody.GetWorldCenter());
		
		return mine;
}

function loadCleaver()
{

		//spawn the cleaver
		var cleaver = new Entity();
		
		//identify this entity as a cleaver
		cleaver.id = "cleaver";
		
		cleaver.scale = canvas.height/14;
		
		cleaver.position.x = cleaver.scale;
		
		cleaver.position.y = cleaver.scale;
		
		cleaver.killed = false;
		
		cleaver.type = "dynamic";
		
		cleaver.setPhysicsBody = function() {
			
			var entityDef = null;
			entityDef = {
				id : "marble",
				x : this.position.x,
				y : this.position.y,
				halfHeight : this.scale,
				halfWidth : this.scale,
				type : "dynamic",
				settings : {
					density : 0.1,
					friction : 0,
					restitution : 1.0
				},
				//putting userData->entity so that whenever Box2D returns a body reference, we have a way to get a handler to the corresponding entity
				//(Box2D has a GetUserData function attached to its physics bodies)
				userData : {
					entity : this
				}
			};
			
			this.physicsBody= gPhysicsEngine.addBody(entityDef);

		};
		
		//for drawing purposes, to provide the feel of rotation
		cleaver.highlightAngle = 0;
		
		cleaver.draw = function() {
			
			ctx.beginPath();
			ctx.arc(this.position.x,this.position.y,this.scale,this.highlightAngle,this.highlightAngle + Math.PI/2);
			ctx.closePath();
			ctx.stroke();
			
			//necessary when FastCanvas is used
			FastCanvas.render();
		};
		
		cleaver.update = function() {
			if(this.position.x < -parseInt(this.scale))
			{
				//if the cleaver moves out of the screen, just create a new entity
				this.killed = true;
			}
			else
			{
				this.direction = this.physicsBody.GetLinearVelocity();
				this.position = this.physicsBody.GetPosition();
				this.highlightAngle += speed*100;
				this.draw();
			}
		};
		
		cleaver.onTouch = function(otherBody,point,impulse) {
		/*
		if((otherBody.GetUserData().entity.id == "leftWall" ) || (otherBody.GetUserData().entity.id == "rightWall"))
		{
			//if the ball hits a wall, rebound
			var power = 10000000, directionX = this.direction.x * -1, directionY = this.direction.y;
			
			this.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(directionX * power * this.scale * 10,directionY * power * this.scale * 10),this.physicsBody.GetWorldCenter());
		}
		
		else if((otherBody.GetUserData().entity.id == "Ceiling" ) || (otherBody.GetUserData().entity.id == "Ground"))
		{
			//if the marble hits a wall, rebound
			var power = 10000000, directionX = this.direction.x, directionY = this.direction.y * -1;
			
			this.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(directionX * power * this.scale * 10,directionY * power * this.scale * 10),this.physicsBody.GetWorldCenter());
		}
		*/
		if(otherBody.GetUserData().entity.id == "mine")
		{
			//if the cleaver hits a mine, the mine gets destroyed
			otherBody.GetUserData().entity.killed = true;
		}
		
	};
		
		
		//set this entity's physics body for the first time
		cleaver.setPhysicsBody();
		
		//set the cleaver in motion after it's created
		cleaver.physicsBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(1 * 1000000000000 * cleaver.scale * 10,1 * 1000000000000 * cleaver.scale * 10),cleaver.physicsBody.GetWorldCenter());
		
		return cleaver;
}

function populateMines()
{
	//spawn random mines
	if(mines.length < mineCount)
	{
		mines.push(loadMine());
	}
}
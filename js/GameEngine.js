//the array that stores all active entities that the game engine should update every cycle,
//sorted in their rendering order
var entitiesByZindex;

//the speed of rotation of the cleaver/used for movements in some places, but to no avail
var speed;

//if you don't know what this is for, you need to question your existence
var score;

//counts the number of loop cycles, and eventually wraps around
var counter;

//flags indicating that you've died, or you're looking at the menu right now
var gameOver;
var menu;

//set this flag to true anywhere, and the game engine will halt
//convenient for development purposes, as you can halt the game and check values at any point
var debug = false;

//one cycle of computation
function gameEngineLoop()
{
	if(counter % 50 == 49)
		score += 1;
	counter += 1;
	//wrap around
	//I'm scared of huge numbers for some reason
	if(counter > 10000)
		counter = 1;
	
	//clear the screen
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//draw the grid
	//I hate plain white backgrounds
	drawGrid();
	//perform physics computations
	//--> check if collisions have occurred, and update positions and velocities of physics bodies
	gPhysicsEngine.update();
	//if the number of mines on the field is less than mineCount, more mine(s) will be added
	populateMines();
	//go through the entities in their rendering order, and fire their update functions
	for(var i=0; i < entitiesByZindex.length; i++)
	{
		for(var j=0; j < entitiesByZindex[i].length; j++)
		{
			
			//render only if the entity hasn't been marked for death, else destroy it
			if(!entitiesByZindex[i][j].killed && !gameOver)
				entitiesByZindex[i][j].update();
			else if(!entitiesByZindex[i][j].killed && gameOver)
				entitiesByZindex[i][j].killed = true;
			if(entitiesByZindex[i][j].killed)
			{
				//if the entity is marked for death, destroy it
				if(entitiesByZindex[i][j].id = "mine" && !gameOver)
				{
					//do the score computation and difficulty setting here instead of in the collision handler
					//since a single collision fires the handler multiple times in Box2D
					//Box2D is stupid.
					
					//increase the score by a good amount
					score += 30;
					
					//there's a chance things may become a little more difficult now...
					//(of course, put a cap on the difficulty. you can't have an infinite number of mines on the field, now, can you?)
					var increaseDifficultyFlag = Math.random();
					if(increaseDifficultyFlag < 0.1 && mineCount < 6)
						mineCount += 1;
				}
				entitiesByZindex[i][j].kill(i,j);
			}
		}
	}
	
	//print the score
	ctx.fillText(score.toString(),0,canvas.height);
	
	if(gameOver)
	{
		ctx.font = Math.round(canvas.height/15) + "px Helvetica";
		ctx.fillText("Score : " + score.toString(),canvas.width/2 - 50, canvas.height/2 - canvas.height/6.5);
		ctx.fillText("YOU LOSE.",canvas.width/2 - 50, canvas.height/2);
		ctx.font = Math.round(canvas.height/20) + "px Helvetica";
		ctx.fillText("Tap to retry.",canvas.width/2 - 50, canvas.height/2 + canvas.height/7.5);
		
		var gameStorageObj = {
			highScore : score
		};
		
		if(score > highScore)
			localStorage.setItem('gameStorage', JSON.stringify(gameStorageObj));
	}
	else if(debug)
	{
		//do nothing; end the game loop
	}
	else
	{
		//fire the next game loop iteration while succumbing to HTML5 Canvas's whims
		window.requestAnimationFrame(gameEngineLoop);
	}
}
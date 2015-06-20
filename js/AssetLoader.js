//Initializes the game	

var	canvas = FastCanvas.create();
var	ctx = canvas.getContext("2d");

ctx.font = Math.round(canvas.height/15) + "px Helvetica";

var frameRate = 1000/60;

var highScoreObj = JSON.parse(localStorage.getItem('gameStorage'));
var highScore = 0;
if(highScoreObj)
	highScore = highScoreObj.highScore;

var writer = null;

//The list of assets to be loaded via ajax, blank for now
var assetList = [	
					
				];
				
for(var i=0;i<assetList.length;i++)
{
	var sheet = null;
	if(assetList[i].indexOf('png') > -1)
	{
		sheet = new SpriteSheet(assetList[i],false);
	}
	else
	{
		sheet = new SpriteSheet(assetList[i],true);
	}
	gSpriteSheets[assetList[i].substring(assetList[i].lastIndexOf('/')+1)] = sheet;
}

var ctr = 0;

loadMenu();

function drawGrid()
{
	ctx.strokeStyle = '#CCC';
	for(var i=0; i < canvas.width; i += canvas.width/100)
	{
		ctx.beginPath();
		ctx.moveTo(i,0);
		ctx.lineTo(i,canvas.height);
		ctx.closePath();
		ctx.stroke();
	}
	for(var j=0; j < canvas.height; j += canvas.width/100)
	{
		ctx.beginPath();
		ctx.moveTo(0,j);
		ctx.lineTo(canvas.width,j);
		ctx.closePath();
		ctx.stroke();
	}
	ctx.strokeStyle = '#000';
}

function loadMenu()
{
	//the input engine has a provision to call loadGame below once a click/touch event has been registered

	menu = true;
	
	drawGrid();
	
	ctx.font = Math.round(canvas.height/4.5)  + "px Helvetica";
	ctx.fillText('swipeball',2*canvas.width/5,canvas.height/2);
	
	ctx.font = Math.round(canvas.height/30) + "px Helvetica";
	ctx.fillText('Instructions:',canvas.width/20,canvas.height/2+canvas.height/25);
	ctx.fillText('You control the solid ball.',canvas.width/20,canvas.height/2+canvas.height/25+canvas.height/35+canvas.height/40);
	ctx.fillText('Avoid the mines. Touching one ends the game.',canvas.width/20,canvas.height/2+canvas.height/25+2*(canvas.height/35+canvas.height/40));
	ctx.fillText('You can knock the cleaver onto mines by touching it,',canvas.width/20,canvas.height/2+canvas.height/25+3*(canvas.height/35+canvas.height/40));
	ctx.fillText('and this destroys the mines and earns you extra points.',canvas.width/20,canvas.height/2+canvas.height/25+4*(canvas.height/35+canvas.height/40)-canvas.height/40);
	
	ctx.beginPath();
	ctx.arc(canvas.width/20-2*canvas.height/60,canvas.height/2+canvas.height/25+(canvas.height/35+canvas.height/40)-canvas.height/60,canvas.height/60,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.arc(canvas.width/20-2*canvas.height/60,canvas.height/2+canvas.height/25+2*(canvas.height/35+canvas.height/40)-canvas.height/60,canvas.height/60,0,2*Math.PI);
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(canvas.width/20-2*canvas.height/60,canvas.height/2+canvas.height/25+3*(canvas.height/35+canvas.height/40)-canvas.height/60,canvas.height/60,0,Math.PI/2);
	ctx.closePath();
	ctx.stroke();
	
	ctx.font = Math.round(canvas.height/25) + "px Helvetica";
	ctx.fillText('Tap the screen to play.',3*canvas.width/4,canvas.height -10);
	
	ctx.font = Math.round(canvas.height/15) + "px Helvetica";
	ctx.fillText('High Score: ' + highScore,4*canvas.width/7,canvas.height/2 + Math.round(canvas.height/9));
}

function loadGame() {
	
	if(ctr == assetList.length)
	{
		//load all entities, push them to the active entities array and begin the game loop
		gPhysicsEngine = new PhysicsEngine();
		globalMovement = 0;
		score = 0;
		counter = 0;
		speed = 1;
		gameOver = false;
		menu = false;
		loadGround();
		loadCeiling();
		loadWalls();
		loadBall();
		entitiesByZindex = [];
		entitiesByZindex.push([ball]);
		entitiesByZindex.push([loadCleaver()]);
		mineCount = 2;
		entitiesByZindex.push(mines);
		gameEngineLoop();
	}
}

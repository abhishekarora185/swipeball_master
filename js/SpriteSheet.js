//define the SpriteSheet class

//this file isn't used by swipeball (yet)

function SpriteSheet(path,jsonData) {
	
	//path to sprite/spritesheet data (image, and maybe json)
	this.path = null;
	
	//json data for spritesheet, if it is a spritesheet
	this.data = null;
	
	//image file to be used for drawing
	this.image = null;
	
	//the entity that this sheet belongs to
	this.ownerEntity = null;
	
	//type of animation that the sprite represents, if it does represent one
	//can be one-time or to-and-fro
	this.animationType = null;
	
	//helps if the spritesheet is for a single animation
	this.spritesArray = [
	
	];
	
	//helps if access to sprites is done randomly
	this.spritesHash = {
	
	};
	
	//called when objects are created, effectively a constructor/populator
	this.create = function() {
		this.path=path;

		if(jsonData)
		{
			var self = this;
			
			//perform asynchronous XMLHttpRequest for json file
			var request = new XMLHttpRequest();
			request.overrideMimeType("application/json");
			request.onreadystatechange = function() {
				if (request.readyState === 4) 
				{
					if(request.status == 0)
					{
						self.data = JSON.parse(request.responseText);
						self.parseAtlas();
					}
					else
						console.log(request);
				}
			};
			request.open("GET",this.path + ".json",true);
			request.send();
		}
		else
		{
			console.log("Error");
			return;
		}
	};
	
	//loads image object for spritesheet, parses json data and stores individual sprite data/loads image object for single sprite
	this.parseAtlas = function() {
		
		var self = this;
		
		if(this.data)
		{
			//the file in question is a spritesheet
			var sheet = this.data.frames;
			
			var img = new Image();
			img.src = this.path + ".png";
			var self = this;
			img.onload = function() {
				self.image = img;
				for(var sprite in sheet)
				{
					//store sprite data in both array and hash form
					
					var cx = -sheet[sprite].frame.w * 0.5;
					var cy = -sheet[sprite].frame.h * 0.5;
					
					if(sheet[sprite].trimmed)
					{
						cx = sheet[sprite].spriteSourceSize.x - sheet[sprite].sourceSize.w * 0.5;
						cy = sheet[sprite].spriteSourceSize.y - sheet[sprite].sourceSize.h * 0.5;
					}
					
					var newSprite = {
						x : sheet[sprite].frame.x,
						y : sheet[sprite].frame.y,
						w : sheet[sprite].frame.w,
						h : sheet[sprite].frame.h,
						cx : cx,
						cy : cy
					};
					
					self.spritesArray.push(newSprite);
					
					self.spritesHash[sprite] = newSprite;
				}
				loadAsset();
			};
			
		}
		
		else
		{
			var img = new Image();
			img.src = this.path;
			img.onload = function() {
				self.image = img;
			};
		}
		
	};
	
	//draws a given sprite in spritesheet/sprite that this object represents
	this.drawSprite = function(x,y,scale,spriteName) {
		if(this.data && !isNaN(spriteName))
			//object is a spritesheet, spriteName is an array index
			ctx.drawImage(this.image,this.spritesArray[spriteName].x,this.spritesArray[spriteName].y,this.spritesArray[spriteName].w,this.spritesArray[spriteName].h,x+this.spritesArray[spriteName].cx,y+this.spritesArray[spriteName].cy,this.spritesArray[spriteName].w*scale,this.spritesArray[spriteName].h*scale);
		else if(this.data && isNaN(spriteName))
			//object is a spritesheet, spriteName is a string
			ctx.drawImage(this.image,this.spritesHash[spriteName].x,this.spritesHash[spriteName].y,this.spritesHash[spriteName].w,this.spritesHash[spriteName].h,x+this.spritesHash[spriteName].cx,y+this.spritesHash[spriteName].cy,this.spritesHash[spriteName].w*scale,this.spritesHash[spriteName].h*scale);
	};
	
	this.create();
	
}

var gSpriteSheets = {};
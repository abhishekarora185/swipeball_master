//Create physics objects
//Update each cycle (movements under forces, collisions)

function PhysicsEngine() {
	
	var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,  b2AABB = Box2D.Collision.b2AABB
         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            ;
	
	//this setting is needed to enable elastic collisions
	Box2D.Common.b2Settings.velocityThreshold = 0;
	
	this.world = null;
	
	this.create = function() {
		
		this.world = new b2World(
			new b2Vec2(0,0),
			false
		);
		
	};
	
	this.update = function() {
		var start = Date.now();
		
		this.world.Step(
			100,
			100,
			100
		);
		
		this.world.ClearForces();
		
		return(Date.now() - start);
	};
	
	this.registerBody = function(bodyDef) {
		var body = this.world.CreateBody(bodyDef);
		return body;
	};
	
	//add normal body (wall or main ball)
	this.addBody = function(entityDef) {
		
		var bodyDef = new b2BodyDef();
		
		if(entityDef.id)
			bodyDef.id = entityDef.id;
		
		if(entityDef.type == "static")
			bodyDef.type = b2Body.b2_staticBody;
		else
			bodyDef.type = b2Body.b2_dynamicBody;
			
		bodyDef.position.x = entityDef.x;
		bodyDef.position.y = entityDef.y;
		
		if(entityDef.userData)
			bodyDef.userData = entityDef.userData;
		
		var fixtureDefinition = new b2FixtureDef();
		
		if(entityDef.settings)
		{
			fixtureDefinition.density = entityDef.settings.density;
			fixtureDefinition.friction = entityDef.settings.friction;
			fixtureDefinition.restitution = entityDef.settings.restitution;
		}
		
			//setting fixture for ball and walls
			fixtureDefinition.shape = new b2PolygonShape();
			fixtureDefinition.shape.SetAsBox(entityDef.halfWidth,entityDef.halfHeight);
		
		var body = this.registerBody(bodyDef);
		body.CreateFixture(fixtureDefinition);
		
		return body;
		
	};
	
	this.removeBody = function(obj) {
		this.world.DestroyBody(obj);
	};
	
	this.addContactListener = function(callbacks) {
		var listener = new Box2D.Dynamics.b2ContactListener();
		
		if(callbacks.PostSolve)
		{
			listener.PostSolve = function(contact,impulse) {
				callbacks.PostSolve(
					contact.GetFixtureA().GetBody(),
					contact.GetFixtureB().GetBody(),
					impulse.normalImpulses[0]
				);
			};
		}
		
		this.world.SetContactListener(listener);
	};
	
	this.create();
	this.addContactListener({
		
		PostSolve : function(bodyA,bodyB,impulse) {
			
			if(bodyA && bodyB && bodyA.GetUserData() && bodyB.GetUserData())
			{
				var uA = bodyA.GetUserData();
				var uB = bodyB.GetUserData();
				uA.entity.onTouch(bodyB, null, impulse);
				uB.entity.onTouch(bodyA, null, impulse);

			}
		}
		
	});
};

var gPhysicsEngine;

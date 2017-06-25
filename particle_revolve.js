// motivation
// http://particler.swypse.ru/
var canvas = document.getElementById("frame1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx  = canvas.getContext("2d");
var no_of_points = 60;
var dot_minr = 1;
var dot_maxr = 3;
var revolve_minr =2;
var revolve_maxr =10;
var dtheta = 0.1;
var cw = canvas.width;
var ch = canvas.height;
var r_increment = 0.01;
// the mouse over varibles
var ri = 50;


points = []
backup =[]
// each point will have the follwing attributes
// theta <- the current polar angle the particle is at
// radius <- the current radius of revolution
// cX <- center's X coordinate
// cY <- center's Y coordinate
// r <- radius of the dot itself
// dt <- the small change in theta , mainly used to speed up and slow down dots
// rg <- radius gain, R+dr gives the impression of dots going in and coming out of the canvas
// rinc <- boolean to decide whether R+dr is to be done or R-dr
// -------------- instead of using rinc we can make rg negative or positive when we hit extreme, implement that


// ---------------------------------------------------------------------intialise the points giving them random centers and theta
for(c=0;c<no_of_points;c++){
	var fill_t = Math.floor(Math.random()*360);
	var iniX=Math.random()*cw;
	var iniY=Math.random()*ch;
	points[c]={theta:fill_t,radius:revolve_maxr,cX:iniX,cY:iniY,r:Math.random()*2+1,dt:dtheta,rg:r_increment,rinc:true};
	backup[c]={cX:iniX,cY:iniY};
}

// --------------------------------------------------------------------drawing dots include changing theta and radius(self)
function drawDots(){
	for(c=0;c<no_of_points;c++){
		var tp=points[c];
		var newX = tp.cX + tp.radius * Math.cos(tp.theta);
		var newY = tp.cY + tp.radius * Math.sin(tp.theta);
		if(tp.r+tp.rg>dot_maxr)
			tp.rinc=false;
		else if(tp.r - tp.rg<dot_minr)
			tp.rinc=true;
		if(tp.rinc)
			tp.r+=tp.rg;
		else
			tp.r-=tp.rg;
		ctx.beginPath();
		ctx.arc(newX,newY,tp.r,0, 2*Math.PI);
		ctx.fillStyle = "violet";
		ctx.fill();
		ctx.closePath();
	}
}

// -------------------------------------------------------------------revolve just updates the theta for all points.
function revolve(){
	for(c=0;c<no_of_points;c++){
		var new_theta = (points[c].theta + points[c].dt)%360;
		points[c].theta = new_theta;
	}
}

// -------------------------------------------------------------------draw : clear the current screen and draw dots make them revolve
function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawDots();
	revolve();
}

// -------------------------------------------------------------------mouse move handler
document.addEventListener("mousemove",mouseHandler, false);
function mouseHandler(e){
	var relativeX = e.clientX - canvas.offsetLeft;
	var relativeY = e.clientY - canvas.offsetTop;
	// take the gravity into consideration only when mouse is inside the canvas window
	if(relativeX >0 && relativeX<cw && relativeY>0 && relativeY <ch){
		for(c=0;c<no_of_points;c++){
			var tp = points[c];
			var bp = backup[c];
			// get the relative distance between the dot and cursor
			var dif = Math.pow(relativeX-bp.cX,2) + Math.pow(relativeY-bp.cY,2)
			// if dot is within the radius of influence act on it
			if(dif<Math.pow(ri,2)){
				// tried to implement a simple gravity like model
				tp.cX = tp.cX-(tp.cX-relativeX)/ri;
				tp.cY = tp.cY-(tp.cY-relativeY)/ri;
				tp.rg=0.1;
				// make it faster
				tp.dt=0.3;
			}
			else{
				// return to the original position
				// problems here, sudden shift of dots make looks shit
				tp.cX=bp.cX;
				tp.cY=bp.cY;
				tp.rg=r_increment;
				tp.dt=dtheta;
			}
		}
	}
	else{
		// optimise this,
		// actually it is meant for only those dots which were under the radius of influence before the cursor goes out of picture
		for(c=0;c<no_of_points;c++){
			points[c].cX = backup[c].cX;
			points[c].cY = backup[c].cY;
			points[c].rg = r_increment;
			points[c].dt = dtheta;
		}
	}
}

setInterval(draw,40);

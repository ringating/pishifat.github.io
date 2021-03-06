/*
click+drag to pan
scroll or up/down to zoom
left/right to rotate
*/

// written by Ringating

var rotSpeed = 180; // degrees per sec
var scaSpeed = 2; // % (out of 1) per sec
var scaStep = 0.15; // % (out of 1) that it scales for each scroll delta (a delta of 3 per scroll tick is common)
var minVertPercScale = 0.33333333; // % (out of 1) that image height scale can be relative to window height
var borderLimit = 0.25; // border in % of the window height that the image must remain on the window, horizontally and vertically
var speed = 500; //  px/sec that image will move using WASD or arrow keys

var bl;

var img;
var posX;
var posY;
var rot;
var sca;

var pressX;
var pressY;
var wasPressed;

var dt;
var pmillis;

var font = 'Consolas';

var bg;

function preload()
{
	//img = loadImage('https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png');
	img = loadImage('processing/assets/bigboy2.png');
	//bg = loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Cahier_Atoma_ouvert.jpg/1280px-Cahier_Atoma_ouvert.jpg');
	bg = loadImage('processing/assets/bg.png');
}

function setup() 
{	
	bl = windowHeight * borderLimit;
	frameRate(999);
	angleMode(DEGREES);
	createCanvas(windowWidth, windowHeight);
	sca = windowHeight/img.height;
	//posX = windowWidth/2;
	posX = sca*(img.width/2);
	posY = windowHeight/2;
	rot = 0;
	wasPressed = mouseIsPressed;
	pmillis = millis();
}

function draw() 
{
	background(255);
	
	dtSet();
	
	if(bg.width/bg.height > windowWidth/windowHeight)
	{
		// bg's aspect ratio is wider than window's
		// so scale bg by height
		push();
		scale(windowHeight/bg.height);
		image(bg,0,0);
		pop();
	}
	else
	{
		// bg's aspect ratio is thinner than window's
		// so scale bg by width
		push();
		scale(windowWidth/bg.width);
		image(bg,0,0);
		pop();
	}
	
	textAlign(LEFT,BOTTOM);
	textSize(16)
	textFont(font);
	fill(255);
	text("click+drag to pan",4,16);
	text("left/right to rotate",4,36);
	text("up/down to zoom",4,56);
	//textAlign(RIGHT,TOP);
	//text((1/dt).toFixed(0) + " fps",windowWidth-4,4);
	
	push();
	
	move();
	//spin();
	zoom();
	
	image(img,-img.width/2,-img.height/2);
	
	pop();
	
	fill(10);
	textAlign(RIGHT,TOP);
	text((1/dt).toFixed(0) + " fps",windowWidth-4,4);
}

function move()
{
	if(mouseIsPressed)
	{
		posX += mouseX - pmouseX;
		posY += mouseY - pmouseY;
	}
	
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68))
	{
		posX -= speed * dt;
	}
	
	if(keyIsDown(LEFT_ARROW) || keyIsDown(65))
	{
		posX += speed * dt;
	}
	
	if(keyIsDown(DOWN_ARROW) || keyIsDown(83))
	{
		posY -= speed * dt;
	}
	
	if(keyIsDown(UP_ARROW) || keyIsDown(87))
	{
		posY += speed * dt;
	}
	
	if(posX > windowWidth - bl + sca * (img.width/2))
	{
		posX = windowWidth - bl + sca * (img.width/2);
	}
	
	if(posX < bl - sca * (img.width/2))
	{
		posX = bl - sca * (img.width/2);
	}
	
	if(posY > windowHeight - bl + sca * (img.height/2))
	{
		posY = windowHeight - bl + sca * (img.height/2);
	}
	
	if(posY < bl - sca * (img.height/2))
	{
		posY = bl - sca * (img.height/2);
	}
	
	translate(posX,posY);
}

function spin()
{
	
	if(keyIsDown(RIGHT_ARROW))
	{
		rot += rotSpeed * dt;
	}
	
	if(keyIsDown(LEFT_ARROW))
	{
		rot -= rotSpeed * dt;
	}
	
	rotate(rot);
}

function zoom()
{
	
	/*
	if(keyIsDown(UP_ARROW))
	{
		sca *= 1+(scaSpeed*dt);
	}
	
	if(keyIsDown(DOWN_ARROW))
	{
		sca *= 1-(scaSpeed*dt);
	}
	*/
	
	scale(sca);
}

function dtSet()
{
	dt = (millis() - pmillis)/1000; // set delta time, in seconds
	pmillis = millis();
}

function mouseWheel(event)
{
	if (sca < minVertPercScale * windowHeight / img.height)
	{
		sca = minVertPercScale * windowHeight / img.height;
	}
	
	if(!(sca * (1 - (event.delta/Math.abs(event.delta) * scaStep)) < minVertPercScale * windowHeight / img.height))
	{
		sca *= 1 - (event.delta/Math.abs(event.delta) * scaStep);
		posX += (event.delta/Math.abs(event.delta) * scaStep)*(mouseX - posX);
		posY += (event.delta/Math.abs(event.delta) * scaStep)*(mouseY - posY);
	}
	
	print(event.delta);
	
	return false;
}
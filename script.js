
//Fast prime number generator!

var primes = function* primes() {
  yield 2; yield 3; yield 5; yield 7;

  const sieve = new Map();
  const ps = primes(); 
  ps.next(); 
  ps.next();
  
  for (let p = 3, i = 9; true; i += 2) {
    let s = sieve.get(i);

    if (s !== undefined) {
      sieve.delete(i);
    } else if (i < p * p) {
      yield i;
      continue;
    } else {
      s = 2 * p;
      p = ps.next().value;
    }
    
    let k = i + s;
    while (sieve.has(k)) k += s;
    sieve.set(k, s);
  }
}
var gen = primes();



//Create a canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


//Start at the center of the canvas, pointing upwards
var x = 512;
var y = 512;
var dir = 0;

//Last prime number that we reached
var last = 0;

//Make everything black
ctx.fillStyle = "black";
ctx.fillRect(0, 0, c.width, c.height);

//Lots of opacity
ctx.globalAlpha = 0.04;

//Start the first path!
ctx.beginPath();
ctx.moveTo(x, y);

//Number of prime numbers to test
var max = 1024*1024;

//Amount to scale the output by
var scale = 40;

//For the first however many prime numbers
for(var i=0; i<max; i++){

	//Get the distance to the next prime number	
	var next = gen.next().value;
	var dist = (last-next) / scale;

	//Adjust the appropriate coordinate based on direction
	if(dir==0)y += dist;
	else if(dir==1)x += dist;
	else if(dir==2)y -= dist;
	else if(dir==3)x -= dist;

	//Line to this position
	ctx.lineTo(x, y);
	
	//Every 1024 line segments, draw the line (this is much faster than drawing each segment individually, but drawing them all at once
	//causes chrome to crash for very long lines)
	if((i % 1024) == 0){
		ctx.strokeStyle = 'hsl('+Math.round(360*i/max)+', 100%, 50%)';
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x, y);
	}

	//Turn to next direction, and set last prime pos
	dir++;
	if(dir==4)dir=0;
	last = next;
}

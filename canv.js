
class Circle{
	constructor(){
		this.x = Math.random() * window.innerWidth;
		this.y = Math.random() * window.innerHeight;
	}
	draw(){
		c.beginPath();
		c.arc(this.x, this.y, 10, 0, Math.PI * 2);
		c.fill()
		c.stroke();
	}
}

window.addEventListener("mousemove", (event)=>{
	c.clearRect(0,0, window.innerWidth, window.innerHeight);

	for (let i = 0; i < 100; i++)
	{
		let temp = new Circle;
	
		temp.draw();
	}

})

	let canv = document.querySelector("#myCanv");

	canv.width = window.innerWidth;
	canv.height = window.innerHeight;


	let c = canv.getContext('2d');

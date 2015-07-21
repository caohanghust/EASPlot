$(document).ready(function(){
	var data = [['曹航',100],['夏天成',99],['朱林果',80],['王思杰',40],['朱礼源',88],['陈利飞',40]];
	var eas = new EASPlot('pie');
	console.log(eas);
	eas.drawPie(data);
	setInterval(function(){
		data[0][1] += 1;
		eas.drawPie(data);
	},100);	


	var b = new EASPlot('scatter');
	var data1 = [[5,5],[1,4],[6,3],[10,30],[20,30],[16,25],[11,40]];
	var time = 1;
	b.drawScatter(data1);

	$('#scatter').on('mousemove', function(e) {
		var coord = b.translateCoord(e.clientX,e.clientY);
		$('#coord').text(coord.x+','+coord.y);
		event.preventDefault();
		/* Act on the event */
	});

	setInterval(function(){
		var x = ~~(Math.random()*time);
		var y = ~~(Math.random()*time);
		data1.push([x,y]);
		time = time + 2;
		b.drawScatter(data1);
	},100);


	var c = new EASPlot('radar');
	var data2 = [['力量',1],['魔法',2],['防御',3],['智力',4],['敏捷',5]];
 	c.drawRadar(data2);

 	var d = new EASPlot('bar');
 	var data3 = [['曹航',5],['夏天成',4],['朱林果',3],['王思杰',20]];
 	d.drawBar(data3);
 	setInterval(function(){
 		data3[0][1] += 1;
		d.drawBar(data3);
 	},500);
})
/**
 * @Author:      曹航
 * @DateTime:    2015-05-10 19:11:04
 * @E-mail:      caohanghust@gmail.com
 * @Description: esay and smart ploting
 */
function EASPlot(canvasId){

	var color = ['#CC3333','#99CC00','#003399','#FF6600','#009999','#663399','#990066','#FFCCCC','#FFFF00'];
	var canvas = document.getElementById(canvasId);
	var ctx = canvas.getContext('2d');
	// var scatter_temp = 0;//scatter改变坐标轴状态
	//canvas的信息都在这里
	var canvasInfo = (function(){
		return {
			width : canvas.width,
			height : canvas.height,
			top : canvas.offsetTop,
			left : canvas.offsetLeft,
		}
	})();

	this.drawPie = function(data){
		//饼图的信息都在这里
		var pieInfo = (function(){
			var radiu = 1;
			if (canvasInfo.width>canvasInfo.height){
				radiu = 0.35 * canvasInfo.height;
			}
			else
			{
				radiu = 0.35 * canvasInfo.width;
			}
			return {
				radiu : radiu,
				centerx : canvasInfo.width/2,
				centery : canvasInfo.height/2,
			}
		})();

		//画饼图
		(function(){
			ctx.clearRect(0,0,canvasInfo.width,canvasInfo.height);
			var sum = 0;
			var start_angle=[0];
			var proportion = [];
			for (var i = 0; i < data.length; i++) {
				sum += data[i][1];
			};

			ctx.shadowOffsetX = 5;  
            ctx.shadowOffsetY = 5;  
            ctx.shadowBlur = 1;  
            ctx.shadowColor = "rgba(0,0,0,0.2)";  

			for (var i = 0; i < data.length; i++) {
				proportion[i] = data[i][1]/sum;
				start_angle[i+1] = start_angle[i] + 2*proportion[i]*Math.PI; 
				//偏移量
				var offset = getOffset(start_angle[i],start_angle[i+1]);

				ctx.fillStyle = color[i] ;
				ctx.beginPath();
				ctx.moveTo(pieInfo.centerx+offset.x, pieInfo.centery+offset.y);
				ctx.arc( pieInfo.centerx+offset.x , pieInfo.centery+offset.y , pieInfo.radiu, start_angle[i] , start_angle[i+1] - Math.PI/180 * 2 , false );
				ctx.closePath();
				ctx.fill();
				//画线以及标注文字
				var describe = data[i][0] +'('+ ~~(proportion[i].toFixed(2)*100) + '%)';
				drawDescribe(offset.mid,describe);
			};
		})();

		//获取扇形圆点偏移量
		function getOffset(start_angle,end_angle){
			var mid = ( start_angle + end_angle ) / 2;
			return {
				x : Math.cos(mid) * 2,
				y : Math.sin(mid) * 2,
				mid : mid
			}
		}
		//画描述线以及说明文字
		function drawDescribe(mid,describe){

			var start_x = pieInfo.centerx + 3*pieInfo.radiu/4 * Math.cos(mid);
			var start_y = pieInfo.centery + 3*pieInfo.radiu/4 * Math.sin(mid);
			var end_x = pieInfo.centerx + 5*pieInfo.radiu/4 * Math.cos(mid);
			var end_y = pieInfo.centery + 5*pieInfo.radiu/4 * Math.sin(mid);

			ctx.beginPath();
			ctx.strokeStyle = 'rgba(0,0,0,0.2)';
			ctx.lineWidth = 1;
			ctx.moveTo(start_x,start_y);
			ctx.lineTo(end_x,end_y);
			ctx.closePath();
			ctx.stroke();

			ctx.fillStyle = "rgba(0,0,0,0.8)";
			ctx.fillText(describe, end_x, end_y);
		}
	}

	this.drawScatter = function(data){
		var coordInfo = {
			left : 40,
			top : 40,
			width : canvas.width -80,
			height : canvas.height -80,
			max_x : 0,
			max_y : 0,
			interval_x : 0,
			interval_y : 0
		};

		var dataInfo = {};
		
		// if (scatter_temp == 0) {
		//改变坐标轴
	 	
	 	// scatter_temp = 1;
	 	// };
	 	
	 	(function(){
	 		//改变坐标系
	 		changeCoord();
	 		//清除之前的绘图
			ctx.clearRect(-400,-400,canvasInfo.width+400,canvasInfo.height+400);
			//处理数据
			dealData(data);
			//绘制坐标系
			drawBottom();
			//绘制散点
			drawScatter(data);
			//还原坐标系
			restoreCoord()
	 	})();

	 	function dealData(data){
	 		dataInfo.max_x = data[0][0];
			dataInfo.min_x = data[0][0];
			dataInfo.max_y = data[0][1];
			dataInfo.min_y = data[0][1];

			for (var i = data.length - 1; i >= 0; i--) {
				if(data[i][0]>dataInfo.max_x) dataInfo.max_x = data[i][0];
				if(data[i][0]<dataInfo.min_x) dataInfo.min_x = data[i][0];
				if(data[i][1]>dataInfo.max_y) dataInfo.max_y = data[i][1];
				if(data[i][1]<dataInfo.min_y) dataInfo.min_y = data[i][1];
			};
	 	}

	 	//改变坐标轴
	 	function changeCoord(){
	 		ctx.translate(40,canvasInfo.height-40);//将原点移至左下角
			ctx.scale(1,-1);//将坐标系做X轴轴对称，形成直角坐标系
	 	}

	 	//还原坐标系
	 	function restoreCoord(){
	 		ctx.translate(-40,(canvasInfo.height-40));//将原点移至左下角
			ctx.scale(1,-1);//将坐标系做X轴轴对称，形成直角坐标系
	 	}

	 	//绘制坐标系
	 	function drawBottom(){
			//坐标轴
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(coordInfo.width,0);
			ctx.moveTo(0,0);
			ctx.lineTo(0,coordInfo.height);
			ctx.closePath();
			ctx.stroke();
			//网格线
			ctx.beginPath();
			ctx.lineWidth = 0.3;
			//纵线
			for (var i = 50; i < coordInfo.width; i+=50) {
				ctx.moveTo(i,0);
				ctx.lineTo(i,coordInfo.height);
				coordInfo.max_x = i - 50 ;
			};
			//横线
			for (var i = 50; i < coordInfo.height; i+=50) {
				ctx.moveTo(0,i);
				ctx.lineTo(coordInfo.width,i);
				coordInfo.max_y = i -50;
			};
			ctx.closePath();
			ctx.stroke();
			//横向间距
			coordInfo.interval_x = Math.ceil(dataInfo.max_x/(coordInfo.max_x/50));
			coordInfo.interval_y = Math.ceil(dataInfo.max_y/(coordInfo.max_y/50));
			//绘制坐标轴坐标
			ctx.fillStyle = "black";
			ctx.scale(1,-1);//将坐标系做X轴轴对称，恢复正常坐标系
			for (var i = 0; i <= coordInfo.max_x/50; i++) {
				ctx.fillText(i*coordInfo.interval_x, i*50, 20);
			};
			for (var i = 0; i <= coordInfo.max_y/50; i++) {
				ctx.fillText(i*coordInfo.interval_y,-20,-i*50);
			};

			ctx.scale(1,-1);//将坐标系做X轴轴对称，恢复为直角坐标系
	 	}

	 	//绘制散点
	 	function drawScatter(data){
	 		var temp = {};
	 		ctx.fillStyle = "RED";
	 		for (var i = 0; i < data.length; i++) {
	 			temp = translateData(data[i][0],data[i][1]);
	 			ctx.beginPath();
	 			ctx.arc(temp.x,temp.y,3,0,2*Math.PI,true);
	 			ctx.closePath();
	 			ctx.fill();
	 		};
	 	}

	 	//输入数组转换为canvas的坐标
	 	function translateData(x,y){
	 		return {
				x:x/coordInfo.interval_x*50,
				y:y/coordInfo.interval_y*50
			}
	 	}
	 	//canvas的坐标转换为数组坐标(对外开放函数)
	 	this.translateCoord = function(x,y){
	 		return {
	 			x:Math.round((x-canvasInfo.left-coordInfo.left)*coordInfo.interval_x/50),
				y:Math.round(-(y-canvasInfo.top-coordInfo.top-coordInfo.height)*coordInfo.interval_y/50)
	 		}
	 	}
	}

	this.drawRadar = function(data){
		//雷达图的信息都在这里
		var radarInfo = (function(){
			var radiu = 1;
			if (canvasInfo.width>canvasInfo.height) { radiu = 0.35 * canvasInfo.height;}
			else{radiu = 0.35 * canvasInfo.width;};
			var circleNum = ~~(radiu /50);
			return {
				centerx : canvasInfo.width /2,
				centery : canvasInfo.height/2, 
				radiu : radiu,
				circleNum :circleNum
			}
		})();

		var dataInfo = {};

		//开始绘图
		(function(){
			dealData(data);
			drawBottom(data);
			drawRadar(data);
		})();

		function drawRadar(data){
			var point_x = 0;
			var point_y = 0;
			var radiu = 1;
			var angle = 0;
			var centerx = radarInfo.centerx;
			var centery = radarInfo.centery;
			var tempRuler = Math.ceil(dataInfo.max / radarInfo.circleNum);
			ctx.beginPath();

			for (var i = 0; i < data.length; i++) {
				radiu = data[i][1]*50/tempRuler;
				point_x = radiu * Math.cos(angle);
				point_y = radiu * Math.sin(angle);
				if (i==0){ctx.moveTo(centerx+point_x,centery+point_y);}
				else{ctx.lineTo(centerx+point_x,centery+point_y);}
				angle += dataInfo.angle;
			};
			ctx.fillStyle = "rgba(0,0,255,0.6)";
			ctx.fill();
		}

		function drawBottom(data){
			var temp = radarInfo.radiu / radarInfo.circleNum;
			var tempRuler = Math.ceil(dataInfo.max / radarInfo.circleNum);
			var radiu = 1;
			var angle = 0;
			var centerx = radarInfo.centerx;
			var centery = radarInfo.centery;
			var start_x = 0;
			var start_y = 0;
			var end_x = 0;
			var end_y = 0;
			var ruler = 0;

			for (var j = 0; j < 3; j++) {
				radiu = 50 * (j+1) ;
				ctx.strokeStyle = 'rgba(0,0,0,0.2)';
				//画背景线
				for (var i = 0; i < dataInfo.angleNum; i++) {
					start_x = Math.cos(angle) * radiu + centerx;
					start_y = Math.sin(angle) * radiu + centery;
					angle += dataInfo.angle;
					end_x = Math.cos(angle) * radiu + centerx;
					end_y = Math.sin(angle) * radiu + centery;
					ctx.beginPath();
					ctx.moveTo(start_x,start_y);
					ctx.lineTo(end_x,end_y);
					ctx.closePath();
					ctx.stroke();
				};
				//画标尺
				ruler = tempRuler * (j+1);
				ctx.fillText(ruler,centerx+radiu-6,centery);
			};
			//写描述文字
			angle = 0;
			for (var i = 0; i < data.length; i++) {
				var describe = data[i][0];
				var x = (radiu+10) * Math.cos(angle);
				var y = (radiu+10) * Math.sin(angle);
				ctx.fillText(describe,centerx+x,centery+y);
				angle+=dataInfo.angle;
				ctx.beginPath();
				ctx.moveTo(centerx,centery);
				ctx.lineTo(centerx+radiu*Math.cos(angle),centery+radiu*Math.sin(angle));
				ctx.closePath();
				ctx.stroke();
			};
		}

		function dealData(data){
			var angle = 2*Math.PI/data.length;
			var max = 1;
			for (var i = 0; i < data.length; i++) {
				if (data[i][1]>max) {max = data[i][1]};
			};
			dataInfo.max = max;
			dataInfo.angle = angle;
			dataInfo.angleNum = data.length;
		}
	}

	this.drawBar = function(data){
		var barInfo = (function(){
			return {
				left : 40,
				top : 40,
				width : canvas.width -80,
				height : canvas.height -80,
				interval_y : 1,
				max : 1,
				name_num : 1, //横坐标中的name数
			}		
		})();
		var dataInfo = {};

		(function(){
			ctx.clearRect(0,0,canvasInfo.width,canvasInfo.height);
			//改变坐标轴
			changeCoord();
			//处理数据
			dealData(data);
			//绘制坐标系
			drawBottom(data);
			//绘制直方图
			drawBar(data);
			//还原坐标轴
			restoreCoord();
		})();//立即函数

		//改变坐标轴
	 	function changeCoord(){
	 		ctx.translate(40,canvasInfo.height-40);//将原点移至左下角
			ctx.scale(1,-1);//将坐标系做X轴轴对称，形成直角坐标系
	 	}

	 	//还原坐标系
	 	function restoreCoord(){
	 		ctx.translate(-40,canvasInfo.height-40);//将原点移至左上角
			ctx.scale(1,-1);//将坐标系做X轴轴对称，形成直角坐标系
	 	}

		//绘制坐标系
		function drawBottom(){
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(barInfo.width,0);
			ctx.moveTo(0,0);
			ctx.lineTo(0,barInfo.height);
			ctx.closePath();
			ctx.stroke();

			//绘制坐标轴坐标
			
			ctx.scale(1,-1);//将坐标系做X轴轴对称，恢复正常坐标系

			for (var i = 0; i <= barInfo.max/50; i++) {
				ctx.fillText(i*barInfo.interval_y,-20,-i*50);
			};

			ctx.scale(1,-1);//将坐标系做X轴轴对称，恢复为直角坐标系
		}

		function drawBar(data){

			var temp = barInfo.width / barInfo.name_num ;
			var temp_height = 1;

			ctx.strokeStyle = "rgba(0,0,0,0.3)";
			ctx.lineWidth = 2;

			for (var i = 0; i < data.length; i++) {
				ctx.fillStyle = color[i];
				temp_height = ( data[i][1] / barInfo.interval_y ) *50;
				ctx.fillRect(temp*i+temp*0.2,0,temp*0.6,temp_height);
				ctx.strokeRect(temp*i+temp*0.2,0,temp*0.6,temp_height);	
			};

			ctx.scale(1,-1);//将坐标系做X轴轴对称
			//绘制说明文字
			ctx.fillStyle = "rgba(0,0,0,0.8)";
			for (var i = 0; i < data.length; i++) {
				temp_height = ( data[i][1] / barInfo.interval_y ) *50;
				ctx.fillText(data[i][0]+'  '+data[i][1],(temp*i+temp*0.2)+20,-(temp_height+10));
			};	
			ctx.scale(1,-1);//将坐标系做X轴轴对称，恢复正常坐标系
		}

		function dealData(data){
			var max = 1;
			for (var i = 0; i < data.length; i++) {
				if (max < data[i][1]) { max = data[i][1] ;};
			};

			for (var i = 50; i < barInfo.height; i=i+50) {
				barInfo.max = i - 50;
			};

			barInfo.name_num = data.length ;

			dataInfo.max = max;

			barInfo.interval_y =  Math.ceil(max/(barInfo.max/50));

		}
	}
	

}

		
import {getRandomInt} from './CommonUtils.js';


class CoordinatePlane{  
    constructor(ctx){
        console.log('Coordinate Plane Constructed')
        this.ctx = ctx,
        this.xSpan = {
            low: 0,
            high:20
        },
        this.ySpan = {
            low: 0,
            high: 20
        },
        this.yStep = 1,
        this.xStep = 1,
        this.width = (this.ctx.canvas.height-100)*0.9,
        this.height = (this.ctx.canvas.height-100)*0.9,
        this.determiningDimension = this.height,
        this.vertical_line_spacing = this.width/(this.xSpan.high - this.xSpan.low),
        this.horizontal_line_spacing = this.height/(this.ySpan.high - this.ySpan.low),
        this.buffer = 100,
        this.borderWidth = 10,
        this.points = [[getRandomInt(-10,10),getRandomInt(-10,10)]],
        this.targetPoints = [[0,0]]
        this.currentPointIndex = 0,
        this.currentPoint = this.points[0];
        this.correctAnswers = 0;
        this.time = 0;
        this.accuracy = 0;
        this.speed = 0;
        this.message = '';
        this.startTime = 0;
        this.currentTime = 0;
    }

    incrementCurrentPoint(){
        this.currentPointIndex += 1;
        this.currentPoint = this.points[this.currentPointIndex];
    }

    addNewPoint(coords = [0,0]){
        this.points.push(coords);
    }

    drawPoints(){

        let pointsIndex = 0;
        this.points.forEach((point)=>{
            

            if(
                point[0] == this.targetPoints[pointsIndex][0] &&
                point[1] == this.targetPoints[pointsIndex][1]
            ){
                this.ctx.fillStyle = 'rgb(0,255,0,0.5)';
            }else{
                this.ctx.fillStyle = 'rgb(255,0,255,0.5)';
            }
            
            let posX = this.buffer+this.width/2 + point[0]*this.horizontal_line_spacing;
            let posY = this.buffer+this.height/2 - point[1]*this.vertical_line_spacing;
            this.ctx.beginPath();
            this.ctx.ellipse(posX, posY, this.borderWidth, this.borderWidth,0,Math.PI*2,0);
            this.ctx.fill();
            pointsIndex +=1;
        })

        
        
        let array1 = this.points[pointsIndex-2] || [];
        let array2 = this.targetPoints[pointsIndex-2] || [];
        let sameValues = array1.length === array2.length && array1.every((value, index) => value === array2[index]);

        if ( ! sameValues){
            this.ctx.fillStyle = 'rgb(255,0,255)';
            this.ctx.fillText('Your Ans: ' + "(" + this.points[pointsIndex-2] + ")", this.buffer, this.buffer - this.borderWidth - 50);
            this.ctx.fillStyle = 'rgb(0,255,255)';
            this.ctx.fillText('Ans: ' + "(" +  this.targetPoints[pointsIndex-2] + ")", this.buffer + 70, this.buffer - this.borderWidth - 20);
        }
        this.ctx.fillStyle = 'cyan';
        let posX = this.buffer+this.width/2 + this.currentPoint[0]*this.horizontal_line_spacing;
        let posY = this.buffer+this.height/2 - this.currentPoint[1]*this.vertical_line_spacing;
        this.ctx.beginPath();
        this.ctx.ellipse(posX, posY, this.borderWidth, this.borderWidth,0,Math.PI*2,0);
        this.ctx.fill();

    }

    movePointX_right(point, unitsMoved = 1){
        point[0] += unitsMoved;
    }

    movePointX_left(point, unitsMoved = 1 ){
        point[0] -= unitsMoved;
    }

    movePointY_up(point, unitsMoved = 1){
        point[1] += unitsMoved;
    }

    movePointY_down(point, unitsMoved = 1){
        point[1] -= unitsMoved;
    }

    createTargetPoint(num_of_points){
        
        
        for(let i = 0; i < num_of_points; i++){
            let x = getRandomInt(-10,10);
            let y = getRandomInt(-10,10)
            let newPoint = [x,y];
            this.targetPoints.forEach((target)=>{
                if(newPoint == target){
                    this.createTargetPoint(1);
                }
            })
            this.targetPoints.push([x,y]);

        }

    }

    displayTargetPoint(){
        if (this.currentPointIndex >= 0){
        let currentTarget = this.targetPoints[this.currentPointIndex];
        let currentTargetString = "(" + currentTarget[0].toString() + ", " + currentTarget[1].toString() + ")"
        ;
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(currentTargetString, this.buffer + this.width/1.1 - 8,this.buffer-30);


        }
    }

    displayCorrectAnswers(){
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(this.correctAnswers.toString(), this.buffer + this.width/2 - 8,this.buffer-30);
    }

    displayProgress(){
        this.accuracy = 4*this.correctAnswers/10;
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '30px Arial';
        const accuracyLevels = [
            'yougnling',
            'padawan',
            'Jedi Knight',
            'Jedi Master'
        ]
        const accuracyMessages = [
            'Do or do not. This is no try - Yoda ',
            'Your focus determines your reality – Qui-Gon Jinn',
            'Who’s more foolish? The fool or the fool who follows him? - Obi-Wan',
            'Always pass on what you have learned - Yoda'

        ]

        // Accuracy
        this.ctx.fillText('Accuracy', this.buffer*3 + this.width + 8,this.buffer-30);
        //this.ctx.fillText(this.accuracy.toString(), this.buffer + this.width + 8,this.buffer-30);
        // message
        this.ctx.font = '18px Arial';
        this.ctx.fillText(accuracyMessages[0], this.buffer*2 + this.width + 8,this.buffer+30, this.buffer*6);

        // Accuracy Meter
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = '#666';
        this.ctx.beginPath();
        this.ctx.moveTo(this.buffer*4 + this.width, this.buffer+this.height);
        this.ctx.lineTo(this.buffer*4 + this.width, this.buffer*1.5);
        this.ctx.stroke();

        const speedLevels = [
            'Sith Hopeful',
            'Sith Adept',
            'Sith Knight',
            'Sith Lord',
            'Dark Lord'
        ]

        const speedMessages = [
            'Once you start down the dark path, forever will it dominate your destiny - Yoda',
            'Did you ever hear the tragedy of Darth Plagueis the Wise? - Palpatine',
            'He has grown strong, only together can we turn him to the dark side - The Emperor',
            'You’re Fulfilling Your Destiny... Learn To Use The Dark Side Of The Force. - Darth Sidious',
            'When I left you, I was but the learner. Now I am the master. - Darth Vader'
        ]

        // Speed
        this.ctx.font = '30px Arial';
        this.ctx.fillText('Speed', this.buffer*6 + this.width + 8,this.buffer-30);
        this.ctx.font = '18px Arial';
        this.ctx.fillText(speedMessages[0], this.buffer*2 + this.width + 8,this.buffer+this.height+30, this.buffer*6);

    }



    checkAnswer(){
        let soughtPoint = this.targetPoints[this.currentPointIndex-1];
        let answerPoint = this.points[this.currentPointIndex-1];

        if(
            soughtPoint[0] == answerPoint[0] &&
            soughtPoint[1] == answerPoint[1] 
        ){
            this.correctAnswers += 1
        }else{
            //console.log('incorrect')
            this.correctAnswers = 0;
        }
    }


    // checkMastery(){
    //     switch(this.correctAnswers){
    //         case 1:

    //     }
    //     if(this.correctAnswers >= 8){
    //         console.log('comprehension mastery')
    //     }
    // }

    drawRankingPanel(){

        //important coordinates
        const rect_tl = [this.buffer*4+this.width, this.buffer+this.borderWidth/2];
        const rect_tr = [this.buffer*4+this.width*1.5, this.buffer+this.borderWidth/2];
        const rect_bl = [this.buffer*4+this.width, this.buffer+this.height/2 + this.borderWidth/2];
        const rect_br = [this.buffer*4+this.width*1.5, this.buffer+this.height/2 + this.borderWidth/2];

        

         // drawOutline
        this.ctx.strokeStyle = "#ccc";
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.strokeRect(rect_tl[0],rect_tl[1], this.width/2, this.height/2);

        

        //vertical lines
        this.ctx.lineWidth = this.borderWidth/4;
        this.ctx.strokeStyle = 'rgba(200,200,200, 0.4)';
        for(let i = 0; i < 10; i = i+=1){
            let x_coordinate = rect_tl[0] + this.vertical_line_spacing*i
            let y_top = rect_tl[1];
            let y_bottom = rect_bl[1];
            this.ctx.beginPath();
            this.ctx.moveTo(x_coordinate, y_top);
            this.ctx.lineTo(x_coordinate, y_bottom);
            this.ctx.stroke();
        }

        //horizontal lines
        for(let i = 0; i < 10; i += 1){
            let x_coordinate_left = rect_tl[0];
            let x_coordinate_right = rect_tr[0];
            let y_coordinate = rect_tr[1] + this.horizontal_line_spacing*i; // = this.buffer + this.vertical_line_spacing*i;
            this.ctx.beginPath();
            this.ctx.moveTo(x_coordinate_left, y_coordinate);
            this.ctx.lineTo(x_coordinate_right, y_coordinate);
            this.ctx.stroke();
        }

        // draw speedBar
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(rect_bl[0] + this.borderWidth/2,rect_bl[1]);
        this.ctx.lineTo(rect_br[0] + this.borderWidth/2,rect_br[1]);
        this.ctx.stroke();

        // draw accuaracy bar
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(rect_bl[0],rect_bl[1] - this.borderWidth/2);
        this.ctx.lineTo(rect_tl[0], rect_tl[1] - this.borderWidth/2);
        this.ctx.stroke();

        // //vertical_axis

        // draw vertical lines

        // //draw gradient red, speed (horizontal)
        // var grd1 = this.ctx.createLinearGradient(this.buffer*4+this.width,this.buffer+this.height/4,this.buffer*4+this.width*1.5,this.height/4);
        // grd1.addColorStop(0, "rgba(255,0,0,0)");
        // grd1.addColorStop(1, "rgba(255,0,0,1)");

        // //draw gradient cyan, accuracy (vertical)
        // var grd2 = this.ctx.createLinearGradient(this.buffer*4+this.width/2,this.width/2,this.buffer*4+this.width/2,0)
        // grd2.addColorStop(0, "rgba(0,255,255,0)");
        // grd2.addColorStop(1, "rgba(0,255,255,1)");

        //  //draw gradient purple, both
        //  var grd3 = this.ctx.createLinearGradient(this.buffer*4,this.width/2 + this.buffer,this.buffer*4+this.width/2,this.buffer)
        //  grd3.addColorStop(0, "rgba(255,0,255,0)");
        //  grd3.addColorStop(1, "rgba(255,0,255,0.3)");

        // //
        // this.ctx.fillStyle = 'white';
        // this.ctx.fillRect(this.buffer*4+this.width, this.buffer, this.width/2, this.height/2);

        // // Fill with gradient
        // this.ctx.fillStyle = grd1;
        // this.ctx.fillRect(this.buffer*4+this.width, this.buffer, this.width/2, this.height/2);
        // this.ctx.fillStyle = grd2;
        // this.ctx.fillRect(this.buffer*4+this.width, this.buffer, this.width/2, this.height/2)
        // this.ctx.fillStyle = grd3;
        // this.ctx.fillRect(this.buffer*4+this.width, this.buffer, this.width/2, this.height/2)

        // // drawOutline
        // this.ctx.strokeStyle = '#ccc';
        // this.ctx.lineWidth = this.borderWidth;
        // this.ctx.strokeRect(this.buffer*4 + this.width,this.buffer,this.determiningDimension/2, this.determiningDimension/2);
        // // draw vertical lines (y)
        
        // this.ctx.lineWidth = this.borderWidth/4;
        // this.ctx.strokeStyle = 'rgba(200,200,200, 0.4)';
        // for(let i = 0; i < 10; i = i+ 2.5){
        //     let x_coordinate = this.buffer*4 +this.width + this.vertical_line_spacing*i
        //     let y_top = this.buffer + this.borderWidth/2;
        //     let y_bottom = this.buffer + this.height/2 - this.borderWidth/2;
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(x_coordinate, y_top);
        //     this.ctx.lineTo(x_coordinate, y_bottom);
        //     this.ctx.stroke();
        // }

        // //vertical_axis

        // // draw horizontal lines 

        // for(let i = 0; i < 10; i += 2.5){
        //     let x_coordinate_left = this.buffer*4 +this.width
        //     let x_coordinate_right = this.buffer*4 +this.width*1.5
        //     let y_coordinate = this.buffer + this.horizontal_line_spacing*i; // = this.buffer + this.vertical_line_spacing*i;
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(x_coordinate_left, y_coordinate);
        //     this.ctx.lineTo(x_coordinate_right, y_coordinate);
        //     this.ctx.stroke();
        // }


    }



    drawPlane(){

        // drawOutline
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.strokeRect(this.buffer,this.buffer,this.determiningDimension, this.determiningDimension);

        // draw Y-axis
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        let middle_vert = this.buffer+this.width/2;
        this.ctx.moveTo(middle_vert, this.buffer);
        this.ctx.lineTo(middle_vert, this.buffer + this.height);
        this.ctx.stroke();

        //draw X-axis
        this.ctx.beginPath();
        let middle_horiz = this.buffer + this.height/2;
        this.ctx.moveTo(this.buffer, middle_horiz);
        this.ctx.lineTo(this.buffer+this.width, middle_horiz);
        this.ctx.stroke();
        
        // draw vertical lines (y)
        
        this.ctx.lineWidth = this.borderWidth/4;
        this.ctx.strokeStyle = 'rgba(200,200,200, 0.4)';
        for(let i = 0; i < this.xSpan.high - this.xSpan.low; i++){
            let x_coordinate = this.buffer + this.vertical_line_spacing*i
            let y_top = this.buffer + this.borderWidth/2;
            let y_bottom = this.buffer + this.height - this.borderWidth/2;
            this.ctx.beginPath();
            this.ctx.moveTo(x_coordinate, y_top);
            this.ctx.lineTo(x_coordinate, y_bottom);
            this.ctx.stroke();
        }

        // draw horizontal lines 

        for(let i = 0; i < this.ySpan.high - this.ySpan.low; i++){
            let x_coordinate_left = this.buffer+this.borderWidth/2
            let x_coordinate_right = this.buffer + this.width - this.borderWidth/2;
            let y_coordinate = this.buffer + this.horizontal_line_spacing*i; // = this.buffer + this.vertical_line_spacing*i;
            this.ctx.beginPath();
            this.ctx.moveTo(x_coordinate_left, y_coordinate);
            this.ctx.lineTo(x_coordinate_right, y_coordinate);
            this.ctx.stroke();
        }
        
       // let x_spacing = 
    }


}



class Line{
    constuctor(){

    }
}
export{CoordinatePlane}
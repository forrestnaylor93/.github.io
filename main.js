import {getCanvasCtx, resizeCanvasToDisplaySize} from './modules/initCanvasCtx.js';
import {CoordinatePlane} from './modules/CoordinatePlane.js'

const [canvas1, ctx1] = getCanvasCtx('canvas1');


resizeCanvasToDisplaySize(canvas1);

window.addEventListener('keydown', (event)=>{
    let unitsMoved = 1;
    if((currentTime - startTime) > 5000){
    }
    if(event.altKey){
        unitsMoved = 0.5;
    }
    if(event.ctrlKey){
        unitsMoved = 0.25;
    }
    if(event.keyCode == 37){
        coordinatePlane.movePointX_left(coordinatePlane.currentPoint, unitsMoved);
    }
    if(event.keyCode == 39){
        coordinatePlane.movePointX_right(coordinatePlane.currentPoint, unitsMoved);
    }
    if(event.keyCode == 38){
        coordinatePlane.movePointY_up(coordinatePlane.currentPoint, unitsMoved);
    }
    if(event.keyCode == 40){
        coordinatePlane.movePointY_down(coordinatePlane.currentPoint, unitsMoved);
    }
    if(event.keyCode == 13){
        coordinatePlane.createTargetPoint(1);
        coordinatePlane.addNewPoint();
        coordinatePlane.incrementCurrentPoint();
        coordinatePlane.checkAnswer();

        
        //current goal point
        // console.log('soughtpoint ' + coordinatePlane.targetPoints[coordinatePlane.currentPointIndex-1]);
        // //current point

        // console.log('answeredpoint ' + coordinatePlane.points[coordinatePlane.currentPointIndex-1]);
        // console.log(coordinatePlane.targetPoints[coordinatePlane.currentPointIndex-1][0] == coordinatePlane.points[coordinatePlane.currentPointIndex-1][0]);
        // console.log(coordinatePlane.targetPoints[coordinatePlane.currentPointIndex-1][1] == coordinatePlane.points[coordinatePlane.currentPointIndex-1][1]);


    }
})

const coordinatePlane = new CoordinatePlane(ctx1);

const starwars_rank = new CoordinatePlane(ctx1);

const startTime = new Date();

let currentTime = new Date();


function loop(){
    ctx1.clearRect(0,0,canvas1.width, canvas1.height); // clear canvas;
    
    
    coordinatePlane.drawPlane();
    coordinatePlane.drawPoints();
    coordinatePlane.displayTargetPoint();
    coordinatePlane.displayCorrectAnswers();
    //coordinatePlane.displayProgress();

    //starwars_rank.drawRankingPanel();
    //currentTime = new Date();

    requestAnimationFrame(loop)
}

loop();
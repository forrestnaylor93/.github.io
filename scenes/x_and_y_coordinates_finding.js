import {Assesment, Scene, Instructions} from '../Assesment.js';
import {CoordinatePlane} from '../modules/CoordinatePlane.js';

const get_x_and_y_coordinates_finding = (ctx)=>{

    let x_and_y_coordinates_finding = new Scene(ctx);
    x_and_y_coordinates_finding.end_condition = false;
    let magoo = (e)=>{
        if(e.code == 'Space'){
            x_and_y_coordinates_finding.end_condition = true;
        }
    }

    x_and_y_coordinates_finding.canvas.addEventListener('keydown', magoo);
    
    
    
    // = (e)=>{
    //         if(e.code == 'Space'){
    //            // console.log('end condtion', x_and_y_coordinates_finding.end_condition);
    //            // x_and_y_coordinates_finding.end_condition = true;
    //         }

    //x_and_y_coordinates_finding.canvas.addEventListener('keydown', space_ending)
    // opening.end_condition = false;
   

    // const space_ending = (e)=>{
    //     if(e.code == 'Space'){
    //         console.log('end condtion', opening.end_condition);
    //         opening.end_condition = true;
    //     }
    x_and_y_coordinates_finding.content = () => {
    
        //
        let end_condition = false;
        let plane = new CoordinatePlane(ctx, 100, 150, canvas1.width - 100, canvas1.height - 100);
        let score = 0;
        plane.draw();


        let canvas = ctx.canvas;
        // create 5 points to move around
        

        let get_random_coords = ()=>{
            let coords = {
                x: Math.round(2*(plane.m.x.min_unit + 1 + Math.random()*(plane.m.x.total_units-2)))/2,
                y: Math.round(2*(plane.m.y.min_unit + 1 + Math.random()*(plane.m.y.whole_units-2)))/2
            }

            return coords;
        }

        let starting_coords = get_random_coords();
        let point_index = 0;

        let targetPoints = [{x:0, y:0}] // always move to origin first
        // create four more target points
        for (let i = 0; i < 4; i++){
            let coords = get_random_coords();
            targetPoints.push(coords);
        }

        plane.make_point(starting_coords.x,starting_coords.y);
    

        // handle moving arrow keys
        let move_point_down = (point)=>{
            point.y -= 0.5;
        }
        let move_point_up = (point)=>{
            point.y += 0.5;
        }
        let move_point_right = (point)=>{
            point.x += 0.5;
        }
        let move_point_left = (point)=>{
            point.x -= 0.5;
        }

        let check_score = ()=>{
            if(score == 5){return};
            if(
                plane.points[point_index].x == targetPoints[point_index].x &&
                plane.points[point_index].y == targetPoints[point_index].y 
            ){
                score += 1
            }else{
                starting_coords = get_random_coords();
                score = 0;
                point_index = -1;
                plane.points = [];
                plane.make_point(starting_coords.x, starting_coords.y)
                let targetPoints = [{x:0, y:0}] // always move to origin first
                 // create four more target points
                for (let i = 0; i < 4; i++){
                let coords = get_random_coords();
                targetPoints.push(coords);
                }

            }
        }
        

        let get_new_point = ()=>{
            //console.log('get new point')
            //let xPos = Math.round(plane.m.x.min_unit + 1 + Math.random()*(plane.m.x.total_units-2));
            //let yPos = Math.round(plane.m.y.min_unit + 1 + Math.random()*(plane.m.y.whole_units-2));




            plane.make_point(0, 0)

        }
        let movement_handler = (e)=>{
            //console.log(e.code);

            switch(e.code){
                case 'ArrowDown':
                    move_point_down(plane.points[point_index]);
                break;
                case'ArrowUp':
                    move_point_up(plane.points[point_index]);
                break;
                case'ArrowLeft':
                    move_point_left(plane.points[point_index]);
                break;
                case'ArrowRight':
                    move_point_right(plane.points[point_index]);
                break;
                case 'Enter':
                    get_new_point(0,0);
                    check_score();
                    if(score == 5){end_condition = true;}
                    point_index += 1;
                    
                break;
                default:
            }
            
            
            
        }

        canvas.addEventListener('keydown', movement_handler)

        let loop = ()=>{

            if(end_condition){
                plane.remove_all_listeners();
                canvas.removeEventListener('keydown', movement_handler);
                window.alert('nice!, press space to move on');
                x_and_y_coordinates_finding.end_condition = true;
                // move on to next thing
                
                
            }else{
                ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            x_and_y_coordinates_finding.display_as_text('Finding X & Y Coordinates', 100, canvas.width - 500);
            plane.draw();
            // display score
            x_and_y_coordinates_finding.display_as_text("Score: " + score.toString(), 100, 100);
            // display soought point
            if(point_index < targetPoints.length){
                x_and_y_coordinates_finding.display_as_headline("(" + targetPoints[point_index].x.toString() + ", " + targetPoints[point_index].y.toString() + ")", canvas.width/2 - 100, canvas.height - 50);
            }

            if(x_and_y_coordinates_finding.instructions_visible){
                x_and_y_coordinates_finding.display_instructions();
            }
            
            
            if(!x_and_y_coordinates_finding.end_condition){requestAnimationFrame(loop);}

            }
            
            
        }

        loop();
    }
    x_and_y_coordinates_finding.instructions = new Instructions(
        [
            'Your task is to move the blue point to the correct cooridnates.',
            'Use your arrow keys to move around',
            'The correct Coordinates are at the top of the Screen (X, Y)',
            'You must get 5 in a row without any mistakes to start the next section',
            'Try as many times as you need! There is no penalty.',
        ],
        'Finding X & Y Coordinates'
        )

    return x_and_y_coordinates_finding;
}


export{get_x_and_y_coordinates_finding};
import {Assesment2, Scene, Instructions} from '../Assesment2.js';
import {CoordinatePlane} from '../modules/CoordinatePlane.js';
import {runInput} from '../modules/InputBox.js';

const build_scene = (ctx) =>{
    // create scene object
    const scene = new Scene(ctx);

    // create instructions
    scene.instructions = new Instructions('Visual Slope', [' Cound the lines visually to determine the slope', ' Find Δy - the change in y', ' Find Δx - the change in x', 'Then click outside the boxes', 'Finally press enter', 'Must complete 4'] );
    
    scene.handle_instructions(); // handle instructions
    scene.end_contion = false; // set end condition to false initially


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///// Contents /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // contents of scene
    scene.contents = ()=>{
        // add interactive input boxes
        runInput();
        scene.score = 0;

        //create plane
        let height = ctx.canvas.height - 100;
        let x_margin = 3*(ctx.canvas.width - height)/4;
        let width = height;
        const plane = new CoordinatePlane(ctx, x_margin, 100, x_margin + width, 100 + height);

        //functions
        const shuffle = (array)=>{
            var currentIndex = array.length, temporaryValue, randomIndex;
          
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
          
              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
          
              // And swap it with the current element.
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }
          
            return array;
          }

        
        const make_lines_from_slopes = (slopes, plane)=>{
            slopes.forEach((slope)=>{
                plane.create_slope_line(slope.m);
            })

            let lines = [...plane.lines]
            plane.lines = [];
            return lines;
        }

        const create_slopes = ()=>{
            let slopes = []
            // positive
            for(let i = 0; i<3; i++){
                let dy = Math.floor(Math.random()*8);
                let dx = 1+Math.floor(Math.random()*8);

                let m = dy/dx

                let slope = {
                    dy: dy,
                    dx, dx,
                    m: m
                }

                slopes.push(slope);

             
            }  

            // negative
            for(let i = 0; i<3; i++){
                let dy = -1*Math.floor(Math.random()*8);
                let dx = 1+Math.floor(Math.random()*8);

                let m = dy/dx

                let slope = {
                    dy: dy,
                    dx, dx,
                    m: m
                }

                slopes.push(slope);

             
            }  

            slopes = [...shuffle(slopes)];
            return slopes
        }

        const display_fraction_bar = (plane, inputX, inputY)=>{
            let ctx = scene.ctx;
            let canvas = scene.ctx.canvas;

            let x = plane.x - 270
            let y = plane.y + plane.height/2
            let x1 = plane.x - 150
            let y1 = y

            let m = 0

            m = Math.round(1000*inputY._value/inputX._value)/1000;

            //make things
            
            ctx.fillStyle = '#ccc',
            ctx.strokeStyle = "#ccc";
            
            // make line
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x1,y1);
            ctx.stroke();

            // make m =
            scene.font = '60px Arial'
            scene.display_text_lines(['m = '], plane.x-400, y + 20);

            // make other m = 
            let m_string = ''
            scene.font = '60px Arial'
            if (m == Infinity || m.toString() == 'NaN'){
                m_string = 'undefined'
            }else{
                m_string = m.toString()
            }
            //console.log(m);
            scene.display_text_lines(['m = ' + m_string], plane.x-400, y + 320);


        }

        const handle_click = (e)=>{
            let x = e.clientX;
            let y = e.clientY;
    
            if(
                x > plane.x &&
                x < plane.x1 &&
                y > plane.y &&
                y < plane.y1
            ){
                plane.points = [];
                plane.make_point_at_cursor_rounded_to_whole_unit();
                let myPoint = plane.points[0];
                scene.other_assets[0]=myPoint;
            }
      
        }

        const check_answer = ()=>{
            if(!scene.ready_to_answer){return}
            let answer_point = scene.other_assets[0];
           // console.log(answer_point);
            let is_missing_point = false;
            if(!answer_point){
                is_missing_point = true;
                scene.other_assets[1] = is_missing_point;
            }else{
                is_missing_point = false;

                scene.other_assets[1] = is_missing_point;
            }

            //console.log('answer', answer_point.y/answer_point.x)
            //console.log('actual', scene.slope);
            if(answer_point.y/answer_point.x ==  scene.slope){
               // console.log('correct!')
                scene.score += 1;
                if(scene.score >= 4){
                    scene.end_condition = true;
                    inputX.destroy();
                    inputY.destroy();
                }

                // get new point 
                plane.points = [];
                plane.lines = [];
                let slopes = create_slopes();
                let lines = make_lines_from_slopes(slopes, plane);
                plane.lines.push(lines[0]);
                //console.log(lines)
            
                // initial line
                let first_line = lines.shift();
                plane.lines.push(first_line);
            }else{
               // console.log('incorrect!');
            }
           // console.log(scene.other_assets);
        }

        const check_point_on_line = (point, line) =>{
            
            let slope = (line.y-line.y1)/(line.x-line.x1);
            let point_slope = point.y/point.x;

            if(point_slope == slope){
                //nothing
            }else{
                scene.display_text_lines(['that point is not on the line'], 50, 200);
            }

            
            
        }

        const handle_enter = (e)=>{
            check_answer();
        }


          

  




        
    
         // determine what should allow an end condition to be satisfied
    const satisfy_end_condition = (e)=>{
        if(e.code == 'Space'){
            scene.end_condition = true;
           // console.log('end condition satisfied', scene.end_condition);
        }
    }


    // event listeners
    const handle_end_condition = scene.canvas.addEventListener('keydown', satisfy_end_condition);
    scene.canvas.addEventListener('mousedown', handle_click);
    scene.canvas.addEventListener('keydown', handle_enter)

 
    
    // get rid of event listeners (at end)
    const remove_all_event_listeners = ()=>{
        scene.canvas.removeEventListener('keydown', satisfy_end_condition);
    }

    // create stuff
    var inputX = new CanvasInput({
        canvas: document.getElementById('canvas1'),
        fontSize: 40,
        y: plane.y+plane.height/2 + 20,
        x: plane.x - 270,
        fontFamily: 'Arial',
        fontColor: 'cyan',
        backgroundColor: '#333',
        fontWeight: 'bold',
        width: 90,
        padding: 10,
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 3,
        boxShadow: '1px 1px 0px #fff',
        innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
        placeHolder: '   Δx',
        placeHolderColor: 'cyan',
        onsubmit: check_answer()
      });

      inputX._value == null;

    var inputY = new CanvasInput({
        canvas: document.getElementById('canvas1'),
        fontSize: 40,
        y: plane.y+plane.height/2 - 90,
        x: plane.x - 270,
        fontFamily: 'Arial',
        fontColor: 'fuchsia',
        backgroundColor: '#333',
        fontWeight: 'bold',
        width: 90,
        padding: 10,
        placeHolderColor: 'fuchsia',
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 3,
        boxShadow: '1px 1px 0px #fff',
        innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
        placeHolder: '  Δy',
        onsubmit: check_answer()
      });

    let slopes = create_slopes();
    let lines = make_lines_from_slopes(slopes, plane);
    //console.log(lines)

    // initial line
    let first_line = lines.shift();
    plane.lines.push(first_line);
    

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///// LOOOOPP //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let loop = ()=>{

            if(!scene.end_condition){ // does not redo loop if end condition is satisfied;
            //console.log('animation running');

            scene.clear_canvas(); // clears canvas

            scene.display_title('Visual Slope'); // display title if desired

            //display text if wanted
            //scene.display_text_lines(['Topics:', 'Find X & Y Coordinates', 'Label X & Y Coordinates', 'Slope Intuition - (Positive, Negative, Big, Small, Vertical, Horizontal)', 'Measuring Slope Visually', 'Measuring Slope with Formula', '', 'press i to continue'])
            plane.draw();
            

            //display inputs
            inputX.render();
            inputY.render();

            //display fraction bar for dy/dx
            display_fraction_bar(plane, inputX, inputY);

            // display score
            scene.font = '30px Arial';
            scene.display_text_lines(['Score: ' + scene.score], plane.x - 300, plane.y)

            // if is_missing_point -> scene.other_assets[1]
            let point = scene.other_assets[0];

            let slopeM = inputY._value/inputX._value;
            scene.slope = slopeM;
            //console.log(scene.slope);
            
            if(!point){
                //console.log('missing point')
                scene.font = "20px Arial";
                scene.display_text_lines(['You need to select a point on the line.'], 50, 200);
                scene.font = "30px Arial";
            }else{
                check_point_on_line(point, plane.lines[0], slopeM);
            }

            let ready_to_answer = false;

            // if missing dy or dx
            let real_m = inputY._value/inputX._value;
            //console.log(real_m)
            if (real_m.toString() == 'NaN'){
                scene.font = '20px Arial'
                scene.display_text_lines(['not a valid answer for slope'], 50, 300);
                scene.font = '30px Arial'
                scene.ready_to_answer = false;
            }else{
                if(point){
                    scene.ready_to_answer = true;
                }else{
                    scene.ready_to_answer = false;
                }
            }

            //console.log(scene.ready_to_answer);


           // console.log('ready to answer', ready_to_answer)


            // displays instructions if i is pressed
            if(scene.instructions_visible){scene.display_instructions();}
 
           requestAnimationFrame(loop); // start loop again
            }else{ // otherwise break the loop
                cancelAnimationFrame(loop);
                scene.clear_canvas();
                scene.display_text_lines(['press space to continue'])
                remove_all_event_listeners();
            }
           
        }

        loop();// run loop   
    }

    return scene; // return scene object because this function returns an object 

}





export{build_scene};



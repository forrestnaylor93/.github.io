import {Assesment2, Scene, Instructions} from '../Assesment2.js';
import {CoordinatePlane} from '../modules/CoordinatePlane.js';
import {Button} from '../modules/Button.js';


const build_scene = (ctx) =>{
    // create scene object
    const scene = new Scene(ctx);

    // create instructions
    scene.instructions = new Instructions('Slope Magnitude', ['Click the corresponding button to say wheter the slope is:', 'exactly equal to one', 'bigger than 1', 'smaller than 1']);
    
    scene.handle_instructions(); // handle instructions
    scene.end_contion = false; // set end condition to false initially


   

    // contents of scene
    scene.contents = ()=>{

        scene.ctx.canvas.addEventListener


        let height = ctx.canvas.height - 400;
        let x_margin = (ctx.canvas.width - height)/2;
        let width = height;
        const plane = new CoordinatePlane(ctx, x_margin, 100, x_margin + width, 100 + height);
        plane.remove_all_listeners();

        let display_mistake = false;

        let slopes = []
        let lines = []

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


        const create_9_random_slopes = ()=>{

            // five lines bigger than 1.5
            for(let i = 0; i < 4; i++){
                let slope = Math.random()*20 - 10;
                if(slope > 0 && slope < 2){
                    slope += 1;
                }
                if(slope < 0 && slope > -2){
                    slope -=1;
                }
                slopes.push(slope);
            }

            // four lines smallar than 0.6
            for(let j = 0; j < 4; j ++){
                let slope = Math.random()*2 -1;
                if(slope > 0.5){
                    slope -= 0.2;
                }
                if(slope < -0.5){
                    slope += 0.2;
                }
                slopes.push(slope);
            }

            // always lines
            slopes.push(0);
            slopes.push(1);
            slopes.push(-1);
            slopes.push(9999999);

            slopes = [...shuffle(slopes)];
        



            slopes.forEach((slope)=>{
                //create a line
                plane.create_slope_line(slope);
                
            })

            scene.buttons = [];

            lines = [...plane.lines];
            plane.lines = []; // empty plane lines

            

            const check_if_correct = ()=>{
                // display mistake
                let answerButton = null;
                scene.buttons.forEach((button)=>{
                    if(button.is_mouse_on){
                        answerButton = button;
                    }
                })

                //console.log(answerButton.label)

                //let ydiff = 
                let slope = (plane.lines[0].y - plane.lines[0].y1)/(plane.lines[0].x - plane.lines[0].x1)

                let magnitude = null;
                let sign = null

                // determine magnitude
                switch(true){
                    case (Math.abs(slope) > 1 && Math.abs(slope) < 1000):
                      //  console.log('big');
                        magnitude = 'big'
                    break;
                    case (Math.abs(slope) == 1):
                      //  console.log('medium')
                        magnitude = 'medium'
                    break;
                    case (Math.abs(slope) < 1 && Math.abs(slope) > 0):
                      //  console.log('small')
                        magnitude = 'small'
                    break;
                    case (Math.abs(slope) == 0):
                       // console.log('zero');
                        magnitude = 'zero'
                    break;
                    case (Math.abs(slope) > 1000):
                     //   console.log('undefined');
                        magnitude = 'undefined';
                    break;
                    default:
                }

                // determine sign
                switch(true){
                    case (slope > 0 && slope < 1000):
                       // console.log('positive')
                        sign = 'positive'
                    break;
                    case (slope < 0):
                      //  console.log('negative');
                        sign = 'negative'
                    break;
                    case (slope == 0):
                       ///console.log('no sign');
                        sign = 'none'
                    break;
                    case (slope > 1000):
                        sign = 'undefined'
                    break;
                    default:
                        //console.log('undefined sign')
                        sign = 'undefined'
                }

                let correct_answer = {magnitude: magnitude, sign: sign};
                console.log(correct_answer.magnitude, correct_answer.sign);

                let student_answer = null
                
                switch(answerButton.label){
                    case "big > 1":
                        student_answer = {magnitude:'big' , sign: 'positive'};
                    break;
                    case "medium = 1":
                        student_answer = {magnitude:'medium', sign: 'positive'};
                    break;
                    case "small < 1":
                        student_answer = {magnitude:'small', sign: 'positive'};
                    break;
                    case "big < -1":
                        student_answer = {magnitude:'big', sign: 'negative'};
                    break;
                    case "medium = -1":
                        student_answer = {magnitude:'medium', sign: 'negative'};
                    break;
                    case "small > -1":
                        student_answer = {magnitude:'small', sign: 'negative'};
                    break;
                    case " 0 ":
                        student_answer = {magnitude:'zero', sign: 'none'};
                    break;
                    case "Undefined":
                        student_answer = {magnitude:'undefined', sign: 'undefined'};
                    break;
                    default:

                }

                let is_student_correct = false;
                if(
                    student_answer.magnitude == correct_answer.magnitude &&
                    student_answer.sign == correct_answer.sign
                    ){
                    //console.log('is correct')
                    is_student_correct = true;
                }else{
                    //console.log('is incorrect')
                }

                let checked_answer = {
                    correct_answer: correct_answer,
                    student_answer: student_answer,
                    is_student_correct: is_student_correct
                }

                return checked_answer;

                //console.log("student answer", student_answer);

                //console.log(answerButton)

                // redo
                
            }

            scene.score = 0;
            

            const review_answer = (checked_answer)=>{
                scene.score = 0;
                scene.review_on = true;
                let review_response = {magnitude: '', sign: ''};
                if(checked_answer.student_answer.magnitude == checked_answer.correct_answer.magnitude){
                    review_response.magnitude = ['The magnitude is correct, it is: ' + checked_answer.correct_answer.magnitude] 
                }else{
                    review_response.magnitude = ['Hmmm the magnitude is not correct, it is not '+ checked_answer.student_answer.magnitude, ' try something else. ']
                }

                if(checked_answer.student_answer.sign == checked_answer.correct_answer.sign){
                    review_response.sign = ['The sign is correct, it is: ' + checked_answer.correct_answer.sign]
                }else{
                    review_response.sign = ['Hmmm the sign is not correct, it is not: '+ checked_answer.student_answer.sign, 'try something else. ']
                }

                scene.review_assets[0] = review_response;

                //console.log(review_response);

            }

            const refresh_slopes = ()=>{

                let currentLine = plane.lines.pop();
                 // five lines bigger than 1.5
            for(let i = 0; i < 4; i++){
                let slope = Math.random()*20 - 10;
                if(slope > 0 && slope < 2){
                    slope += 1;
                }
                if(slope < 0 && slope > -2){
                    slope -=1;
                }
                slopes.push(slope);
            }

            // four lines smallar than 0.6
            for(let j = 0; j < 4; j ++){
                let slope = Math.random()*2 -1;
                if(slope > 0.5){
                    slope -= 0.2;
                }
                if(slope < -0.5){
                    slope += 0.2;
                }
                slopes.push(slope);
            }

            // always lines
            slopes.push(0);
            slopes.push(1);
            slopes.push(-1);
            slopes.push(9999999);

            slopes = [...shuffle(slopes)];
        



            slopes.forEach((slope)=>{
                //create a line
                plane.create_slope_line(slope);
                
            })

            lines = [...plane.lines];
            plane.lines = [currentLine]; // empty plane lines
            }

            const onclick_next_line = (e)=>{
                // check if a button was really clicked
                let button_clicked = false;
                scene.buttons.forEach((button)=>{
                    if(button.is_mouse_on){
                        button_clicked = true;
                    }
                })

                if(!button_clicked){return};

                let checked_answer = check_if_correct();
                console.log('checked answer',checked_answer);

                if(checked_answer.is_student_correct){
                    //turn off and clear review if necessary
                    if(scene.review_on){
                        refresh_slopes();
                    }
                    scene.review_on = false;
                    scene.review_assets = [];
                   // student was correct
                   scene.score += 1;
                   if(scene.score == 2){
                       scene.end_condition = true;
                       ctx.removeEventListener('mouseup', onclick_next_line)
                   }
                    plane.lines = [];
                    let new_line = lines.pop();
                    plane.lines.push(new_line);

                }else{
                    //student was incorrect
                   review_answer(checked_answer);

                }

                

                //redo_on_mistake();
            }

        

            

            ctx.canvas.addEventListener('mouseup', onclick_next_line)

    
            

        }


        create_9_random_slopes();

        let x_positive = x_margin + width + 50;
        let x_negative = plane.x - 250;



        // positive buttons
        let smallp_button = new Button(ctx, 'small < 1', x_positive, ctx.canvas.height-200, 200, 100);
        let mediump_button = new Button(ctx, 'medium = 1', x_positive, ctx.canvas.height-400, 200, 100);
        let bigp_button = new Button(ctx, 'big > 1', x_positive, ctx.canvas.height - 600, 200, 100);

        let smalln_button = new Button(ctx, 'small > -1', x_negative, ctx.canvas.height-200, 200, 100);
        let mediumn_button = new Button(ctx, 'medium = -1', x_negative, ctx.canvas.height-400, 200, 100);
        let bign_button = new Button(ctx, 'big < -1', x_negative, ctx.canvas.height - 600, 200, 100);

        // special buttons
        let zero_button = new Button(ctx, ' 0 ', ctx.canvas.width/2 - 225, ctx.canvas.height-200, 200, 100);
        zero_button.on_color = 'fuchsia'
        let undefined_button = new Button(ctx, 'Undefined', ctx.canvas.width/2 + 25, ctx.canvas.height-200, 200, 100);
        undefined_button.on_color = 'fuchsia'

        scene.buttons = [smallp_button, mediump_button, bigp_button, smalln_button, mediumn_button, bign_button, zero_button, undefined_button];

         // determine what should allow an end condition to be satisfied
    const satisfy_end_condition = (e)=>{
        if(e.code == 'Space'){
            scene.end_condition = true;
            //console.log('end condition satisfied', scene.end_condition);
        }
    }


    // event listeners
    const handle_end_condition = scene.canvas.addEventListener('keydown', satisfy_end_condition)
    
    // get rid of event listeners (at end)
    const remove_all_event_listeners = ()=>{
        scene.canvas.removeEventListener('keydown', satisfy_end_condition);
    }


    let new_line = lines.pop();
    //console.log("new_line",new_line)
    plane.lines.push(new_line);

    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///// LOOOOPP //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let loop = ()=>{

            if(!scene.end_condition){ // does not redo loop if end condition is satisfied;
           // console.log('animation running');
            //console.log(review_response);

            scene.clear_canvas(); // clears canvas

            scene.display_title('Slope Magnitude'); // display title if desired

            plane.draw();

            // 

            if(display_mistake){

                scene.display_text_lines(['oops', '', 'this slope is'], 100, 100);
        
            }


            // Positive Values

            ctx.fillStyle = 'cyan';
            scene.display_text_lines(['Positive Values'], x_positive, 300);
            scene.display_text_lines(['Negative Values'], x_negative, 300);

            // score
            scene.display_text_lines(["Score: " + scene.score.toString()], 100, 100);
            //buttons
            scene.buttons.forEach((button)=>{button.draw()})

            // review
            if(scene.review_on){
                //console.log('review assets', scene.review_assets[0]);
                let sign_lines = [scene.review_assets[0].sign[0]]
                let magnitude_lines = [scene.review_assets[0].magnitude[0]]
                
                scene.ctx.fillStyle = 'cyan';
                scene.font = '15px Arial';
                scene.display_text_lines(sign_lines, 50, 150);
                scene.display_text_lines(magnitude_lines, 50, 200);
                //scene.display_text_lines['review_response']

                scene.font = '30px Arial';
                


            }
            // smallp_button.draw();
            // mediump_button.draw();
            // bigp_button.draw();

            // smalln_button.draw();
            // mediumn_button.draw();
            // bign_button.draw();

            // zero_button.draw();
            // undefined_button.draw();

            //display text if wanted
            //scene.display_text_lines(['Click the corresponding button to say wheter the slope is:', 'exactly equal to one', 'bigger than 1', 'smaller than 1'])

            // displays instructions if i is pressed
            if(scene.instructions_visible){scene.display_instructions();}
 
           requestAnimationFrame(loop); // start loop again
            }else{ // otherwise break the loop
                cancelAnimationFrame(loop);
                scene.clear_canvas();
                scene.display_text_lines(['Nicely done, press space to continue!'])
                remove_all_event_listeners();
            }
           
        }

        loop();// run loop   
    }

    return scene; // return scene object because this function returns an object 

}





export{build_scene};



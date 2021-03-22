import {Assesment2, Scene, Instructions} from '../Assesment2.js';
import {runInput} from '../modules/InputBox.js';


const build_scene = (ctx) =>{
    // create scene object
    const scene = new Scene(ctx);

    // create instructions
    scene.instructions = new Instructions('Slope Formula', ['You are give two points', 'You should not try to count visually', 'Use the Formula to find the slope', 'Round all answers to 2 decimals places', '1.765434... -> 1.77', '0.9230922 -> 0.92' ]);
    
    scene.handle_instructions(); // handle instructions
    scene.end_contion = false; // set end condition to false initially
    scene.score = 0;

   

    // contents of scene
    scene.contents = ()=>{
        runInput();

         // determine what should allow an end condition to be satisfied
    const satisfy_end_condition = (e)=>{
        // if(e.code == 'Space'){
        //     scene.end_condition = true;
        //     console.log('end condition satisfied', scene.end_condition);
        // }
    }

    // funcitons
    const get_slope_object = ()=>{
        let x = get_random_half_int_from_0_to_100();
        let y = get_random_half_int_from_0_to_100();
        let x1 = get_random_half_int_from_0_to_100();
        let y1 = get_random_half_int_from_0_to_100();

        let dy = y1 - y;
        let dx = x1 - x;
        if(dx == 0){
            x += 15;
            dx = x1 - x;
        }

        let slope = dy/dx;

        // rounded slope
        let rounded_slope = Math.round(slope*100)/100;

        return {
            x: x,
            y: y,
            x1: x1,
            y1: y1,
            dy: dy,
            dx: dx,
            slope: slope,
            rounded_slope: rounded_slope
        }
    }

    const next_question = ()=>{
        slope_object = get_slope_object();
        scene.question_object = slope_object;
        //console.log(scene.question_object);
        let student_answer = null;
        scene.answer_object = {fractional: slope_object.slope, rounded: slope_object.rounded_slope, student_answer: null};
    }

    const display_question = ()=>{
        scene.font = '60px Arial';
        let x = scene.question_object.x;
        let y = scene.question_object.y;
        let x1 = scene.question_object.x1;
        let y1 = scene.question_object.y1;
        //console.log(scene.question_object);
        scene.display_text_lines(['('+ x +', ' + y + ')'], scene.canvas.width/2 , scene.canvas.height/2 - 70)
        scene.display_text_lines(['('+ x1 +', ' + y1 + ')'], scene.canvas.width/2 , scene.canvas.height/2 + 70)

        scene.font = '30px Arial';
    }

    const check_answer = ()=>{
        if(Number.isNaN(scene.answer_object.student_answer)){
          //  console.log('Not a number');
            scene.tips_on = true;
        }else{
            scene.tips_on = false;
          //  console.log('fractional: ', scene.answer_object.fractional);
          //  console.log('rounded: ', scene.answer_object.rounded);
            if(scene.answer_object.student_answer == scene.answer_object.fractional || scene.answer_object.student_answer == scene.answer_object.rounded){
              //  console.log('correct!')
                scene.score += 1;
                if(scene.score >= 2){scene.end_condition = true}
                next_question();
            }else{
                scene.score = 0;
            }
           // console.log(scene.answer_object.student_answer)
        }
    }

    const get_random_half_int_from_0_to_100 = () =>{
        let half_int = Math.floor((Math.random()*200))/2
        return half_int;
    }


    // event listeners
    const handle_end_condition = scene.canvas.addEventListener('keydown', satisfy_end_condition)
    scene.canvas.addEventListener('keydown', (e)=>{
        if(e.code == 'Enter'){
            // check input

            // give tips/warnings
            // check answer
            check_answer();
            // adjust score
            // next question
        }
    })
    
    // get rid of event listeners (at end)
    const remove_all_event_listeners = ()=>{
        scene.canvas.removeEventListener('keydown', satisfy_end_condition);
    }

    // objects
    var inputAns = new CanvasInput({
        canvas: document.getElementById('canvas1'),
        fontSize: 30,
        y: 200,
        x: 100,
        fontFamily: 'Arial',
        fontColor: 'cyan',
        backgroundColor: '#333',
        fontWeight: 'bold',
        width: 600,
        padding: 10,
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 3,
        boxShadow: '1px 1px 0px #fff',
        innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
        placeHolder: 'Answer (rounded to 2 decimal places)',
        placeHolderColor: 'cyan',
        onsubmit: ()=>{
            check_answer();
            inputAns._value = inputAns.placeHolder;
        }
      });

      



        let slope_object = get_slope_object();

        let loop = ()=>{

            

            if(!scene.end_condition){ // does not redo loop if end condition is satisfied;
            //console.log('animation running');

            scene.clear_canvas(); // clears canvas

            if(scene.next_question){
                scene.next_question = false;
                next_question()
            }

            scene.display_title('Slope Formula'); // display title if desired

            inputAns.render();


            if(inputAns._value != inputAns.placeHolder){
                scene.answer_object.student_answer = Number(inputAns._value);
               // console.log(scene.answer_object);
            }
            

            //display text if wanted
            scene.display_text_lines(['Score: ' + scene.score], 100, 100);

            if(scene.tips_on){
                scene.display_text_lines(['Answer is not a recognized number', ' Enter as a fraction using "/" or as a number rounded to two decimal places'], 50, 600);

            }

            // display question
            display_question();

            //scene.display_text_lines(['Topics:', 'Find X & Y Coordinates', 'Label X & Y Coordinates', 'Slope Intuition - (Positive, Negative, Big, Small, Vertical, Horizontal)', 'Measuring Slope Visually', 'Measuring Slope with Formula', '', 'press i to continue'])

            // displays instructions if i is pressed
            if(scene.instructions_visible){scene.display_instructions();}
 
           requestAnimationFrame(loop); // start loop again
            }else{ // otherwise break the loop
                cancelAnimationFrame(loop);
                scene.clear_canvas();
                scene.display_text_lines(['press space to see your final score'])
                remove_all_event_listeners();
            }

           
        }

        loop();// run loop   
    }

    return scene; // return scene object because this function returns an object 

}





export{build_scene};



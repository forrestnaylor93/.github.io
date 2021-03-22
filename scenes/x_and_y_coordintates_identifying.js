import {Assesment, Scene, Instructions} from '../Assesment.js';



const get_x_and_y_coordinates_identifying = (ctx)=>{

    let x_and_y_coordinates_identifying_instructions = new Instructions(
        [
        'This exercise asks you to identify points',
        ' You must find the X value',
        ' You must find the Y value',
        ' And you must place the values in the conventional format of (X, Y)'
        ],
        'Identifying X & Y Coordiates'
    )

    let x_and_y_coordinates_identifying = new Scene(ctx);
    x_and_y_coordinates_identifying.end_condition = 'Space';
    x_and_y_coordinates_identifying.instructions = x_and_y_coordinates_identifying_instructions;
    x_and_y_coordinates_identifying.content = ()=>{
    

    let loop = ()=>{
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        if(x_and_y_coordinates_identifying.instructions_visible){
            x_and_y_coordinates_identifying.display_instructions();
        }else{
            x_and_y_coordinates_identifying.display_as_headline('Identifying X & Y Coordiates');
            //x_and_y_coordinates_identifying.display_as_text('Press and hold ithe "i" key to start.', 100, 300);
            
        }

        requestAnimationFrame(loop);
    }

    loop()
    
    
}

return x_and_y_coordinates_identifying;

}


export {get_x_and_y_coordinates_identifying};
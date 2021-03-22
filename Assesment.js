class Assesment{
    constructor(ctx){
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.scenes = [1]
        this.scene_index = 0;
        this.canvas.addEventListener('keydown', this.call_instructions);
        this.canvas.addEventListener('keyup', this.hide_instructions);
        this.canvas.addEventListener('keydown', (e)=>{
            if(this.scenes[this.scene_index].end_condition){
                console.log('next scene')
                this.next_scene();
            }
        })
        
        
    }





    run(){
        let scene = this.scenes[this.scene_index];
        this.listen_for_end_condtion(scene);
        scene.content();
        if(scene.event_listeners){scene.event_listeners()};
        this.listen_for_end_condtion(scene);
    }


    // call_instruction_page(e){
    //     //console.log(e)
    //     if(e.code == 'KeyI'){
    //         console.log('howdy');
    //         console.log(this);
    //         //this.scenes[this.scene_index].display_instructions();
    //     }
    // }

    call_instructions = (e)=>{
        if(e.code == 'KeyI'){
            this.scenes[this.scene_index].instructions_visible = true;
        }
    }

    hide_instructions = (e)=>{
        if(e.code == 'KeyI'){
            this.scenes[this.scene_index].instructions_visible = false;
        }
    }


    listen_for_end_condtion(scene){
        switch(scene.end_condition){
            case 'Space':
                this.canvas.addEventListener('keydown', this.make_end_condition_space);
            break;
            case 'Complete_and_Enter':
                this.canvas.addEventListener('keydown', this.make_end_condition_enter)
            default:
        }
    }

    remove_listeners(){
        let scene = this.scenes[this.scene_index];

        switch(scene.end_condition){
            case 'Space':
                this.canvas.removeEventListener('keydown', this.make_end_condition_space);
            break;
            default:
        }

        // remove space event listener
    }

    make_end_condition_space = (e)=>{
        if(e.code == 'Space'){
            console.log('next scene')
            this.next_scene();
        }
    }

    make_end_condition_enter = (e) =>{
        if(this.scenes[this.scene_index].end_condition == true){
            console.log('next scene 2')
            this.next_scene();
        }
    }






    next_scene(){
        this.clear_scene();
        this.scene_index += 1;
        this.run();
    }

    clear_scene(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.remove_listeners();
    }





}

class Scene{
    constructor(ctx){
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.content = null;
        this.event_listeners = null;
        this.start_condition = null;
        this.end_condition = null;
        this.headline_font = '60px Arial';
        this.font = '30px Arial';
        this.color = '#ccc';
        this.instructions = null;
        this.x = 100;
        this.y = 100;
        this.instructions_visible = false;

        // style
        this.instruction_background_color = "#333"
    }


    display_as_headline(text){
        this.ctx.font = this.headline_font;
        this.ctx.fillStyle = this.color;
        let textWidth = this.ctx.measureText(text).width;
        let xPos = this.canvas.width/2 - textWidth/2;
        this.ctx.fillText(text, xPos, 100);

    }

    display_as_text(text, xPos = 100, yPos = 100){
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(text, xPos, yPos);
    }

    display_instructions(){

        // background

        this.ctx.fillStyle = this.instruction_background_color;
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        //console.log(this.end_condition);

        // headline
        if(this.instructions == null){this.no_instructions_alert()};
        if(this.instructions.headline){
            this.ctx.font = this.headline_font;
            this.ctx.fillStyle = this.color;
    
            this.ctx.fillText(this.instructions.headline, this.x, this.y);
        }
        if(this.instructions.lines){
            this.ctx.font = this.font;

            this.instructions.lines.forEach((line, index)=>{
                this.ctx.fillText(this.instructions.lines[index], this.x + 100, this.y + 100 + 50*index);
            })
            

        }
       
    }

        no_instructions_alert = ()=>{
            console.log('testing');
            this.instructions = new Instructions([
                "I don't have any instructions here.",
                "If you are stuck or have found a problem,",
                "Send me an email at: contact@forrestnaylor.me",
            ], "No Instructions Found ¯\\_(ツ)_/¯")
            //this.display_instructions();
            
        }
    

}

class Instructions{
    constructor(lines, headline){
        this.lines = lines;
        this.headline = headline;
    }
}




export {Assesment, Scene, Instructions};
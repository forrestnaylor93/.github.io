class Assesment2{
    constructor(ctx){
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.scenes = [];
        this.currentIndex = 0;
        this.currentScene = this.scenes[this.currentIndex];

        this.handle_next_scene_with_space();

        //this.handle_finished_scene();
    }

    handle_finished_scene = ()=>{
        this.canvas.addEventListener('keydown', (e)=>{
            if(this.currentScene.end_condition){
                this.next_scene();
                console.log('next scene')
            }
        })
    }

    handle_next_scene_with_space(){
        this.canvas.addEventListener('keydown', (e)=>{
            if(e.code == 'Space' && this.currentScene.end_condition == true){
                this.next_scene();
            }
        })
    }

    start_assesment(){
        this.currentIndex = 0;
        this.run_scene();
    }

    run_scene(){
        this.currentScene = this.scenes[this.currentIndex];
        this.currentScene.contents();
    }

    next_scene(){
        console.log('next scene!')
        this.currentScene +=1;
        this.run_scene();
    }



    start_scene(){
        this.currentScene = this.scenes[this.currentIndex];
        this.currentScene.contents();
    }

    next_scene(){
        this.currentIndex += 1;
        if(this.currentIndex < this.scenes.length){
            this.start_scene(this.currentScene);
        }else{
            console.log('end of assesment')
        }
        
    }
}

class Scene{
    constructor(ctx){
        this.end_condition = false;

        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.instructions = null;
        this.contents = null;
        this.instructions_visible = false;
        this.review_on = false;
        this.ready_to_answer = false;
        this.review_assets = [];
        this.other_assets = [];
        this.slope = null;
        this.next_question = true;
        this.question_object = null;
        this.start = null;
        this.end = null;

        // style
        this.instruction_background_color = "#333";
        this.color = "#ccc";
        this.headline_font_size = 60;
        this.headline_font = this.headline_font_size.toString()+'px Arial';
        this.font_size = 30;
        this.font = this.font_size.toString()+'px Arial';
        this.line_spacing = 1.7

        //obj
        this.buttons = [];



    }

    show_time = ()=>{
        let now = new Date();
        let diff = this.start - now;
        //let elapsed = now - this.start;
        //console.log('time since start: ' + elapsed.toString());
        //console.log(this.start - now);
        let time = Math.round(Math.abs(diff)/1000);
        let minutes = Math.floor(time/60);
        let seconds = time%60;
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '60px Arial'
        this.display_text_lines(['total time: ' + minutes + ' : ' + seconds], 500, 500);
        console.log(time);
        
       // return time;

    }


    clear_canvas(){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    set_background(color = this.instruction_background_color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

    }

    display_title(title){
        //headline
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.headline_font;
        let width_diff = this.ctx.measureText(title).width;
        this.ctx.fillText(title, this.canvas.width/2 - width_diff/2, this.headline_font_size);
    }

    display_text_lines(lines, x=null, y=null){
        this.ctx.font = this.font;
        
        let xPos = 100;
        let yPos = this.headline_font_size*3;
        if(x){xPos = x};
        if(y){yPos = y};
        

        lines.forEach((line, index)=>{
            this.ctx.fillText(line, xPos, yPos)
            yPos += this.line_spacing*this.font_size
        })
    }

    display_instructions(){
        // background
        this.set_background();
        // //headline
        this.display_title(this.instructions.headline + " - Instructions");
        //this.show_time();

        //lines
        this.display_text_lines(this.instructions.lines)

        this.show_time();
    }

    handle_instructions = ()=>{
        this.canvas.addEventListener('keydown', (e)=>{
            if(e.code == 'KeyI'){
                //toggle instruction value
                if(this.instructions_visible){
                    this.instructions_visible = false;
                }else{
                    this.instructions_visible = true;
                }
            }
        })
    }


}

class Instructions{
    constructor(headline, lines){
        this.headline = headline;
        this.lines = lines;
    }
}

export{Assesment2, Scene, Instructions}
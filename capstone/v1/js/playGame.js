

$(()=>{
    let demoTemplates = [];
        demoTemplates[0] = [[0,0,2], [0,0,1], [1,0,2], [1,0,1],[0,1,2], [0,1,1], [1,1,2], [1,1,1]]; //2x2x2 cube
        // demoTemplates[0] = [[2,0,0], [2,0,1], [1,0,1], [1,1,1], [1,2,1], [2,2,1], [2,2,0]]; //hook
        // demoTemplates[0] = [[2,0,0], [2,0,1], [1,0,1], [1,1,1], [1,1,2], [0,1,2]]; //corkscrew
    let easyTemplates = []; 
        easyTemplates[0] = [[1,1,0], [0,1,0], [1,1,1], [0,1,1]]; //2x2 square
        easyTemplates[1] = [[1,1,0], [1,1,1]];//2x1 rect
        // easyTemplates[2] = [[0,0,2], [0,0,1], [1,0,1], [1,0,0]]; //2-d stagger 
        easyTemplates[2] = [[1,1,0], [1,1,1], [2,1,1], [2,1,2]]; //2-d stagger 
        easyTemplates[3] = [[1,1,1]];//rudimentary 1x1 cube
    let mediumTemplates = []; 
        mediumTemplates[0] = [[1,1,1]];//rudimentary 1x1 cube
        mediumTemplates[1] = [[1,1,0], [2,1,0], [1,2,0], [1,1,1], [1,1,2], ]; //double corner
        mediumTemplates[2] = [[1,1,0], [1,1,1], [1,0,1], [1,0,2], [1,2,1], [1,2,2], ];//Y branch
        mediumTemplates[3] = [[1,1,0], [1,1,1]];//2x1 rect
        mediumTemplates[4] = [[1,1,0], [2,1,0], [2,1,1], [2,1,2], [1,1,2], [0,1,2], [0,1,1], [0,1,0], ];//hole
        mediumTemplates[5] = [[1,1,0], [1,2,0], [1,1,1], [1,1,2], ]; //2-d L 
        mediumTemplates[6] = [[1,1,0], [1,1,1], [2,1,1], [2,1,2]]; //2-d stagger 
        mediumTemplates[7] = [[1,1,0], [1,1,1], [1,0,1], ]; //simple right angle
        mediumTemplates[8] = [[1,1,0], [1,0,0], [0,0,0], [0,1,0], [1,1,1], [1,0,1], [0,0,1], [0,1,1]]; //2x2x2 cube
    let hardTemplates = []; 
        hardTemplates[0] = [[1,1,1]];//rudimentary 1x1 cube
        hardTemplates[1] = [[1,1,0], [2,1,0], [1,2,0], [1,1,1], [1,1,2], ]; //double corner
        hardTemplates[2] = [[1,1,0], [1,1,1], [1,0,1], [1,0,2], [1,2,1], [1,2,2], ];//Y branch
        hardTemplates[3] = [[1,1,0], [1,1,1]];//2x1 rect
        hardTemplates[4] = [[1,1,0], [2,1,0], [2,1,1], [2,1,2], [1,1,2], [0,1,2], [0,1,1], [0,1,0], ];//hole
        hardTemplates[5] = [[1,1,0], [1,2,0], [1,1,1], [1,1,2], ]; //2-d L 
        hardTemplates[6] = [[1,1,0], [1,1,1], [2,1,1], [2,1,2]]; //2-d stagger 
        hardTemplates[7] = [[1,1,0], [0,1,0], [0,2,0], [1,1,1], [0,1,1], [0,2,1], [1,1,2], [0,1,2], [0,2,2] ]; //sofa 
        hardTemplates[8] = [[2,0,0], [2,0,1], [1,0,1], [1,1,1], [1,1,2], [0,1,2]]; //corkscrew
        hardTemplates[9] = [[1,1,0], [1,1,1], [1,1,2]]; //3x1 rect
        hardTemplates[10] = [[1,1,0], [1,1,1], [1,0,1], ]; //simple right angle
        hardTemplates[11] = [[1,1,0], [1,0,0], [0,0,0], [0,1,0], [1,1,1], [1,0,1], [0,0,1], [0,1,1]]; //2x2x2 cube
        hardTemplates[12] = [[1,1,0], [0,1,0], [1,1,1], [0,1,1]]; //2x2 square
        hardTemplates[13] = [[2,0,0], [2,0,1], [1,0,1], [1,1,1], [1,2,1], [2,2,1], [2,2,0]]; //hook
        hardTemplates[14] = [[1,1,0], [1,1,1], [2,1,1], [1,2,1], [1,1,2]];//jack shape

    let levels = document.getElementById('levels')
    let modal = new bootstrap.Modal(levels); 
    modal.show(); 

    let shapeDifficulties = [demoTemplates, easyTemplates, mediumTemplates, hardTemplates]; 
    let gridSizes = [6, 8, 10, 12]; 
    let speeds = [1500, 1200, 1000, 800]
    let configs = {
        minisRequested: true,
        square: false, 
        parent1: '#parent', 
        parent2: '#tesseract'
    }
    $('#levelsForm').on('submit', (evt)=> {
        //get desired difficulty levels from user input to modal
        let data = new FormData(evt.currentTarget); 
        configs.n = gridSizes[data.get('sizes')]; 
        configs.templates = shapeDifficulties[data.get('shapes')]; 
        configs.period = speeds[data.get('speeds')]; 
        evt.preventDefault(); 
        let frame = new Frame(null, configs); 
    
        window.addEventListener('resize', updateSize)
        registerEventHandlers(frame); 
         
        let active = new Shape(frame, null, null, frame.generateRandomShapeTemplate()); 
        frame.shapes.unshift(active);
        frame.flashDirections(); 
        frame.resetPeriod(); 
    
        //SET UP TOAST NOTIFICATIONS
        let toast = new bootstrap.Toast(document.querySelector('.toast'), {animation: true, autohide: true, delay:4000}); 
        toast.show(); 
        
        //remove modal
        $(levels).remove(); 

        function updateSize(){
            clearTimeout(frame.nextStep); 
            //have to remove old from from the DOM
            $('#tesseract').empty(); 
            frame = new Frame(frame, configs); 
            if(!frame.paused){frame.resetPeriod(); }
            $(window).trigger('focus');
            registerEventHandlers(frame); 
            console.log(frame.version); 
        }
        
    });
}); 
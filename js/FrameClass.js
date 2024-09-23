class Frame{
    constructor(priorFrame, configs){
        this.configs = configs; 
        let n = this.n = configs.n;
        this.period = configs.period; 
        this.templates = configs.templates; 
        this.zHeight = configs.square? n: n*1.5; 
        this.domElement = document.querySelector(configs.parent2)
        let $tesseract = this.$tesseract = $(configs.parent2);
        $tesseract.children('.axis').remove(); //remove any prior axes from DOM when updating size
        
        //preserve control settings and other primitive values between resizes
        if(priorFrame){
            this.paused = priorFrame.paused; 
            this.controlFrame = priorFrame.controlFrame;
            this.rotateShape = priorFrame.rotateShape;
            this.version = priorFrame.version + 1;
            this.yOrientation = priorFrame.yOrientation;
            this.score = priorFrame.score; 
            this.toast = priorFrame.toast; 
            this.shapeQueue = priorFrame.shapeQueue; 
            this.miniFrames = priorFrame.miniFrames; 
        }
        else{
            this.paused = false; 
            this.controlFrame = false; 
            this.rotateShape = false; 
            this.version = 1; 
            this.yOrientation = 0; 
            this.score = 0; 
            this.toast = new bootstrap.Toast(document.querySelector('.toast'), {animation: true, autohide: true, delay:4000}); 
            if(configs.minisRequested){
                this.shapeQueue = []; 
                for(let s=0; s<3; s++){
                    this.shapeQueue.push(this.generateRandomShapeTemplate()); 
                }
                this.miniFrames = []; 
                let miniFrameConfigs = {
                    n: 3, 
                    period: 900, 
                    templates: configs.templates,
                    square: true, 
                    minisRequested: false,
                    parent1: '.miniFrameParent1', 
                    parent2: '.miniFrame1'
                }
                this.miniFrames[0] = new Frame(null, miniFrameConfigs); 
                miniFrameConfigs.parent2 = '.miniFrame2';
                this.miniFrames[1] = new Frame(null, miniFrameConfigs); 
                miniFrameConfigs.parent2 = '.miniFrame3';
                this.miniFrames[2] = new Frame(null, miniFrameConfigs); 
                this.miniFrames[0].shapes[0] = new Shape(this.miniFrames[0], null, null, this.shapeQueue[0])
                this.miniFrames[1].shapes[0] = new Shape(this.miniFrames[1], null, null, this.shapeQueue[1])
                this.miniFrames[2].shapes[0] = new Shape(this.miniFrames[2], null, null, this.shapeQueue[2])
            }
        }
 
        //Set new dimensions
        let w0 = Math.floor($(configs.parent1).width());
        while (w0 % (n * 2) !== 0) { w0--;}
        let h0 = this.configs.square? w0: w0*1.5;  
        $tesseract.css({
            'width': `${w0}px`,
            'height': `${h0}px`,
            'transform-origin': `center center ${w0/2}px`,
            'transform': `${priorFrame? priorFrame.domElement.style.transform : 'rotateX(-20deg) rotateY(15deg)'}`
        })
        if(!configs.square){
            $('.spacer').children().css({
                    'height': h0, 
                    'transform': `translateZ(${Math.floor(w0*0.75)}px) rotateX(65deg)`
            });             
        }
        buildFrame(this); //CONSTRUCT FRAMEWORK OF AXES AND PLANES USING GRID

   
        //DATA INDICATING WHICH SPACES ARE OCCUPIED BY BLOCKS, empty to start
        //going to have z-coordinate first, then y, then x
        this.occupied = [];
        this.spacesFilledInPlane= []; 
        for(let z=0; z<this.zHeight; z++){
            this.occupied[z] = []; 
            this.spacesFilledInPlane[z]= new Set(); //set of blocks
            for(let y=0; y<n; y++){
                this.occupied[z][y] = []; 
                for(let x=0; x<n; x++){
                    this.occupied[z][y][x] = null; 
                }
            }
        }

        
      
        //recreate shapes
        this.shapes =[]
        if(priorFrame){ //did via pop() and unshift() because active shape with shadow needs to be created last. 
            while(priorFrame.shapes.length >0){
                let s = priorFrame.shapes.pop(); 
                for(let b of s.blocks){
                    delete b.faces
                }
                let s2 = new Shape(this, s); 
                if(priorFrame.shapes.length >0) {s2.lock(this);} //register spaces taken up by locked shapes as being occupied
                this.shapes.unshift(s2); 
            }
        }
        

        //OPTIONAL Code to set parent 50%*w0 back from plane of screen, and give some perspective,
        //  parent.style.transform = `translateZ(-${w0/2}px) perspective(110cm)`; 
        //  $(configs.parent1).css('transform', `translateZ(-${w0*2}px) perspective(100cm)`);
        


        function buildFrame(self) { //private, modularized helper function 
            //build three 'axes'
            //BUILD Z AXIS - to hold xy planes
            let axis = document.createElement('div');
            $(axis)
                .addClass('axis z')
                .css({
                    'width': `${w0}px`,
                    'height': `${h0}px`,
                    'grid-template-rows': `repeat(${self.zHeight}, 1fr)`
                })
                .appendTo($tesseract); 
            for(let i=0; i<=self.zHeight; i++){ //build the individual planes
                $('<div class="plane"> </div>')
                    .css({
                        'width': `${w0}px`,
                        'height': `${w0}px`,
                        'grid-template-columns': `repeat(${n}, 1fr)`,
                        'grid-template-rows': `repeat(${n}, 1fr)`,
                        'grid-row-start': `${-1-i}`,
                        'background-color': 'rgba(0, 0, 250, 0.025)',
                        'transform': 'translateY(-50%) rotateX(90deg) translateY(50%) rotateZ(90deg)'
                    })
                    .appendTo(axis); 
                }
            self.zAxis = axis.children;
           
            //BUILD X AXIS - to hold xy planes
            axis = document.createElement('div');
            $(axis)
                .addClass('axis x')
                .css({
                    'width': `${w0}px`,
                    'height': `${h0}px`,
                    'grid-template-columns': `repeat(${n}, 1fr)`
                })
                .appendTo($tesseract); 
            for(let i=0; i<=n; i++){ //build the individual planes
                $('<div class="plane"> </div>')
                    .css({
                        'width': `${w0}px`,
                        'height': `${h0}px`,
                        'grid-template-columns': `repeat(${n}, 1fr)`,
                        'grid-template-rows': `repeat(${self.zHeight}, 1fr)`,
                        'grid-column-start': `${-1-i}`,
                        'background-color': 'rgba(250, 0, 0, 0.025)',
                        'transform-origin': 'left',
                        'transform': 'rotateY(-90deg) rotateX(180deg)'
                    })
                    .appendTo(axis); 
                }
                self.xAxis = axis.children;

            //BUILD Y AXIS - to hold xy planes
            axis = document.createElement('div');
            $(axis)
                .addClass('axis y')
                .css({
                    'width': `${w0}px`,
                    'height': `${h0}px`,
                    'grid-template-columns': `repeat(${n}, 1fr)`,
                    'left': '100%',
                    'transform-origin': 'left',
                    'transform': 'rotateY(-90deg)'
                })
                .appendTo($tesseract); 
            for(let i=0; i<=n; i++){ //build the individual planes
                $('<div class="plane"> </div>')
                    .css({
                        'width': `${w0}px`,
                        'height': `${h0}px`,
                        'grid-template-columns': `repeat(${n}, 1fr)`,
                        'grid-template-rows': `repeat(${self.zHeight}, 1fr)`,
                        'grid-column-start': `${i+1}`,
                        'background-color': 'rgba(0, 250, 0, 0.025)',
                        'transform-origin': 'left',
                        'transform': 'rotateY(-90deg) rotateX(180deg)'
                    })
                    .appendTo(axis); 
                }
            self.yAxis = axis.children;
        
         //Unique element for displaying updated coordinate systems on top of main frame
         if(!self.configs.square){
            self.$directions = $('<div class="directions hidden"></div>')
                .css('transform', `rotateZ(${-90 +90*self.yOrientation}deg)`)
                .appendTo(self.zAxis[self.zHeight]); 
         }
        }
    }//close constructor

    rotateTesseract(key){//class method that will serve as event handler
        //Rotation orientations - positive y = Right Hand rule, positive x = left Hand Rule
        let $indexCube = $('.controls .five');
        let transform = this.domElement.style.transform 
        let i = transform.indexOf('rotateX') + 8;
        let xRot = parseInt(transform.slice(i));
        i = transform.indexOf('rotateY') + 8;
        let yRot = parseInt(transform.slice(i));
        switch (key) {
            case 37:
                yRot += 5;
                if(yRot > 360) {yRot -= 360;}
                if((yRot+50)%90 ===0) {
                    yRot +=15; //so L/R/U/D directions are well specified, not looking right down 45deg axis
                    this.yOrientation = Math.floor(((yRot+45)%360)/90);
                    this.$directions.css('transform', `rotateZ(${-90 +90*this.yOrientation}deg)`);
                    this.flashDirections(); 
                }
                break;
            case 38:
                xRot += 5;
                break;
            case 39:
                yRot -= 5;
                if(yRot < 0) {yRot += 360;}
                if((yRot+40)%90 ===0) {
                    yRot -=15; //so L/R/U/D directions are well specified, not looking right down 45deg axis
                    this.yOrientation = Math.floor(((yRot+45)%360)/90);
                    this.$directions.css('transform', `rotateZ(${-90 +90*this.yOrientation}deg)`);
                    this.flashDirections(); 
                }
                break;
            case 40:
                xRot -= 5;
                break;
        }
        this.$tesseract.css('transform', `rotateX(${xRot}deg) rotateY(${yRot}deg)`);
        let yIndexRot = this.yOrientation>0? yRot - (90*this.yOrientation) : yRot; 
        $indexCube.css('transform', `translateZ(150px) rotateX(${xRot}deg) rotateY(${yIndexRot}deg)`);
        $('.rotationArrowClockwise').css('transform', `translateZ(150px) rotateX(60deg) rotateZ(${-yIndexRot+45}deg) rotateY(180deg)`); 
        $('.rotationArrowCounter').css('transform', `translateZ(150px) rotateX(60deg) rotateZ(${-yIndexRot+45}deg)`); 
    }//close rotateTesseract()

    flashDirections(){
        this.$directions.removeClass('hidden');
        setTimeout(()=> this.$directions.addClass('hidden'), 1000);
    }

    fall(){
        let activeShape = this.shapes[0]; 
        let height = activeShape.testFall(this); 
         
        if(height>0){
            activeShape.translateShape(this, 50); 
            this.resetPeriod(); 
        }
        else{
            this.finishFall(activeShape);
        }

    }

    finishFall(activeShape){
        if(activeShape){
            activeShape.lock(this); 
        }
        let squared = this.n*this.n;
        let fullPlanes = new Set(); 
        for(let x=0; x<this.zHeight; x++){
            if(this.spacesFilledInPlane[x].size === squared){
                fullPlanes.add(x); 
            }
        }
        if(fullPlanes.size >0){
            this.removeLayers(fullPlanes).then(()=>{
                this.finishFall();
                // console.log('promise worked!'); //left in because can be helpful if later debugging required of new features. 
            }) ; 
            return; 
        }
        try{
            this.updateShapeQueue(); 
            this.resetPeriod(); 
        }
        catch(err){
            document.dispatchEvent(new CustomEvent('gameOver', {detail: 'Shape could not be placed'}));
        }
       
    }

    resetPeriod(){
        clearTimeout(this.nextStep); 
        this.nextStep = setTimeout(()=> this.fall(), this.period); 
    }

    pause(){
        if(!this.paused){
            clearTimeout(this.nextStep); 
            console.log('PAUSED');
            this.paused = true;
        }
        else{
            this.nextStep = setTimeout(()=> this.fall(), this.period); 
            console.log('UNPAUSED');
            this.paused = false; 
        }
    }

    removeLayers(filledLayerIndices){
        let layers = new Set(); 
        for(let x of filledLayerIndices){
            layers.add(this.spacesFilledInPlane[x]) //so layers is a Set of Sets
            this.updateAndShowScore(); 
        }
        let alteredShapes = new Set(); 
        for(let layer of layers){
            for(let b of layer){
                alteredShapes.add(b.shape); 
                let numBlocks = b.shape.blocks.length; 
                b.erase(); 
                // erased block; 
                if(numBlocks === 1){
                    this.shapes = this.shapes.filter( s => s !== b.shape); 
                    // erased shape from frame
                }
            }
            layer.clear(); 
        }
        for(let s of alteredShapes){
            if(s.blocks.length === 0) continue; 
            s.continuity(this); 
            // updated continuity of shapes after block removal
        }
        let stillLocked = new Set(); 
        let falling = new Set();
        for(let b of this.spacesFilledInPlane[0]){
            stillLocked.add(b.shape)
        }
        //ERROR CORRECTION ATTEMPT
        for(let x=1; x<this.zHeight; x++){
            let shapesBasedOnPlaneX = new Set(); 
            for(let b of this.spacesFilledInPlane[x]){
                let s = b.shape
                if (stillLocked.has(s) || falling.has(s)) continue; 
                s.vacate();  
                shapesBasedOnPlaneX.add(s)
            }
            for(let s of shapesBasedOnPlaneX){
                let h = s.testFall(this); 
                if(h === 0) {
                    stillLocked.add(s); 
                    s.occupy(); 
                }
                else{
                    console.log(s); 
                    falling.add(s)
                }  
            }
        }
        // for(let x=1; x<this.zHeight; x++){
        //     for(let b of this.spacesFilledInPlane[x]){
        //         let s = b.shape
        //         if (stillLocked.has(s) || falling.has(s)) continue; 
        //         let h = s.vacate().testFall(this); 
        //         if(h === 0) {
        //             stillLocked.add(s); 
        //             s.occupy(); 
        //         }
        //         else{
        //             // console.log(s); 
        //             falling.add(s)
        //         } 
        //     }
        // }
        //be careful of scoping issues w/ setInterval
        let f; 
        //return promise object;
        return new Promise((resolve, reject) => { 
            f = setInterval(secondaryFall, 500, falling, this, resolve)
        })
        function secondaryFall(falling, frame, resolve){
            if(falling.size <=0){
                clearInterval(f);
                resolve();  
                return; 
            }
            for(let s of falling){
                s.translateShape(frame, 50, null, true); 
            }
            for(let s of falling){
                if(s.testFall(frame) <= 0){
                    s.occupy(); 
                    falling.delete(s); 
                }
            }
        }
    }

    updateShapeQueue(){
        this.shapes.unshift(new Shape(this, null, null, this.shapeQueue.shift())); 
        this.shapeQueue.push(this.generateRandomShapeTemplate()); 
        for(let m=0; m<3; m++){
            for(let b of this.miniFrames[m].shapes[0].blocks){
                b.erase(); 
            }
            this.miniFrames[m].shapes[0] = new Shape(this.miniFrames[m], null, null, this.shapeQueue[m]); 
        }
    }

    generateRandomShapeTemplate(){
        let t = Math.floor(Math.random()*this.configs.templates.length); 
        let bg = Math.floor(Math.random()*12); 
        return {template: t, color: bg }
    }

    updateAndShowScore(){
        $('.toast-body').text(++this.score)
        this.toast.show(); 
    }
} //close class


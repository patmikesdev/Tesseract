// implements a simple closure-based module, where the anonymous function immediately invoked and returns the class
//initially, had colors as a private variable of the module, later changed to allow for development of shapeQueue feature,
//kept module functionality however as a demonstration

const Shape = (function() {

return class Shape{
    
    constructor(frame, givenShape, shadow, indices){
        let n = frame.n; 
        let endGame = false; 
        this.period = frame.period
        // initialize blocks property
        this.blocks = [];
        this.almost = false;  
        this.shadow; 
        this.frame = frame; 
        if(!givenShape){
            //get random x and y offsets for insertion
            let xOffset= Math.floor(Math.random()*(n-2));
            let yOffset= Math.floor(Math.random()*(n-2));

            //get random template taken from frame.shapeQueue
            let arr = frame.templates[indices.template]; 
            for(let b of arr){
                //render block in new insertion position, add block to shape
                let x0 = b[0]+xOffset, y0 = b[1]+yOffset, z0 = b[2]+(frame.zHeight-3); 
                if(frame.occupied[z0][y0][x0]){//block can't be placed, player loses
                    for(let s of frame.shapes){
                        s.vacate(); //still want to display final shape that couldn't be placed however, have to empty spaces. 
                        endGame = true; 
                    }
                } 
                let b1 = new Block([x0, y0, z0], `var(--blockBG${indices.color}`, this, frame)
                this.blocks.push(b1); 
            }
            if(endGame) {throw new Error('Game Over')}; 
            for(let face of this.blocks[0].faces){
                face.classList.add('keyStone');
            }
        }
        else{
            //recreate preExisting block within newly resized framework, takes a shape as it's argument
            //argument s has a property blocks, each element of which is a block assigned to b
            // each b has all the x, y, and z coordinates, plus the color needed to recreate it
            for(let b of givenShape.blocks){
                let b1 = new Block([b.x, b.y, b.z], b.image, this, frame)
                this.blocks.push(b1);
            }
        }
        if(!frame.configs.square){
            this.height = this.testFall(frame); 
            if(!shadow){ //entered infinite loop without this check, made shadows of shadows etc...
                this.shadow = new Shape(frame, this, true); 
                for(let block of this.shadow.blocks){
                    for(let face of block.faces){
                        face.classList.add('shadow');
                    }
                    block.move(0, 0, -this.height); 
                }
            }
        }
    }//close constructor

    translateShape(frame, key, shadow, secondaryFalling){
        let priorMoves = []; //for checking legality of moves
        let legalMove = true; 
        switch (key) {
            case 37: //move positive X
                for (let block of this.blocks) { 
                    let movement = block.move(1,0,0);
                    if(movement[0]) {
                        priorMoves.push([block, 1, 0, 0]); 
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]);
                        break;
                    }
                }
                break;
            case 38: //move negative y
                for (let block of this.blocks) {
                    let movement = block.move(0, -1, 0);
                    if(movement[0]) {
                        priorMoves.push([block, 0, -1, 0]); 
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]); 
                        break;
                    }
                }
                break;
            case 39: //move negative x
                for (let block of this.blocks) { 
                    let movement = block.move(-1, 0, 0);
                    if(movement[0]) {
                        priorMoves.push([block, -1, 0, 0]); 
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]); 
                        break;
                    }
                }
                break;
            case 40: //move positive y
                for (let block of this.blocks) { 
                    let movement = block.move(0, 1, 0)
                    if(movement[0]) {
                        priorMoves.push([block, 0, 1, 0]); 
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]); 
                        break;
                    }
                }
                break;
            case 49: //move positive z
                for (let block of this.blocks) { 
                    let movement = block.move(0, 0, 1)
                    if(movement[0]) {
                        priorMoves.push([block, 0, 0, 1]); 
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]); 
                        break;
                    }
                }
                break;
            case 50: //move negative z
                for (let block of this.blocks) {
                    let movement = block.move(0, 0, -1)
                    if(movement[0]) {
                        priorMoves.push([block, 0, 0, -1]); 
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]); 
                        break;
                    }
                }
                break;
        }      
        let oldHeight = this.height; 
        this.height = this.testFall(frame); 
        if(secondaryFalling) {return;} //when moving shapes after a full layer beneath got removed
        
        if(legalMove && !shadow) { //move drop shadow
            for(let block of this.shadow.blocks){//bring shadow up; 
                block.move(0, 0, oldHeight); 
            }
            this.shadow.translateShape(frame, key, true); //mirror translation with shadow
            for(let block of this.shadow.blocks){// project shadow back down
                block.move(0, 0, -this.height); 
            }
        if(oldHeight === 0 && this.height !== 0) {
            this.removeLocked(); 
        }
        if(this.height === 0) { this.almostLocked(frame); }
        }
        return;
    }

    rotateShape(frame, key, shadow){
        let priorMoves = []; //for checking legality of moves
        let legalMove = true; //used to indicate whether to perform operation on dropped 'shadow shape'. 
        let { x: kX, y: kY, z: kZ } = this.blocks[0]; 
        switch (key) {
          
            case 37: //clockwise rotation about negative yAxis of keyStone block
                for (let i = 1; i < this.blocks.length; i++) {
                    let block = this.blocks[i];
                    let rx = block.x - kX;
                    let rz = block.z - kZ;
                    let movement = block.move(rz-rx, 0, -rx-rz);
                    if(movement[0]){
                        priorMoves.push([block, rz-rx, 0, -rx-rz]);
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]);
                        break;
                    }
                }
                break; 
            case 38: //Counter clockwise rotation about xAxis of keyStone block,
                for (let i = 1; i < this.blocks.length; i++) {
                    let block = this.blocks[i];
                    let ry = block.y - kY;
                    let rz = block.z - kZ;
                    let movement = block.move(0, -rz-ry, ry-rz);
                    if(movement[0]){
                        priorMoves.push([block, 0, -rz-ry, ry-rz]);
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]);
                        break;
                    }
                }
                break; 
            case 39: //clockwise rotation about positive yAxis of keyStone block
                for (let i = 1; i < this.blocks.length; i++) {
                    let block = this.blocks[i];
                    let rx = block.x - kX;
                    let rz = block.z - kZ;
                    let movement =block.move(-rz-rx, 0, rx-rz);
                    if(movement[0]){
                        priorMoves.push([block, -rz-rx, 0, rx-rz]);
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]);
                        break;
                    }
                }
                break;   
            case 40: //clockwise rotation about positive xAxis of keyStone block
                for (let i = 1; i < this.blocks.length; i++) {
                    let block = this.blocks[i];
                    let ry = block.y - kY;
                    let rz = block.z - kZ;
                    let movement = block.move(0, rz - ry, -ry - rz);
                    if(movement[0]){
                        priorMoves.push([block, 0, rz-ry, -ry -rz]);
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]);
                        break;
                    }
                }
                break; 
            case 49: //clockwise rotation about positive zAxis of keyStone block
                for (let i = 1; i < this.blocks.length; i++) {
                    let block = this.blocks[i];
                    let rx = block.x - kX;
                    let ry = block.y - kY;
                    let movement = block.move(-ry-rx, rx-ry, 0);
                    if(movement[0]){
                        priorMoves.push([block, -ry-rx, rx-ry, 0]);
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]);
                        break;
                    }
                }
                break; 
            case 50: //counterClockwise rotation about positive zAxis of keyStone block
                for (let i = 1; i < this.blocks.length; i++) {
                    let block = this.blocks[i];
                    let rx = block.x - kX;
                    let ry = block.y - kY;
                    let movement =block.move(ry-rx, -rx-ry, 0);
                    if(movement[0]){
                        priorMoves.push([block, ry-rx, -rx-ry, 0]);
                    }
                    else{
                        legalMove = false; 
                        this.boundaryViolated(priorMoves, movement[1]);
                        break;
                    }
                }
                break; 

        }//close switch
        let oldHeight = this.height; 
        this.height = this.testFall(frame); 
        
        if(legalMove && !shadow) { //move drop shadow
            for(let block of this.shadow.blocks){//bring shadow up; 
                block.move(0, 0, oldHeight); 
            }
            this.shadow.rotateShape(frame, key, true); //mirror translation with shadow
            for(let block of this.shadow.blocks){// project shadow back down
                block.move(0, 0, -this.height); 
            }
        if(oldHeight === 0 && this.height !== 0) {
            this.removeLocked(); 
        }
        if(this.height === 0) { this.almostLocked(frame); }
        }

        return;
    }

    testFall(frame){
        let height = 0;  
        while(height <= frame.zHeight){
            for(let b of this.blocks){
                if(!b.testMove(0, 0, -(height +1))[0]) 
                    {return height; }
            }
            height++; 
        }
    }

    lock(frame){
        for(let b of this.blocks){
            if(b.faces2){
                while(b.faces2.length>0){
                    b.faces2.pop().remove(); 
                }
            }
            frame.occupied[b.z][b.y][b.x] = b; 
            frame.spacesFilledInPlane[b.z].add(b); 

        }
        for(let f of this.blocks[0].faces){
            f.classList.remove('keyStone'); 
        }
        if(this.shadow){
            for(let block of this.shadow.blocks){
                for(let face of block.faces){
                    face.remove(); 
                }
            }    
            delete this.shadow; 
        }
        delete this.almost; 
    }

    almostLocked(frame){
        if(this.almost){return; }
        frame.resetPeriod(); 
        for(let b of this.blocks){
            b.faces2= [];
            for(let f of b.faces){
                 b.faces2.push($('<div class = "almost"></div>').appendTo($(f)))
            }
        }
        this.almost = anime({
            targets: '.almost', 
            opacity: '1', 
            duration: this.period,
            easing: 'linear'
        }); 
    }
    removeLocked(){
        this.almost = false; 
        for(let b of this.blocks){
            while(b.faces2.length>0){
                b.faces2.pop().remove(); 
            }
        }
    }

    boundaryViolated(priorMoves, obstruction){
        while(priorMoves.length >0){
            // undo each prior movement
            let movement = priorMoves.pop(); 
            movement[0].move(-movement[1], -movement[2], -movement[3]);
        }
        if(obstruction.faces){
            for(let b of obstruction.shape.blocks){
                for(let face of b.faces){
                    face.classList.add('violatedShape'); 
                    setTimeout(()=> face.classList.remove('violatedShape'), 250)
    
                }
            }
        }
        else{
            obstruction.classList.add('violated');
            setTimeout(()=> obstruction.classList.remove('violated'), 250); 
        
        }
    }

    vacate(){
        for(let b of this.blocks){
            this.frame.occupied[b.z][b.y][b.x] = null; 
            this.frame.spacesFilledInPlane[b.z].delete(b); 
        }
        return this; //enable method chaining
    }
    occupy(){
        for(let b of this.blocks){
            this.frame.occupied[b.z][b.y][b.x] = b; 
            this.frame.spacesFilledInPlane[b.z].add(b); 
        }
        return this; //enable method chaining
    }

    continuity(frame){
        // used for updating shapes after partial sections of a shape may have gotten removed by a full layer clearance
        let occupied = frame.occupied; 
        let connected = new Set(); 
        let queue = [this.blocks[0]]; 
        connected.add(this.blocks[0]); 
        while(queue.length>0){
            let b = queue.shift(); 
            if(b.x > 0){
                let neighbor = occupied[b.z][b.y][b.x-1];
                if(neighbor?.shape === this && !connected.has(neighbor)){
                    connected.add(neighbor); 
                    queue.push(neighbor); 
                } 
            }
            if(b.x <frame.n-1){
                let neighbor = occupied[b.z][b.y][b.x+1];
                if(neighbor?.shape === this && !connected.has(neighbor)){
                    connected.add(neighbor); 
                    queue.push(neighbor); 
                } 
            }
            if(b.y > 0){
                let neighbor = occupied[b.z][b.y-1][b.x];
                if(neighbor?.shape === this && !connected.has(neighbor)){
                    connected.add(neighbor); 
                    queue.push(neighbor); 
                } 
            }
            if(b.y <frame.n-1){
                let neighbor = occupied[b.z][b.y+1][b.x];
                if(neighbor?.shape === this && !connected.has(neighbor)){
                    connected.add(neighbor); 
                    queue.push(neighbor); 
                } 
            }
            if(b.z > 0){
                let neighbor = occupied[b.z-1][b.y][b.x];
                if(neighbor?.shape === this && !connected.has(neighbor)){
                    connected.add(neighbor); 
                    queue.push(neighbor); 
                } 
            }
            if(b.z <frame.zHeight-1){
                let neighbor = occupied[b.z+1][b.y][b.x];
                if(neighbor?.shape === this && !connected.has(neighbor)){
                    connected.add(neighbor); 
                    queue.push(neighbor); 
                } 
            }
        }

        if(connected.size != this.blocks.length){ //a disconnected shape
            for(let b of this.blocks){
                frame.occupied[b.z][b.y][b.x] = null; 
                frame.spacesFilledInPlane[b.z].delete(b); 
            }
            let unconnected = this.blocks.filter(b => !connected.has(b)); 
            for(let b of this.blocks){
                b.erase(); 
            }
            this.blocks = Array.from(connected); 
            let s1 = new Shape(frame, this, true); 
            s1.lock(frame);
            frame.shapes[frame.shapes.indexOf(this)] = s1;
            let s2 = new Shape(frame, {blocks:unconnected}, true); 
            s2.lock(frame); 
            frame.shapes.push(s2); 
            s2.continuity(frame); //recursively check subShapes
        } 
    }
}
})(); 
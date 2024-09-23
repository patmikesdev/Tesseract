class Block{
    constructor([x, y, z], image, shape, frame){
        this.x = x; 
        this.y=y; 
        this.z = z; 
        this.image = image; 
        this.faces = [];
        this.shape = shape
        this.frame = frame;

        //RENDER BLOCK
        //ie create div for each face, insert them at appropriate location in document, stores each in faces[] property of block
       
        //grid lines are named differently than coordinate system, which uses zero-based indexing
        //this this function is helpful for code legibility
        let gridCoords = getGridStarts(x, y, z);  
       
        //Make two x faces
        let xPlane1 = frame.xAxis[x], xPlane2 = frame.xAxis[x+1];  
        let xFace1 = document.createElement('div');
        xFace1.classList.add('face');
        let xFace2 = document.createElement('div'); 
        xFace2.classList.add('face'); 
        xFace1.style.backgroundImage = xFace2.style.backgroundImage = image; 
        xFace1.style.gridColumnStart = xFace2.style.gridColumnStart = gridCoords.xFace_colStart;
        xFace1.style.gridRowStart = xFace2.style.gridRowStart =  gridCoords.xFace_rowStart;  
        // default span is one so don't need to worry about setting ends
        xPlane1.append(xFace1); 
        xPlane2.append(xFace2); 
        this.faces.push(xFace1, xFace2); 
        
        // Make two y Faces
        let yPlane1 = frame.yAxis[y], yPlane2 = frame.yAxis[y+1]; 
        let yFace1 = document.createElement('div');
        yFace1.classList.add('face');
        let yFace2 = document.createElement('div'); 
        yFace2.classList.add('face'); 
        yFace1.style.backgroundImage = yFace2.style.backgroundImage = image; 
        yFace1.style.gridColumnStart = yFace2.style.gridColumnStart = gridCoords.yFace_colStart;
        yFace1.style.gridRowStart = yFace2.style.gridRowStart =  gridCoords.yFace_rowStart;  
        yPlane1.append(yFace1); 
        yPlane2.append(yFace2); 
        this.faces.push(yFace1, yFace2); 
        
        // Make two z faces
        let zPlane1 = frame.zAxis[z], zPlane2 = frame.zAxis[z+1]; 
        let zFace1 = document.createElement('div');
        zFace1.classList.add('face');
        let zFace2 = document.createElement('div'); 
        zFace2.classList.add('face'); 
        zFace1.style.backgroundImage = zFace2.style.backgroundImage = image; 
        zFace1.style.gridColumnStart = zFace2.style.gridColumnStart = gridCoords.zFace_colStart;
        zFace1.style.gridRowStart = zFace2.style.gridRowStart =  gridCoords.zFace_rowStart;  
        zPlane1.append(zFace1); 
        zPlane2.append(zFace2); 
        this.faces.push(zFace1, zFace2);
    }//close constructor

    testMove(x, y, z){
        let n = this.frame.n;
        // argument values are not absolute coordinates, but a vector relative to current block position
        //returns [true, null] if move was succesful
        //if move goes out of bounds or runs into an occupied space, 
        //then returns an array with first element false, second element the object/boundary that was violated. 
        
        let signX = x >= 0 ? 1 : -1  
        if(this.x + x >= n){   //checking X boundaries
            return [false, this.frame.xAxis[n]]; 
        }
        if(this.x + x < 0){
            return [false, this.frame.xAxis[0]]; 
        }

        let signY = y >= 0 ? 1 : -1  
        if(this.y +y >= n){ //checking Y boundaries
 
            return [false, this.frame.yAxis[n]]; 
        }
        if(this.y + y< 0){

            return [false, this.frame.yAxis[0]]; 
        }

        let signZ = z >= 0 ? 1 : -1  
        if(this.z +z >= this.frame.zHeight){ //checking Z boundaries
            return [false, this.frame.zAxis[this.frame.zHeight]]; 
        }
        if(this.z +z < 0){

            return [false, this.frame.zAxis[0]]; 
        }

        // testing for occupation along path
        //tests in 2d plane defined by (at most 2 of 3) nonzero direction vectors
        //eg if move(2, 2, 0)
        //tests for blocks in 3x3 z plane starting at this.x, this.y ending at this.x+2, this.y+2; 
        if(x===0){
            for(let i = 0; i<=y*signY; i++){
                for(let j = 0; j<=z*signZ; j++){
                    let b;
                    if(b = this.frame.occupied[this.z+(j*signZ)][this.y+(i*signY)][this.x]){
                        return [false, b]; 
                    }
                } 
            }
        }
        else if(y===0){
                for(let i = 0; i<=x*signX; i++){
                    for(let j = 0; j<=z*signZ; j++){
                        let b;
                        if(b = this.frame.occupied[this.z+(j*signZ)][this.y][this.x+(i*signX)]){
                            return [false, b]; 
                        }
                    } 
                }
            }
        else { // z=== 0
            for(let i = 0; i<=x*signX; i++){
                for(let j = 0; j<=y*signY; j++){
                    let b;
                    if(b = this.frame.occupied[this.z][this.y+(j*signY)][this.x+(i*signX)]){
                        return [false, b]; 
                    }
                } 
            }
        }
        return [true, null]
    }

    move(x, y, z){
        let allowed = this.testMove(x, y, z); 
        if(!allowed[0]) return allowed; 
        this.x += x;
        this.y += y;
        this.z += z; 
       
        this.frame.xAxis[this.x].append(this.faces[0]); 
        this.frame.xAxis[this.x + 1].append(this.faces[1]); 
        this.frame.yAxis[this.y].append(this.faces[2]); 
        this.frame.yAxis[this.y+1].append(this.faces[3]); 
        this.frame.zAxis[this.z].append(this.faces[4]); 
        this.frame.zAxis[this.z+1].append(this.faces[5]); 
        this.faces[0].style.gridRowStart = this.faces[1].style.gridRowStart = `${this.z+1}`; 
        this.faces[0].style.gridColumnStart = this.faces[1].style.gridColumnStart = `${this.y+1}`; 
        this.faces[2].style.gridRowStart = this.faces[3].style.gridRowStart = `${this.z+1}`; 
        this.faces[2].style.gridColumnStart = this.faces[3].style.gridColumnStart = `${this.x+1}`; 
        this.faces[4].style.gridRowStart = this.faces[5].style.gridRowStart = `${this.x+1}`; 
        this.faces[4].style.gridColumnStart = this.faces[5].style.gridColumnStart = `${this.y+1}`; 
        return [true, null]; 
    }

    erase(){
        this.shape.blocks = this.shape.blocks.filter(b => b != this); //will return an empty array when deleting last block in shape.blocks;
        for(let f of this.faces){
            $(f).remove(); 
        }
        this.frame.occupied[this.z][this.y][this.x] = null; 
    }

    gameLost(){
        for(let f of this.faces){
            f.classList.add('finished'); 
        }
    }

}

//Helper function for the class, placed here because this is the only code that uses it
//Function not strictly necessary, but benefit to code legibility outweighs minor detriment of extra function call
function getGridStarts(x, y, z){
    // uses named grid lines feature of css Grid
    //these Gridline names are not identical to tesseract coordinate system though
    //this function is used to return gridRowStart and gridColumnStart values for all 6 faces of a block. really only need 6 values, as they're identical for paired faces...

    let gridCoords ={}
    //get row/col starts for x-faces 
    gridCoords.xFace_rowStart = `${z + 1}`;
    gridCoords.xFace_colStart =`${y + 1}`;
    
    //get row/col starts for y-faces 
    gridCoords.yFace_rowStart = `${z + 1}`;
    gridCoords.yFace_colStart =`${x + 1}`;
 
    //get row/col starts for z-faces 
    gridCoords.zFace_rowStart = `${x + 1}`;
    gridCoords.zFace_colStart =`${y + 1}`;
    return gridCoords; 
}
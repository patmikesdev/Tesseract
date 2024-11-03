# Tesseract

## Front End Web Development Demonstration, Capstone Project

### ‼️ NOTE: 
- This version of the project was constructed at a stage in my education prior to learning any back-end development. (6 month mark)
- Many features have been overhauled in later versions when the game was refactored into a modern Single Page Application using React. 
- As a class project, there were also some concessions made to specific requirements of the class at the time. For instance, while I would have preferred to eliminate any dependency on JQuery whatsoever, I was required to incorporate it to some extent. 

## Learning how to play the game: 
- please refer to the Tutorial page. 
- Note, you will have to click the continue dialog button that appears at the top of the screen to proceed through the full tutorial. 

## From original project README, Code Highlights
- Some basic API's for my main classes are included as part of about.html, describing the class methods.   
- Some of the more advanced examples of code I'd like to highlight include:  
### in Frame Class, line 280:
```js
this.removeLayers(fullPlanes).then(()=>{ this.finishFall();} 
```
- removeLayers() returns a promise object that is asynchronously resolved by the nested function secondaryFall(). This is the code that handles shapes and blocks falling down after an entire level has been filled and cleared. 
### Shape Class, line 390:
- `continuity(frame)` 
- This is a recursive method for dealing with the situation when part of a shape may have been erased by a level being cleared. This could result in multiple distinct new Shapes, that are determined by their contiguity. 
```js
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
```
### End of Game sequence, using try/catch clause and a custom event dispatch:
- The Game ends when the next shape to be inserted runs into an already occupied space. To trace the sequence of events, 
    - In Frame Class, finishFall() line 286
    ```js
    try{
        this.updateShapeQueue(); 
        this.resetPeriod(); 
    }
    catch(err){
        document.dispatchEvent(new CustomEvent('gameOver', {detail: 'Shape could not be placed'}));
    }
    ```
    - As part of updateShapeQueue(), the constructor new Shape() is called from Frame Class line 382; 
    - As part of Shape constructor, line 28 in Shape Class checks to see if a space it is trying to fill is already occupied
    ```js
    if(frame.occupied[z0][y0][x0]){....
    //Omitted for brevity
    ```
    - If it is, it set endGame to true, but finishes rendering the shape, and then throws an error in line 37
    ```js
    if(endGame) {throw new Error('Game Over')};
    ```
    - This error is caught by the above catch clause as part of the finishFall() method in Frame Class. At this point, a custom Event is dispatched to the document, which triggers the event handler registered for this custom 'gameOver' event in Controls.js, registerEventHandlers, line 7; 
    ```js
    $(document).off()
        .on('keydown', playerKeyed)
        .on('visibilitychange', ()=> {if(!frame.paused) playerKeyed({keyCode:17})})
        .on('gameOver', gameOver);   
    ```
    - gameOver is also the event handler, in Controls.js line 253, that executes the end of game sequence. 

				
### Y Orientation based keypad directions (yOrientation): 
- Problem arose when using a coordinate system based on the frame to implement movements of shapes. For exameple, in the initial default view, when a player presses the up arrow, this translates/rotates a shape towards the frame boundary at the back, furthest "into" the screen, which is what I wanted. However, once the frame itself is rotated, say by 180 deg, that frame boundary is now the one closest to the screen. If I did not adjust for this rotation, a player pressing 'up' would now bring a shape in the exact opposite direction as it did before. 
- Instead, I chose to take the viewing screen as the reference point. This way, pressing 'up' always translates/rotates a shape towards whatever boundary plane is furthest into the screen at that moment, regardless of how the entire frame is rotated. 
- See Frame.rotateTesseract(key), FrameClass.js line 206. keeps track of value of rotateY() transform of the entire frame, saved as 1 of 4 options in frame.yOrientation. 
- Then in Controls.js, line 9, arrows = [37, 38, 39, 40] is declared in a high level scope. 
    - If the user presses left, the proper command is passed to Shape.translateShape(key) by   
        ```js
        frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation)%4])
        ```
    - If the user presses up, the proper command is passed to Shape.translateShape(key) by   
        ```js
        frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+1)%4]) //notice +1
        ```
    - If the user presses right, the proper command is passed to Shape.translateShape(key) by   
        ```js
        frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+2)%4]) //notice +2
        ```
    - If the user presses down, the proper command is passed to Shape.translateShape(key) by   
        ```js
        frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+3)%4]) //notice +3
        ```
- To understand this better, it may be helpful to distinguish L/R/U/D as directions relative to the screen, and positive/negative X, positive/negativeY as directions relative to the frame. 
- So in the initial default view, when `frame.yOrientation` is 0, left points towards positive x, up points towards negative y, right points towards negative x, and down points towards positive y. 
- This table shows the mappings between the two systems of directions depending upon the value of frame.yOrientation.
    - yOrientation: 0, corresponds with rotateY(deg) arguments between 315-0-45 deg
        - left = +x, up = -y, right = -x, down = +y
    - yOrientation: 1, corresponds with rotateY(deg) arguments between 45-135 deg
        - left = -y, up = -x, right = +y, down = +x
    - yOrientation: 2, corresponds with rotateY(deg) arguments between 135-225 deg
        - left = -x, up = +y, right = +x, down = -y
    - yOrientation: 3, corresponds with rotateY(deg) arguments between 225-315 deg
        - left = +y, up = +x, right = -y, down = -x

- Thus, if the user presses, for instance, right, when frame.yOrientation = 2, the expression `arrows[(frame.yOrientation+2)%4]` evalutes to `arrows[0] = 37`
- This moves a block in the -x direction inside the frame, which is now pointing to the right side of the screen.  
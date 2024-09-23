Note to Graders On Capstone Rubric Requirements -


5+ Bootstrap components utilized:
	-Button Group (index.html <div class="btn-group-vertical"> on line 43)
	-Dropdown (game.html, <ul> on line 109), contains queue of upcoming shapes
	-Accordion (#1) (about.html, <div> on line 21) 
		(and #2) (about.html, <div> on line 142), containing APIs for custom Classes
	-Modal (#1 and #2) (controlsTutorial.html, <div> on line 15, & 48) explains object of game and functions of each of the control buttons 
		(#3 & #4) (game.html, <div id="levels"> on line 14 allows player to select difficulty settings, <div id="endGame"> on line 63, end of game sequence
	-Card (#1) (index.html <div> on line 16) holds custom rotating cube animation and name logo beneath
		(#2) (about.html <div> on line 115) holds example shape image, header is button to display answer to question
	-Toast (#1) (game.html, <div> on line 174) Pushes notification of updated score after a level has been filled
		(#2) (about.html <div> on line 123) Reveals answer to question in card-header

exception regarding Use of Bootstrap Grid
	-game.html is the one page that does not use a bootstrap grid container for the responsiveness of the page. This is because making the game truly responsive across all screen widths required precisely defining certain width and height ratios using px values. See FrameClass.js lines 58-64. 
		while (w0 % (n * 2) !== 0) { w0--;}
		....
		$tesseract.css({
            'width': `${w0}px`....
	n is the dimension of the grid, w0 is the width of the parent element to the frame. This code ensures that w0 is always a whole number multiple of n, so that the frame can precisely fit n blocks without extra gaps and spaces.  

Primary Color Palette
	Can be found in base.css
	--paletteRed: #FF7460;
    --paletteBlue: #00AEF8;
    --paletteGold: #FFE836;
	Gradients using these themes are used throughout the app, notably to style the control buttons and control pad graphics
	--bg0: radial-gradient(#1193c0, 75%, #100038); primary background gradient for body elements

Font Familes Used 
	Logo and Home Screen btn-group: Andale Mono
	All Other Sans Serif Font: bootstrap default sans serif
	Serif Font Type: Georgia, 'Times New Roman', Times, serif; is applied within .accordion-items in about.html

Use of JavaScript and JQuery methods
	There are any number of examples of the different rubric requirements to pick from. 
	Some basic API's for my main classes are included as part of about.html, describing the class methods. 
	Some of the more advanced examples of code I'd like to highlight include 
		-in Frame Class, line 280, this.removeLayers(fullPlanes).then(()=>{ this.finishFall();} 
			removeLayers() returns a promise object that is asynchronously resolved by the nested function secondaryFall(). This is the code that handles shapes and blocks falling down after an entire level has been filled and cleared. 
		-in Shape class line 390 continuity(frame) This is a recursive method for dealing with the situation when part of a shape may have been erased by a level being cleared. This could 		result in multiple distinct new Shapes, that are determined by their contiguity
		-End of Game sequence, using try/catch clause and a custom event dispatch; 
			The Game ends when the next shape to be inserted runs into an already occupied space. To trace the sequence of events, 
				+In Frame Class, finishFall() line 286
				    try{
						this.updateShapeQueue(); 
						this.resetPeriod(); 
					}
					catch(err){
						document.dispatchEvent(new CustomEvent('gameOver', {detail: 'Shape could not be placed'}));
					}
				+As part of updateShapeQueue(), the constructor new Shape() is called from Frame Class line 382; 
				+As part of Shape constructor, line 28 in Shape Class checks to see if a space it is trying to fill is already occupied
					 if(frame.occupied[z0][y0][x0]){....
				+If it is, it set endGame to true, but finishes rendering the shape, and then throws an error in line 37
					if(endGame) {throw new Error('Game Over')};
				+This error is caught by the above catch clause as part of the finishFall() method in Frame Class. At this point, a custom Event is dispatched to the document, which triggers the event handler registered for this custom 'gameOver' event in Controls.js, registerEventHandlers, line 7; 
					    $(document).off()
							.on('keydown', playerKeyed)
							.on('visibilitychange', ()=> {if(!frame.paused) playerKeyed({keyCode:17})})
							.on('gameOver', gameOver);   
				+gameOver is also the event handler, in Controls.js line 253, that executes the end of game sequence. 

				
		- yOrientation based keypad directions
			Problem arose when using a coordinate system based on the frame to implement movements of shapes. For exameple, in the initial default view, when a player presses the up arrow, this translates/rotates a shape towards the frame boundary at the back, furthest "into" the screen, which is what I wanted. However, once the frame itself is rotated, say by 180 deg, that frame boundary is now the one closest to the screen. If I did not adjust for this rotation, a player pressing 'up' would now bring a shape in the exact opposite direction as it did before. 
			Instead, I chose to take the viewing screen as the reference point. This way, pressing 'up' always translates/rotates a shape towards whatever boundary plane is furthest into the screen at that moment, regardless of how the entire frame is rotated. 

			see Frame.rotateTesseract(key), FrameClass.js line 206. keeps track of value of rotateY() transform of the entire frame, saved as 1 of 4 options in frame.yOrientation. 
			Then in Controls.js, line 9, arrows = [37, 38, 39, 40] is declared in a high level scope. 
			If the user presses left, the proper command is passed to Shape.translateShape(key) by 
				frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation)%4])
			If the user presses up, the proper command is passed to Shape.translateShape(key) by 
				frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+1)%4])
			If the user presses right, the proper command is passed to Shape.translateShape(key) by 
				frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+2)%4])
			If the user presses down, the proper command is passed to Shape.translateShape(key) by 
				frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+3)%4])
			
			To understand this better, it may be helpful to distinguish L/R/U/D as directions relative to the screen, and positive/negative X, positive/negativeY as directions relative to the frame. 
			So in the initial default view, when frame.yOrientation is 0, left points towards positive x, up points towards negative y, right points towards negative x, and down points towards positive y. 
			This table shows the mappings between the two systems of directions depending upon the value of frame.yOrientation.
			yOrientation: 0, corresponds with rotateY(deg) arguments between 315-0-45 deg
				left = +x, up = -y, right = -x, down = +y
			yOrientation: 1, corresponds with rotateY(deg) arguments between 45-135 deg
				left = -y, up = -x, right = +y, down = +x
			yOrientation: 2, corresponds with rotateY(deg) arguments between 135-225 deg
				left = -x, up = +y, right = +x, down = -y
			yOrientation: 3, corresponds with rotateY(deg) arguments between 225-315 deg
				left = +y, up = +x, right = -y, down = -x
			
			Thus, if the user presses, for instance, right, when frame.yOrientation = 2, 
			the expression arrows[(frame.yOrientation+2)%4] evalutes to arrows[0] = 37
			This moves a block in the -x direction inside the frame, which is now pointing to the right side of the screen.  




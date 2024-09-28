function registerEventHandlers(frame){
    let $pause = $('.optionPause'), $play = $('.optionPlay'), $translate = $('.optionTranslate'), $rotate = $('.optionRotate');
    let $view = $('.optionBtn.view'), $drop = $('.optionBtn.drop'); 
    $(document).off()
        .on('keydown', playerKeyed)
        .on('visibilitychange', ()=> {if(!frame.paused) playerKeyed({keyCode:17})})
        .on('gameOver', gameOver); 

    let arrows = [37, 38, 39, 40];

    //custom bootstrap event fired when dropdown opens and closes,
    $('.options').one('show.bs.dropdown', hideControls); 
    //indiviudal event handler functions
    $('.commandButton').off(); 
    $('.commandButton').on('click', playerClicked); 
    $('.commandButton').on('touch', playerClicked); 


    function playerKeyed(evt){
        let controlFrame = frame.controlFrame, rotateShape = frame.rotateShape;
        let key = evt.keyCode;
        let $pad; 
        switch(key){
            case 16://user pressed shift, toggles controls between translating/rotating active shape
                if(controlFrame) {return;}
                rotateShape = frame.rotateShape = !rotateShape;
                $translate.add($rotate).toggleClass('hidden2'); 
                $('.arrow').add('.rotator').add('.translate').toggleClass('hidden'); 
                $('.seven, .nine').toggleClass('zRot hidden'); 
                return;

            case 17: //user pressed control, toggles controls between manipulating shape/ manipulating frame
                // check if bs-dropdown for shapeQueue was left open, close if it was. 
                if ( $('.dropdown-menu').hasClass('show')) {
                    playerKeyed({keyCode:32}); 
                }
                controlFrame = frame.controlFrame = !controlFrame; 
                $('.spacer').children().toggle(); 
                $('.controls .five').toggleClass('hidden'); 
                $play.add($pause).add($view).add($drop).toggleClass('hidden2'); 
                frame.pause(); 
                if(controlFrame && rotateShape){ 
                    $('.seven').add('.nine').add('.rotator').addClass('hidden');
                    $('.translate').toggleClass('hidden'); 
                }
                if(!controlFrame && rotateShape) {
                    $('.seven').add('.nine').add('.rotator').removeClass('hidden');
                    $('.translate').toggleClass('hidden');
                }
                return;

            case 37: //user pressed left arrow
                if (!controlFrame) {
                    if(!rotateShape){                    
                        translateIndexCube('left', 'translateX(-35px)'); 
                        frame.shapes[0].translateShape(frame, arrows[frame.yOrientation]);
                    }
                    else{
                        rotateIndexCube("left", 'top', 'rotateZ(-90deg)', 'rotateZ(-45deg)'); 
                        frame.shapes[0].rotateShape(frame, arrows[(frame.yOrientation)%4]);
                    }
                }
                else{ 
                    frame.rotateTesseract(37);
                }
                $pad = $('.padButton.four').addClass('pressedLeft'); 
                setTimeout( ()=>{$pad.removeClass('pressedLeft')}, 200); 
                return;

            case 38: //user pressed up arrow
                if (!controlFrame) {
                    if(!rotateShape){
                        translateIndexCube('back', 'translateZ(-35px)'); 
                        frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+1)%4]);
                    }
                    else{
                        rotateIndexCube('up', 'front', 'rotateX(90deg)', 'rotateZ(-90deg)'); 
                        frame.shapes[0].rotateShape(frame, arrows[(frame.yOrientation+1)%4]); 
                    }
                }
                else{ 
                    frame.rotateTesseract(38);
                }
                $pad = $('.padButton.two').addClass('pressedUp'); 
                setTimeout( ()=>{$pad.removeClass('pressedUp')}, 200); 
                return;

            case 39: //user pressed right arrow
                if (!controlFrame) {
                    if(!rotateShape){
                        translateIndexCube('right', 'translateX(35px)'); 
                        frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+2)%4]);
                    }
                    else{
                        rotateIndexCube('right', 'left', 'rotateZ(90deg)', 'rotateZ(-45deg)');  
                        frame.shapes[0].rotateShape(frame, arrows[(frame.yOrientation+2)%4]); 
                    }
                }
                else{ 
                    frame.rotateTesseract(39);
                }
                $pad = $('.padButton.six').addClass('pressedLeft'); 
                setTimeout( ()=>{$pad.removeClass('pressedLeft')}, 200); 
                return;

            case 40: //user pressed down arrow
                if (!controlFrame) {
                    if(!rotateShape){
                        translateIndexCube('front', 'translateZ(35px)'); 
                        frame.shapes[0].translateShape(frame, arrows[(frame.yOrientation+3)%4]);
                    }
                    else{
                        rotateIndexCube('down', 'top', 'rotateX(-90deg)', 'rotateZ(-45deg)'); 
                        frame.shapes[0].rotateShape(frame, arrows[(frame.yOrientation+3)%4]);
                    }
                }
                else{ 
                    frame.rotateTesseract(40);
                }
                $pad = $('.padButton.eight').addClass('pressedUp'); 
                setTimeout( ()=>{$pad.removeClass('pressedUp')}, 200); 
                return;

            case 49: //user pressed 1,
                if(controlFrame || !rotateShape){return;}
                else{
                    rotateIndexCube('Counter', 'left', 'rotateY(90deg)', 'rotateZ(-45deg)');
                    frame.shapes[0].rotateShape(frame, 49);
                    }
                $pad = $('.padButton.seven').addClass('pressedClock'); 
                setTimeout( ()=>{$pad.removeClass('pressedClock')}, 200); 
                return; 

            case 50: //user pressed 2, 
                if(controlFrame || !rotateShape) {return;}
                else{
                    rotateIndexCube('Clockwise', 'front', 'rotateY(-90deg)', 'rotateZ(-45deg)');
                    frame.shapes[0].rotateShape(frame, 50);
                }
                $pad = $('.padButton.nine').addClass('pressedClock'); 
                setTimeout( ()=>{$pad.removeClass('pressedClock')}, 200);       
                return;

            case 32: // user pressed space, drop shape all the way down or display shapeQueue
                if(controlFrame){
                    if(!evt.clicked){
                        $view.trigger('click');
                    }
                    $view.trigger('blur'); 
                    return; 
                } 
                if(rotateShape) return; 
                let h = frame.shapes[0].height; 
                for(let x = 0; x<h; x++){
                    frame.shapes[0].translateShape(frame, 50); 
                }
                return; 

            //Debugging Methods, LEFT DELIBERATELY IN CASE OF LATER UPDATES TO CODE
            // case 80: //user pressed p for pausing game; 
            //     frame.pause(); 
            //     return; 
            // case 75: //used pressed 'k', toggles which block in active shape is 'keystone'
            //     for (let face of frame.shapes[0].blocks[0].faces) {
            //         face.classList.remove('keyStone');
            //     }
            //     frame.shapes[0].blocks.push(frame.shapes[0].blocks.shift());
            //     for (let face of frame.shapes[0].blocks[0].faces) {
            //         face.classList.add('keyStone');
            //     }
            //     return;

            // case 79: //pressed o, for printing out positions of all occupied spaces
            //     // console.log('o pressed'); 
            //     for(let i=0; i<frame.occupied.length; i++){
            //         for(let j=0; j<frame.occupied[i].length; j++){
            //             for(let k=0; k<frame.occupied[i][j].length; k++){
            //                 if(frame.occupied[i][j][k]) console.log(i +', ' + j + ', ' + k);
            //             }
            //         }
            //     }
            //     return; 
            case 66: //user pressed b for blocks
                console.log(document.querySelectorAll('.face')); 
                return; 
            case 67: //user pressed c for clearing, takes an iterable collection of integers
                frame.removeLayers([0]); 
                return; 
            case 70: //user pressed f for logging frame
                console.log(frame); 
                return; 
            // case 81: //user pressed q for logging shapeQueue
            //     console.log(frame.shapeQueue); 
            //     return; 
            // case 69: //user pressed e to trigger end of game sequence. 
            //     document.dispatchEvent(new CustomEvent('gameOver', {detail: 'Shape could not be placed'})); 
            //     return; 

        }//close switch
    }

    function playerClicked(evt){
        playerKeyed({keyCode: parseInt(evt.target.dataset.key), clicked: true});
        $(window).trigger('focus'); 
    }

    function hideControls(evt){
        $('.controls').toggleClass('hidden2');
        $(evt.currentTarget).one('hidden.bs.dropdown', showControls); 
    }
    function showControls(evt){
        $('.controls').toggleClass('hidden2');
        $(evt.currentTarget).one('show.bs.dropdown', hideControls); 
    }
    function translateIndexCube(direction, translation){
        let $arrow = $(`.controls .${direction}Arrow`).addClass('activeArrow');
        let $otherArrows = $(`.controls .arrow`).not($arrow).hide(); 
        let $cube = $('.indexCube').toggleClass('animatable'); 
        let $indexFace = $cube.children(`.${direction}`).toggleClass('activeFace'); 
        let $otherFaces = $('.indexFace').not($indexFace).toggleClass('inactiveFace')
        $cube.css('transform',`${translation}`); 
        setTimeout(()=> {
            $arrow.removeClass('activeArrow'); 
            $indexFace.toggleClass('activeFace');
            $otherFaces.toggleClass('inactiveFace'); 
            $cube.toggleClass('animatable').css('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)');
            $otherArrows.show(); 
        }, 200); 
    }

    function rotateIndexCube(direction, face, cubeRotation, arrowRotation){
        //solution where I hardcoded initial transforms of rotation arrows, because error was coming from trying to access transform property of arrow while it was hidden, (I.e. pressed left, which hid other arrows, then pressed up before the left animation had finished and up had hidden class removed)  
        let initTransforms = {
            left: 'translateX(-50px) translateY(-30px) rotateZ(90deg)', 
            right: 'translateX(50px) translateY(-30px) rotateY(180deg) rotateZ(90deg)', 
            up: 'rotateZ(-180deg) rotateY(90deg) translateY(50px) translateX(-30px)',
            down: 'rotateY(90deg) translateY(50px) translateX(-30px)', 
            Counter: 'translateZ(150px) rotateX(60deg) rotateZ(20deg)', 
            Clockwise: 'translateZ(150px) rotateX(60deg) rotateZ(20deg) rotateY(180deg)'
        }
        let $rotator = $(`.controls .rotationArrow${direction}`).addClass('activeRotator animatable');
        let $arrowTransform = initTransforms[direction];  
        $rotator.css('transform', $arrowTransform + `${arrowRotation}`); 
        let $otherArrows = $(`.controls .rotator`).not($rotator).hide(); 
        let $cube = $('.indexCube').toggleClass('animatable'); 
        let $indexFace = $cube.children(`.${face}`).toggleClass('activeFace'); 
        let $otherFaces = $('.indexFace').not($indexFace).toggleClass('inactiveFace')
        $cube.css('transform',`${cubeRotation}`); 
        setTimeout(()=> {
            $rotator.removeClass('activeRotator animatable').css('transform', $arrowTransform); 
            $indexFace.toggleClass('activeFace');
            $otherFaces.toggleClass('inactiveFace'); 
            $cube.toggleClass('animatable').css('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)');
            $otherArrows.show(); 
        }, 300); 
    }

    function gameOver(evt){
        clearTimeout(frame.nextStep); 
        if(frame.shapes[0].shadow){ //used when demonstrating process, if actual game Over, shadow shape won't be created. 
            for(let b of frame.shapes[0].shadow.blocks){
                b.erase(); 
            }
        }
      
        let tL = anime.timeline({
            complete: function(anim){
                $('#finalScore').text(frame.score)
                let finale = new bootstrap.Modal(document.getElementById('endGame')); 
                finale.show(); 
            }
        }); 
        for(let s of frame.shapes){
            for(let b of s.blocks){
                b.gameLost(); 
                tL.add({
                        targets: b.faces, 
                        background: ['#f0ffff', '#111111'],
                        easing: 'linear', 
                        duration: 200
                    }, '-=150')
            } 
        }
        $(document).off(); 
        $('.commandButton').off(); 
    }
}
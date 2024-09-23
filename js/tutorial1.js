$(()=>{
    let defaultConfigs = {
        n: 8, 
        period: 1000, 
        templates: [[[1,1,0]]], //just needed some shape template to initialize the frame
        square: false, 
        parent1: '#parent', 
        parent2: '#tesseract'
    }

    let frame = new Frame(null, defaultConfigs); 
    
    registerEventHandlers(frame); 

    let tut0 = document.getElementById('tutorial0')
    let modal0 = new bootstrap.Modal(tut0); 
    let tut1 = document.getElementById('tutorial1')
    let modal = new bootstrap.Modal(tut1); 
    modal0.show(); 
    $(tut0).one('hidden.bs.modal',()=> modal.show()); 
    
    //function for showing modal again after it's been hidden to show position of button on screen. 
    let $nextDialogBtn = $('.nextDialog')
        .hide()
        .on('click', function() { modal.show(); $nextDialogBtn.slideUp(); })

    $('.returnHome').hide(); 

    //function for toggling between two phases of each modal dialog
    $('.phaseShift').on('click', phaseShift); 
    function phaseShift(evt){
        $('.phase1').add('.phase2').toggleClass('hidden2'); 
    }
    
    //function for loading second dialog content
    $(tut1).one('hidden.bs.modal', stage2); 

    function stage2(){
        $('.shift').addClass('revealed'); 
        $('#defaultCard img').attr('src', '../images/optionPause.png'); 
        $('#toggledCard img').attr('src', '../images/optionPlay.png'); 
        //update descriptions
        $('.description.phase1').html(`<p>Keyboard Trigger: Ctrl Key</p>
            <p>This button pauses the falling shape, and gives the user control over the orientation of the frame to allow alternate viewing angles, as indicated by the appearance of arrows along the sides of the frame.</p>`); 
        $('.description.phase2').html(`<p>Keyboard Trigger: Ctrl Key</p>
            <p> Pressing the button when the play icon is displayed resumes the fall and returns to normal control over falling shape instead of the frame viewing angle. </p>`); 
        $nextDialogBtn.slideDown(); 
        $(tut1).one('hidden.bs.modal', stage3); 
    }

    function stage3(){
        $('.pause').addClass('revealed'); 
        $('#defaultCard img').attr('src', '../images/optionDrop.png'); 
        $('#toggledCard img').attr('src', '../images/optionViewQueue3.png'); 
        //update descriptions
        $('.description.phase1').html(`<p>Keyboard Trigger: Space Bar</p> <p>Toggled By: Pause/Play Button </p>
            <p>When a shape is actively falling, pressing this yellow/blue down arrow will bring the shape down as far as it can fall from its current position. <br> There will still be one period of time left allowing movement into a final position before it is fully locked. NOTE; Only available while game is NOT paused and shape is NOT in rotation mode</p>`); 
        $('.description.phase2').html(`<p>Keyboard Trigger: Space Bar</p> <p>Toggled By: Pause/Play Button </p>
            <p>This button allows you to view the queue of the next 3 upcoming shapes to appear. NOTE; Only available to view while game is paused. </p>`); 
        $nextDialogBtn.slideDown(); 
        $(tut1).one('hidden.bs.modal', stage4); 
    }

    function stage4(){
        $('.drop').addClass('revealed'); 
        $('.view').removeClass('hidden3'); 
        $('.modal-header h3').text('Directional Control Pad Buttons'); 
        $('.modal-footer .phase2').text('View the Control Pad'); 
        $('#defaultCard img').attr('src', '../images/controls1.png').addClass('imgSized') 
        $('#toggledCard img').attr('src', '../images/controls2.png').addClass('imgSized') 
        $('.description.phase1').html(`<p>Keyboard Triggers: L/R/U/D Arrows</p>
            <p>This is the basic control pad. The red buttons correspond to the up and down keys, the blue to left and right keys. In general, 'up' will refer to the direction IN to the viewing screen, 'down' will be OUT of the screen. Other than dropping to the bottom, players cannot move a shape along the vertical axis of 'falling'.</p>`); 
        $('.description.phase2').html(`<p>Keyboard Triggers: #1 and #2</p>
            <p>When the controls are toggled to ROTATE the shape, two additional yellow buttons will appear at the bottom of the control pad. While a player still cannot MOVE a shape in the vertical direction, they CAN ROTATE the shape clockwise or counterclockwise about this 'falling' axis. </p>`); 
        $nextDialogBtn.slideDown(); 
        $(tut1).one('hidden.bs.modal', stage5); 
    }

    function stage5(){
        $('.controls').fadeTo(1200, 1); 
        $('.modal-header h3').text('Overlaid Index Cube'); 
        $('.modal-footer .phase2').text('View the overlaid Index Cube'); 
        $('#defaultCard img').attr('src', '../images/controls3.png') 
        $('#toggledCard img').attr('src', '../images/controls4.png') 
        $('.description.phase1').html(`<p>Keyboard Triggers: L/R/U/D Arrows</p>
            <p>The index-cube graphic tracks the L/R/U/D directions in which the active shape will move as the viewing angle of the whole frame is adjusted. Perpendicular Red/Blue arrows indicate normal L/R/U/D motion control is in effect, as opposed to shape rotation.</p>`); 
        $('.description.phase2').html(`<p>Keyboard Triggers: L/R/U/D Arrows, #1 & #2</p>
            <p>When the controls are toggled to ROTATE the shape (for instance by pressing shift on a keyboard), circular arrows indicating the possible directions of rotation are displayed coming out of the index cube.</p>`); 
        $nextDialogBtn.slideDown(); 
        $(tut1).one('hidden.bs.modal', stage6); 
    }

    function stage6(){
        $('.padButton.five').fadeTo(1200, 1); 
        $('.modal-header h3').text('Directional frame of reference'); 
        $('.modal-footer .phase2').text('View the overlaid Directions graphic'); 
        $('#defaultCard img').attr('src', '../images/controls5.png');
        $('#defaultCard .card-header').text('Index Cube Tracking'); 
        $('#toggledCard img').attr('src', '../images/directions.png');
        $('#toggledCard .card-header').text('Directions'); 
        $('.description.phase1').html(`<p>Relative Directions</p>
            <p>As the viewing angle of the entire frame is rotated beyond certain critical points, the meanings of L/R/U/D will respond accordingly in order to maintain a consistent frame of reference, where 'Up' ALWAYS corresponds to that direction most closely aligned with a projection directly into the screen.</p>`); 
        $('.description.phase2').html(`<p>This crossed arrow graphic will flash on top of the frame when the viewing angle has changed enough to require shifting the directions. As usual, the index cube faces on the control pad will also be aligned with any new orientation.</p>`); 
        $nextDialogBtn.slideDown(); 
        $(tut1).one('hidden.bs.modal', stage7); 
    }

    function stage7(){
        $('.directions').removeClass('hidden').css('opacity', 0).fadeTo(1000, 1); 
        $('.modal-header h3').text('Shape Rotations'); 
        $('.modal-footer .phase2').text('Finished'); 
        $('#defaultCard img').attr('src', '../images/keystone1.png') ; 
        $('#defaultCard .card-header').text('Initial'); 
        $('#toggledCard img').attr('src', '../images/keystone2.png') ; 
        $('#toggledCard .card-header').text('Rotated Up'); 
        $('.description.phase1').html(`<p>Understanding Rotations</p>
            <p>Each shape has a 'Keystone' which is the single block, outlined with a gold border, around which all the other blocks in the shape will rotate.</p>`); 
        $('.description.phase2').html(`<p>The Keystone will always start at the bottom of the shape, so any initial L/R/U/D rotation can be thought of as the rest of shape being 'toppled' in that direction. Up is like being toppled in towards the screen, down is like being toppled in the direction out of the screen, etc.  </p>`); 
        $nextDialogBtn.slideDown(); 
        $(tut1).one('hidden.bs.modal', finish); 
    }

    function finish(){
        $nextDialogBtn.off('click'); 
        $('.returnHome').slideDown(); 
    }
    
})
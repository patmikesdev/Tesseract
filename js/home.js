$( ()=>{
    let i=0; 

    //build faces of cube, with background image of grid items properly aligned
    let $face = $('.face'); 
    let $face2 = $('.face2'); 
    let items1 = [];
    let items2 = [];
    for (let face of $face){
        for(let x=0; x<10; x++){
            for(let y=0; y<10; y++){
                let item = document.createElement('div'); 
                $(item).addClass('item item1').css('background-position', `left ${-20*y}px top ${-20*x}px`); 
                face.append(item); 
                items1.push(item)
            }
        }
    }
    for (let face of $face2){
        for(let x=0; x<10; x++){
            for(let y=0; y<10; y++){
                let item2 = document.createElement('div'); 
                $(item2).addClass('item item2').css('background-position', `left ${-20*y}px top ${-20*x}px`); 
                face.append(item2); 
                items2.push(item2); 
            }
        }
    }

    //2 helper functions for cycling which layer is on top of cube, and what the background images are
    function faceCycle(){
        $face2.css('z-index', 40); 
        $face.css('z-index', 30); 
        i = (i+1)%6;
        for(let item of items1){
            anime.set(item, {'background-image': `var(--gradient${i})`, 'opacity': 1})
        }
    }
    function face2Cycle(){
        $face.css('z-index', 40); 
        $face2.css('z-index', 30); 
        i = (i+1)%6;
        for(let item of items2){
            anime.set(item, {'background-image': `var(--gradient${i})`, 'opacity': 1})
        }
    }

    //ANIMATION TIMELINE, USING LIBRARY anime.js
    let rotation = {
        targets: '.cubeParent1', 
        rotateY: 360,
        easing: 'linear', 
        duration: 12000
    }

    function animationBuilder(t, f, cBegin, cComplete){ //for creating individual animations of cube faces
        return {
            changeBegin: cBegin, 
            targets: t, 
            translateZ: [
                {value: 20, easing: 'easeOutSine', duration: 600},
                {value: 0, easing: 'easeInOutQuad', duration: 600}
              ],
            opacity: [
                {value: 1, easing: 'linear', duration: 600},
                {value: 0, easing: 'linear', duration: 2000}
            ],
            delay: anime.stagger(200, {grid: [10, 10], from: f}),
            changeComplete: cComplete
        }
    }

 
    let timeline = anime.timeline({loop: true});
    timeline.add(rotation); 
    timeline.add(animationBuilder('.top2 .item2', 'first', faceCycle ), 1)
    timeline.add(animationBuilder('.back2 .item2', 'first' ), 1)
    timeline.add(animationBuilder('.right2 .item2', 'first' ), 1)
    timeline.add(animationBuilder('.bottom2 .item2', 'first'), 900); 
    timeline.add(animationBuilder('.left2 .item2', 'first'), 900); 
    timeline.add(animationBuilder('.front2 .item2', 'first'), 900); 
    timeline.add(animationBuilder('.left .item1', 'last', face2Cycle ), 6100);
    timeline.add(animationBuilder('.bottom .item1', 'last'), 6100);
    timeline.add(animationBuilder('.front .item1', 'last'), 6100);
    timeline.add(animationBuilder('.top .item1', 'last'), 6800);
    timeline.add(animationBuilder('.back .item1', 'last' ), 6800);
    timeline.add(animationBuilder('.right .item1', 'last' ), 6800);

    //EVENT LISTENERS

    $('.btn img').one('mouseover', btnHoverOn)

    function btnHoverOn(evt){
        timeline.pause(); 

        $(evt.target)
            .one('mouseout', btnHoverOff);

        anime({
            targets: evt.target, 
            scale: 1.2, 
            easing: 'linear', 
            duration: 300
        })
    }
    function btnHoverOff(evt){
        timeline.play()
        let oldSrc = $(evt.currentTarget)
            .one('mouseover', btnHoverOn)
        anime({
            targets: evt.target, 
            scale: 1.0, 
            easing: 'linear', 
            duration: 300
        })
    }
})
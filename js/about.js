$(()=>{

    //will need to come back and figure code for how to deal with all the resizes needed. Can probably use some form of $clear()on .miniFrame 
    // then would check to see if it's showing, if it is, recreate frame, if not, reattach event listener

    //Animate process of constructing a miniature frame
    let miniFrameConfigs = {
        n: 6, 
        period: 900, 
        templates: [[[1,1,1]]],
        minisRequested: false,
        square: false, 
        parent1: '.frameParent1', 
        parent2: '.miniFrame'
    }

    let miniFrame; 
    $('#frameInfo').one('shown.bs.collapse', buildMiniFrame); 
    let timeline = anime.timeline({direction: 'normal'});
    
    //enable toast feature in #shapeInfo
    let toast = new bootstrap.Toast(document.querySelector('.toast'), {animation: true, autohide: true, delay:10000}); 
    $('#comboQuestion').on('click', ()=>{toast.show();}); 

    // helper function for building miniature frame
    function buildMiniFrame(){
        miniFrame = new Frame(null, miniFrameConfigs); 
        let w0 = parseInt(miniFrame.zAxis[0].style.height)/2; 
        let h0 = parseInt(miniFrame.yAxis[0].style.height)/2; 
        for(let p of miniFrame.zAxis){
            let $plane = $(p)
                $plane.css({'transform':'none', 'background': 'var(--paletteRedGradient)', 'opacity': '0'}); 
            }
        for(let p of miniFrame.yAxis){
            let $plane = $(p)
                $plane.css({'transform': 'none', 'background': 'var(--paletteGoldGradient)', 'opacity': '0'}); 
            }
        for(let p of miniFrame.xAxis){
            let $plane = $(p)
                $plane.css({'transform':'none', 'background': 'var(--paletteBlueGradient)', 'opacity': '0'}); 
            }
    
        timeline.add({
            targets: miniFrame.zAxis,
            keyframes:[
                {translateZ: `${w0}`, duration: 300},
                {translateY: `-${w0}`, duration: 300},
                {opacity: 0.4, duration: 300, delay: 300},
                {rotateX: '90deg', duration: 300, delay: 300}, 
                {opacity: 0.05, duration: 1500, delay: 600}
            ],
            easing: 'linear', 
            delay: anime.stagger(200)
        })
        timeline.add({
            targets: miniFrame.yAxis,
            keyframes:[
                {translateZ: `${w0*2}`, duration: 300},
                {opacity: 0.4, duration: 300, delay: 300},
                {rotateY: `90deg`, duration: 300, delay: 300},
                {opacity: 0.05, duration: 1500, delay: 600}
            ],
            easing: 'linear', 
            delay: anime.stagger(200)
        }, 4000)
        timeline.add({
            targets: miniFrame.xAxis,
            keyframes:[
                {translateZ: `${w0*2}`, duration: 300},
                {opacity: 0.4, duration: 300, delay: 300},
                {rotateY: `90deg`, duration: 300, delay: 300},
                {opacity: 0.05, duration: 1500, delay: 600}
            ],
            easing: 'linear', 
            delay: anime.stagger(200)
        }, 6000)
        $('.miniFrame').on('click', ()=>{timeline.restart()}); 
    
    }

    //EVENT LISTENERS


})
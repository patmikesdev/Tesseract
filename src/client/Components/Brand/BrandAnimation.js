/*global $, anime */
//that line tells ESlint that these variables are defined outside the scope of the bundle
//adapted from more complex version that was too computationally expensive

export default function brandAnimation() {
    let i = Math.floor(Math.random()*6);
    let faces = document.querySelectorAll('.face')
    let faces2 = document.querySelectorAll('.face2')
    let $faces = $('.face');
    let $faces2 = $('.face2');

    function faceCycle() {
        $faces2.css('z-index', 40);
        $faces.css('z-index', 30);
        i = (i + 1) % 6;
        for (let face of faces) {
            anime.set(face, { 'background-image': `var(--gradient${i})`, 'opacity': 1 })
        }
    }

    function face2Cycle() {
        $faces.css('z-index', 40);
        $faces2.css('z-index', 30);
        i = (i + 1) % 6;
        for (let face of faces2) {
            anime.set(face, { 'background-image': `var(--gradient${i})`, 'opacity': 1 })
        }
    }

    let rotation = {
        targets: '.cubeParent1',
        rotateY: 360,
        easing: 'linear',
        duration: 12000
    }


    function animationBuilder(t, cBegin, cComplete) { //for creating individual animations of cube faces
        return {
            changeBegin: cBegin,
            targets: t,
            opacity: [
                { value: 1, easing: 'linear', duration: 600 },
                { value: 0, easing: 'linear', duration: 2000 }
            ],
            changeComplete: cComplete
        }
    }

    let timeline = anime.timeline({ loop: true });
    timeline.add(rotation);
    timeline.add(animationBuilder('.face2', faceCycle), 1)
    timeline.add(animationBuilder('.face', face2Cycle), 6100)
}
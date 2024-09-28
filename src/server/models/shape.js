export default function shapeClosure(game) {
    let {zHeight, n, templates, vacate, occupy, testOccupied, occupied} = game;
    vacate = vacate.bind(game);
    occupy = occupy.bind(game);
    testOccupied = testOccupied.bind(game);

    return class Shape {
        constructor(template) {
            this.falling = true;
            this.coords = [];
            for (let t of template) {
                this.coords.push([t[0], t[1], t[2]]);
            }
        }
        assignOwnership(ownerSocket, otherSocket, me, them) {
            this.ownerSocket = ownerSocket;
            this.otherSocket = otherSocket;
            this.owner = me;
            this.other = them;
        }

        resumeFalling() {
            this.falling = true;
            this.skipNext = true;
        }

        pause() {
            this.falling = false;
        }

        checkShapeLoaded() {
            //make sure shape is loaded for both players before trying to move it!
            if (this.owner.mineLoaded && this.other.theirsLoaded) {
                return true;
            }
            return false;
        }
    };
}

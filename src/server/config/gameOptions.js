let demoTemplates = [];
demoTemplates[0] = [
    [0, 0, 2],
    [0, 0, 1],
    [1, 0, 2],
    [1, 0, 1],
    [0, 1, 2],
    [0, 1, 1],
    [1, 1, 2],
    [1, 1, 1],
]; //2x2x2 cube

let easyTemplates = [];
easyTemplates[0] = [
    [1, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
]; //2x2 square
easyTemplates[1] = [
    [1, 1, 0],
    [1, 1, 1],
]; //2x1 rect
// easyTemplates[2] = [[0,0,2], [0,0,1], [1,0,1], [1,0,0]]; //2-d stagger
easyTemplates[2] = [
    [1, 1, 0],
    [1, 1, 1],
    [2, 1, 1],
    [2, 1, 2],
]; //2-d stagger
easyTemplates[3] = [[1, 1, 1]]; //rudimentary 1x1 cube

let mediumTemplates = [];
mediumTemplates[0] = [[1, 1, 1]]; //rudimentary 1x1 cube
mediumTemplates[1] = [
    [1, 1, 0],
    [2, 1, 0],
    [1, 2, 0],
    [1, 1, 1],
    [1, 1, 2],
]; //double corner
mediumTemplates[2] = [
    [1, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 2],
    [1, 2, 1],
    [1, 2, 2],
]; //Y branch
mediumTemplates[3] = [
    [1, 1, 0],
    [1, 1, 1],
]; //2x1 rect
mediumTemplates[4] = [
    [1, 1, 0],
    [2, 1, 0],
    [2, 1, 1],
    [2, 1, 2],
    [1, 1, 2],
    [0, 1, 2],
    [0, 1, 1],
    [0, 1, 0],
]; //hole
mediumTemplates[5] = [
    [1, 1, 0],
    [1, 2, 0],
    [1, 1, 1],
    [1, 1, 2],
]; //2-d L
mediumTemplates[6] = [
    [1, 1, 0],
    [1, 1, 1],
    [2, 1, 1],
    [2, 1, 2],
]; //2-d stagger
mediumTemplates[7] = [
    [1, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
]; //simple right angle
mediumTemplates[7] = [
    [1, 1, 0],
    [1, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
    [0, 0, 1],
    [0, 1, 1],
]; //2x2x2 cube

let hardTemplates = [];
hardTemplates[0] = [[1, 1, 1]]; //rudimentary 1x1 cube
hardTemplates[1] = [
    [1, 1, 0],
    [2, 1, 0],
    [1, 2, 0],
    [1, 1, 1],
    [1, 1, 2],
]; //double corner
hardTemplates[2] = [
    [1, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 2],
    [1, 2, 1],
    [1, 2, 2],
]; //Y branch
hardTemplates[3] = [
    [1, 1, 0],
    [1, 1, 1],
]; //2x1 rect
hardTemplates[4] = [
    [1, 1, 0],
    [2, 1, 0],
    [2, 1, 1],
    [2, 1, 2],
    [1, 1, 2],
    [0, 1, 2],
    [0, 1, 1],
    [0, 1, 0],
]; //hole
hardTemplates[5] = [
    [1, 1, 0],
    [1, 2, 0],
    [1, 1, 1],
    [1, 1, 2],
]; //2-d L
hardTemplates[6] = [
    [1, 1, 0],
    [1, 1, 1],
    [2, 1, 1],
    [2, 1, 2],
]; //2-d stagger
hardTemplates[7] = [
    [1, 1, 0],
    [0, 1, 0],
    [0, 2, 0],
    [1, 1, 1],
    [0, 1, 1],
    [0, 2, 1],
    [1, 1, 2],
    [0, 1, 2],
    [0, 2, 2],
]; //sofa
hardTemplates[8] = [
    [2, 0, 0],
    [2, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 2],
    [0, 1, 2],
]; //corkscrew
hardTemplates[9] = [
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 2],
]; //3x1 rect
hardTemplates[10] = [
    [1, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
]; //simple right angle
hardTemplates[11] = [
    [1, 1, 0],
    [1, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
    [0, 0, 1],
    [0, 1, 1],
]; //2x2x2 cube
hardTemplates[12] = [
    [1, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
]; //2x2 square
hardTemplates[13] = [
    [2, 0, 0],
    [2, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 2, 1],
    [2, 2, 1],
    [2, 2, 0],
]; //hook
hardTemplates[14] = [
    [1, 1, 0],
    [1, 1, 1],
    [2, 1, 1],
    [1, 2, 1],
    [1, 1, 2],
]; //jack shape

let shapeDifficulties = {
    Demo: demoTemplates,
    Easy: easyTemplates,
    Medium: mediumTemplates,
    Hard: hardTemplates,
};
let gridSizes = {
    Small: 6,
    Medium: 8,
    Large: 10,
    XL: 12,
};
let speeds = {
    ExtraSlow: 1500,
    Slow: 1200,
    Medium: 1000,
    Fast: 800,
};

let colors = {
    Red: 'blockRed',
    Yellow: 'blockYellow',
    Green: 'blockGreen',
    Blue: 'blockBlue',
    Purple: 'blockPurple',
};

export default function getOptions({
    shapes,
    gridSize,
    speed,
    p1Color,
    p2Color,
}) {
    return {
        templates: shapeDifficulties[shapes],
        n: gridSizes[gridSize],
        speed: speeds[speed],
        p1BG: colors[p1Color],
        p2BG: colors[p2Color],
    };
}

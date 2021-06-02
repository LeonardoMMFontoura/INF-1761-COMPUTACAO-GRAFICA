const myCanvas = document.getElementById('myCanvas');


var gl; // contexto grafico do WebGl2


function main() {
    gl = initGL(myCanvas);
}

window.onload = function(e){
    main();
};
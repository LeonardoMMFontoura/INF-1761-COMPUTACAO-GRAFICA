var canvas = document.getElementById('myCanvas');
var message = document.getElementById('message');


var gl; // contexto grafico do WebGl2


const vShaderSrc = document.getElementById("vShaderSrc").text;
const fShaderSrc = document.getElementById("fShaderSrc").text;


var program; // programa shader in GSLS
var vShader; 
var fShader;


var eye = [0.,0.,3.];


var old = 0;


function main() {
    initGL();
    //compilando shaders e criando o programa
    vShader = createShader(vShaderSrc,gl.VERTEX_SHADER);
    fShader = createShader(fShaderSrc,gl.FRAGMENT_SHADER);
    createProgram(vShader,fShader);
    setProgramVariables();

    //Criando e desenhando a cena
    redraw(0);
}


function upCamera(){
    var Rot  = mat4.create();
    mat4.fromYRotation(Rot,3.14/180);
    var x = Rot[0]*eye[0]+Rot[4]*eye[1]+Rot[8]*eye[2]; 
    var y = Rot[1]*eye[0]+Rot[5]*eye[1]+Rot[9]*eye[2]; 
    var z = Rot[2]*eye[0]+Rot[6]*eye[1]+Rot[10]*eye[2];
    eye = [x,y,z]; 
}

function redraw(now) {
    now *=  0.001;
    var deltatime = now -old;
    old = now;
    var fpsCounter = (1 /deltatime).toFixed(2);
    message.innerHTML=fpsCounter+" fps";

    var sphere = new Sphere20();
    sphere.refine();
    sphere.refine();
    sphere.refine();
    var vertices = sphere.getVertices();
    var normals = sphere.getNormals();
    var indices = sphere.getIndices();

    gl.viewPort(0,0,gl.viewportWidth,gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(!VAO){
         var VAO = createVAO(vertices, normals, indices);
    }
    // var VAO = createVAO(vertices, normals, indices);


    gl.bindVertexArray(VAO);


    // var eye = [0.,0.,3.];
    var at = [0.0,0.0,0.0];
    var up = [0.0,1.0,0.0];


    var viewMatrix = mat4.create(); 
    mat4.lookAt(viewMatrix,eye,at,up);
    gl.uniformMatrix4fv(program.viewMatrix,false, viewMatrix);

    var normalMatrix = mat4.create();
    mat4.invert(normalMatrix,viewMatrix);
    mat4.transpose(normalMatrix,normalMatrix);
    gl.uniformMatrix4fv(program.normalMatrix,false,normalMatrix);

    var fovy = 60.0*3.1416/180.0;
    var projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix,fovy,640./480,0.5,10.0);
    gl.uniformMatrix4fv(program.projectionMatrix,false,projectionMatrix);

    var objColor = [0.0,0.3,0.,1.];
    // gl.uniformMatrix4fv(program.objColor,objColor);
    gl.uniform4fv(program.objColor,objColor);

    // var lightPosition = [0.0,0.,0.0,1.0];
    var lightPosition = [0.0,0.,0.0,1.0];
    // gl.uniformMatrix4fv(program.lightPosition,lightPosition);
    gl.uniform4fv(program.lightPosition,lightPosition);

    // msg(indices.lenght);

    gl.drawElements(gl.TRIANGLES, indices.length/3, gl.UNSIGNED_SHORT,0);

    gl.bindVertexArray(null);
    upCamera();


    requestAnimationFrame(redraw);
}

function msg(text){
    message.innerHTML = text;
}



function initGL(){
    try 
	{
        gl = canvas.getContext("webgl2");
        gl.enable(gl.DEPTH_TEST);
		gl.clearColor(0.5,0.5,0.5,1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (error) 
	{
    }

    if (!gl) 
	{
        alert("could not initialise WebGL2");
    }
}

// shader type = gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
function createShader(shader_src, shader_type){
    var shader = gl.createShader(shader_type);
    gl.shaderSource(shader, shader_src);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
		var info = gl.getShaderInfoLog( shader );
		alert('Could not compile shader '+shader_type+'.\n' + info);
    }

    return shader;
}

function createProgram(vertexShader,fragmentShader) {
    program = gl.createProgram();
	gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
       var info = gl.getProgramInfoLog(program);
	   throw 'Could not compile program.\n' + info;
    }
}

function setProgramVariables(){
	gl.useProgram(program);
    
    // Atributes (per vertex)
	program.vPosition = gl.getAttribLocation(program,"vPosition");
	program.vNormal = gl.getAttribLocation(program, "vNormal");
	// Uniform (for the program, all vertices and fragments)
    program.ViewMatrix = gl.getUniformLocation(program, "ViewMatrix");
    // program.viewMatrix = gl.getUniformLocation(program, "viewMatrix");
    program.normalMatrix = gl.getUniformLocation(program, "normalMatrix");	
    program.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");	
	program.lightPosition = gl.getUniformLocation(program, "lightPosition");
    program.objColor = gl.getUniformLocation(program,"objColor");

}


function createVAO(vertices,normals,indices){
    var objectVAO = gl.createVertexArray();
	gl.bindVertexArray(objectVAO);

    // create vertices VBO in program.vPosition
    var verticesVBO = gl.createBuffer();
    //Define buffer como corrente.
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesVBO);
    //Aloca buffer e copia dados.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //Habilita atributo desejado do vertice.
    gl.enableVertexAttribArray(program.vPosition);
    //Diz que os atributos estao no buffer corrente.
    gl.vertexAttribPointer(program.vPosition,3,gl.FLOAT,false,0,0);

    // create normals VBO in program.vNormal
    var normalsVBO = gl.createBuffer();
	//Define buffer como corrente.
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsVBO);
	//Aloca buffer e copia dados.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	//Habilita atributo desejado do vertice.
    gl.enableVertexAttribArray(program.vNormal);
	//Diz que os atributos estao no buffer corrente.
    gl.vertexAttribPointer(program.vNormal,3,gl.FLOAT,false,0,0);

    // create triangles EBO
    var EBO = gl.createBuffer();
    //Define o buffer como corrente e o define como buffer de elementos.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    //Aloca buffer e copia dados.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return objectVAO;

}

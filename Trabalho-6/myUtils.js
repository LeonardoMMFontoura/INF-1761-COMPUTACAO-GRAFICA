class Sphere20{
    constructor( ){
        const X=0.525731112119133606;
        const Z=0.850650808352039932;
        this.vertices = [
            -X, 0.0, Z,   X, 0.0, Z,   -X, 0.0, -Z,   X, 0.0, -Z,
            0.0, Z, X,    0.0, Z, -X,   0.0, -Z, X,   0.0, -Z, -X,
            Z, X, 0.0,   -Z, X, 0.0,    Z, -X, 0.0,   -Z, -X, 0.0
        ]; 
        this.indices =[
            0,4,1,  0,9,4,  9,5,4,  4,5,8,  4,8,1, 
            8,10,1, 8,3,10, 5,3,8,  5,2,3,  2,7,3,
            7,10,3, 7,6,10, 7,11,6, 11,0,6, 0,1,6,
            6,1,10, 9,0,11, 9,11,2, 9,2,5,  7,2,11
        ]; 
        this.normals = new Array(this.vertices);
    }

    getVertices( ){
        return this.vertices;
    }

    getNormals(){
        return this.normals;
    }

    getIndices(){
        return this.indices;
    }
}

function initGL(canvas){
    try 
	{
        var gl = canvas.getContext("webgl2");
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
    return gl;
}

// shader type = gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
function createShader(gl, shader_src, shader_type){
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

function createProgram(gl,vertexShader,fragmentShader) {
    var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
       var info = gl.getProgramInfoLog(program);
	   throw 'Could not compile program.\n' + info;
    }

    return program;
}

function setProgramVariables(gl, program){
	gl.useProgram(program);
    
    // Atributes (per vertex)
	program.vPosition = gl.getAttribLocation(program,"vPosition");
	program.vNormal = gl.getAttribLocation(program, "vNormal");
	// Uniform (for the program, all vertices and fragments)
    program.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    program.viewMatrix = gl.getUniformLocation(program, "viewMatrix");
    program.normalMatrix = gl.getUniformLocation(program, "normalMatrix");	
    program.modelViewProjectionMatrix = gl.getUniformLocation(program, "modelViewProjectionMatrix");	
	program.lightPosition = gl.getUniformLocation(program, "lightPosition");
    program.objColor = gl.getUniformLocation(program,"objColor");

    return program;
}

function createVAO(gl,program,vertices,normals,indices){
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
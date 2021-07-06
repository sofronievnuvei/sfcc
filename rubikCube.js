
var camera, scene, renderer;
var n = 3;

var mouseLeftDown = false;
var mouseMidDown = false;
var mouseRightDown = false;
var lastMouseX;
var lastMouseY;
var rotMatrix = new THREE.Matrix4();
var nCubes;
var cubes;
var count = 1;
var maxCount = 45;
var currentAngle = 90;
var current_axis = 'w';
var current_slice = -1;
var container = null;
// previous clicked cubes...
var lastCubeClicked = null;
var myLinks = new Array();
var scramble_mode = true;
var current_index = 0;
var width = 640;
var height = 480;


var cube = 
[
  [
	[0,1,2],
	[3,4,5],
	[6,7,8]
  ],
  [ 
	[9,10,11],
	[12,13,14],
	[15,16,17]
  ],
  [
	[18,19,20],
	[21,22,23],
	[24,25,26]
  ]
];

var movements = [];


init();
randomMovs();
animate();



function randomMovs()
{
	for (let i=0; i<5; i++)
	{
		var axis;
		var r = Math.random();
		if (r <= 0.33)
			axis = 'x';
		else if (r <= 0.66)
			axis = 'y';
		else
			axis = 'z';
		
		var angle;
		r = Math.random();
		if (r <= 0.5)
			angle = 90.0;
		else 
			angle = -90.0;

		var slice;
		r = Math.random();
		if (r <= 0.33)
			slice = 0;
		else if (r <= 0.66)
			slice = 1;
		else
			slice = 2;
		
		movements[i] = [axis, slice, angle];
		
	}
}


function getIJK(v)
{
	for (let i=0; i<3; i++)
		for (let j=0; j<3; j++)
			for (let k=0; k<3; k++)
				if (cube[k][j][i] == v)
					return [i,j,k];
	return null;
}

function updatePos(e,i,j,k)
{
	e.position.x = (i-1)*1.1;
	e.position.y = (j-1)*1.1;
	e.position.z = (k-1)*1.1;
	e.matrix.makeTranslation(e.position.x, e.position.y, e.position.z);
}

function faceToNormal(f)
{
	switch (f)
	{
		case 0:
		case 1: return new THREE.Vector4(1,0,0,0); break;

		case 2:
		case 3: return new THREE.Vector4(-1,0,0,0); break;
		
		case 4:
		case 5: return new THREE.Vector4(0,1,0,0); break;

		case 6:
		case 7: return new THREE.Vector4(0,-1,0,0); break;
		
		case 8:
		case 9: return new THREE.Vector4(0,0,1,0); break;
		
		case 10:
		case 11: return new THREE.Vector4(0,0,-1,0); break;
		
	}
	return new THREE.Vector3(0,0,0);
}

function rotateCube(axis, slice, clockwise)
{
	let s  = slice;
	if (axis == 'z')
	{
		if (clockwise == true)
		{
			let aux = [cube[s][0][2], cube[s][1][2], cube[s][2][2], cube[s][2][1], cube[s][2][0], cube[s][1][0], cube[s][0][0],cube[s][0][1] ];
			cube[s][0][0] = aux[0];
			cube[s][0][1] = aux[1];
			cube[s][0][2] = aux[2];
			cube[s][1][2] = aux[3];
			cube[s][2][2] = aux[4];
			cube[s][2][1] = aux[5];
			cube[s][2][0] = aux[6];
			cube[s][1][0] = aux[7];
		}
		else
		{
			let aux = [cube[s][2][0], cube[s][1][0], cube[s][0][0], cube[s][0][1], cube[s][0][2], cube[s][1][2], cube[s][2][2], cube[s][2][1]];
			cube[s][0][0] = aux[0];
			cube[s][0][1] = aux[1];
			cube[s][0][2] = aux[2];
			cube[s][1][2] = aux[3];
			cube[s][2][2] = aux[4];
			cube[s][2][1] = aux[5];
			cube[s][2][0] = aux[6];
			cube[s][1][0] = aux[7];
		}
	}
	else if (axis == 'y')
	{
		if (clockwise == false)
		{
			let aux = [cube[0][s][2], cube[1][s][2], cube[2][s][2], cube[2][s][1], cube[2][s][0], cube[1][s][0], cube[0][s][0], cube[0][s][1] ];
			cube[0][s][0] = aux[0];
			cube[0][s][1] = aux[1];
			cube[0][s][2] = aux[2];
			cube[1][s][2] = aux[3];
			cube[2][s][2] = aux[4];
			cube[2][s][1] = aux[5];
			cube[2][s][0] = aux[6];
			cube[1][s][0] = aux[7];
		}
		else
		{
			let aux = [cube[2][s][0], cube[1][s][0], cube[0][s][0], cube[0][s][1], cube[0][s][2], cube[1][s][2], cube[2][s][2],  cube[2][s][1]];
			cube[0][s][0] = aux[0];
			cube[0][s][1] = aux[1];
			cube[0][s][2] = aux[2];
			cube[1][s][2] = aux[3];
			cube[2][s][2] = aux[4];
			cube[2][s][1] = aux[5];
			cube[2][s][0] = aux[6];
			cube[1][s][0] = aux[7];
			
		}
		
	}
	else
	{
		if (clockwise == true)
		{
			let aux = [cube[0][2][s], cube[1][2][s], cube[2][2][s], cube[2][1][s], cube[2][0][s], cube[1][0][s], cube[0][0][s], cube[0][1][s] ];
			cube[0][0][s] = aux[0];
			cube[0][1][s] = aux[1];
			cube[0][2][s] = aux[2];
			cube[1][2][s] = aux[3];
			cube[2][2][s] = aux[4];
			cube[2][1][s] = aux[5];
			cube[2][0][s] = aux[6];
			cube[1][0][s] = aux[7];
		}
		else
		{
			let aux = [cube[2][0][s], cube[1][0][s], cube[0][0][s], cube[0][1][s], cube[0][2][s], cube[1][2][s], cube[2][2][s],  cube[2][1][s]];
			cube[0][0][s] = aux[0];
			cube[0][1][s] = aux[1];
			cube[0][2][s] = aux[2];
			cube[1][2][s] = aux[3];
			cube[2][2][s] = aux[4];
			cube[2][1][s] = aux[5];
			cube[2][0][s] = aux[6];
			cube[1][0][s] = aux[7];
			
		}
	}
}





function rotateObject(e, axis, degrees)
{
	var r = new THREE.Matrix4();
	switch (axis)
	{
		case 'x': r.makeRotationX(3.14159265359*(degrees/180.0)); break;
		case 'y': r.makeRotationY(3.14159265359*(degrees/180.0)); break;
		case 'z': r.makeRotationZ(3.14159265359*(degrees/180.0)); break;
	}
	r.multiply(e.matrix);
	e.matrix = r;
}

function rotateObjects(axis, slice, degrees)
{
	var  m = 0;
	if (axis == 'z')
	{
		for (let i=0; i<3; i++)
			for (let j=0; j<3; j++)
				rotateObject(cubes [ cube[slice][j][i] ], axis, degrees);
	}
	else if (axis == 'y')
	{
		for (let i=0; i<3; i++)
			for (let k=0; k<3; k++)
				rotateObject(cubes [ cube[k][slice][i] ], axis, degrees);
	}
	else 
	{
		for (let j=0; j<3; j++)
			for (let k=0; k<3; k++)
				rotateObject(cubes [ cube[k][j][slice] ], axis, degrees);
	}
}


function rotate(axis, slice, degrees)
{
	if (count == 0)
		return;
	rotateObjects(axis, slice, degrees/maxCount);
	count ++;
	if (count <= maxCount)
		return;
	count = 0;
	rotateCube(axis, slice, (degrees < 0.0) ? true:false);
}

function iconClickCallback(link)
{
	alert("You clicked " + link);
}




function createmyLinks()
{
	myLinks['x'] = "llecva";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/3d1f1cfb-f60a-41f7-a96d-e05d0ae326e0/f00.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/1da9cc3f-e55c-4e07-99a3-c8226cae69ab/f01.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/fe47a76e-56e3-4638-806a-58ea537ddb2c/f02.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/c134c2d8-a5b8-4266-9ec6-af632e42a6d0/f10.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/53b5aab1-07bd-4053-ab6d-232c4393b3ae/f11.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/02eb333b-467d-4167-b6e4-534d1d092c4f/f12.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/ab85fcc6-f23d-4a7f-994f-5554639255cc/f20.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/a432d7de-6c82-4d13-b39f-904c8b8bbc6b/f21.small.png"] = "http://google.com";
	myLinks["https://user-assets-unbounce-com.s3.amazonaws.com/21a419c2-496a-11e0-9abb-12313e003591/8039694a-9536-49db-9f39-7988f3bd593b/f22.small.png"] = "http://google.com";

	myLinks["./images/b00.png"] = "http://google.com";
	myLinks["./images/b01.png"] = "http://google.com";
	myLinks["./images/b02.png"] = "http://google.com";
	myLinks["./images/b10.png"] = "http://google.com";
	myLinks["./images/b11.png"] = "http://google.com";
	myLinks["./images/b12.png"] = "http://google.com";
	myLinks["./images/b20.png"] = "http://google.com";
	myLinks["./images/b21.png"] = "http://google.com";
	myLinks["./images/b22.png"] = "http://google.com";
	
	myLinks["./images/r00.png"] = "http://google.com";
	myLinks["./images/r01.png"] = "http://google.com";
	myLinks["./images/r02.png"] = "http://google.com";
	myLinks["./images/r10.png"] = "http://google.com";
	myLinks["./images/r11.png"] = "http://google.com";
	myLinks["./images/r12.png"] = "http://google.com";
	myLinks["./images/r20.png"] = "http://google.com";
	myLinks["./images/r21.png"] = "http://google.com";
	myLinks["./images/r22.png"] = "http://google.com";

	myLinks["./images/l00.png"] = "http://google.com";
	myLinks["./images/l01.png"] = "http://google.com";
	myLinks["./images/l02.png"] = "http://google.com";
	myLinks["./images/l10.png"] = "http://google.com";
	myLinks["./images/l11.png"] = "http://google.com";
	myLinks["./images/l12.png"] = "http://google.com";
	myLinks["./images/l20.png"] = "http://google.com";
	myLinks["./images/l21.png"] = "http://google.com";
	myLinks["./images/l22.png"] = "http://google.com";
	
	myLinks["./images/t00.png"] = "http://google.com";
	myLinks["./images/t01.png"] = "http://google.com";
	myLinks["./images/t02.png"] = "http://google.com";
	myLinks["./images/t10.png"] = "http://google.com";
	myLinks["./images/t11.png"] = "http://google.com";
	myLinks["./images/t12.png"] = "http://google.com";
	myLinks["./images/t20.png"] = "http://google.com";
	myLinks["./images/t21.png"] = "http://google.com";
	myLinks["./images/t22.png"] = "http://google.com";
	
	myLinks["./images/bo00.png"] = "http://google.com";
	myLinks["./images/bo01.png"] = "http://google.com";
	myLinks["./images/bo02.png"] = "http://google.com";
	myLinks["./images/bo10.png"] = "http://google.com";
	myLinks["./images/bo11.png"] = "http://google.com";
	myLinks["./images/bo12.png"] = "http://google.com";
	myLinks["./images/bo20.png"] = "http://google.com";
	myLinks["./images/bo21.png"] = "http://google.com";
	myLinks["./images/bo22.png"] = "http://google.com";
}

function createCube()
{
	createmyLinks();
	n = 3;
	nCubes = 0;
	cubes = new Array(n*n*n);
	
	var gray_material = new THREE.MeshLambertMaterial({ color: 0x081F2C });
	var geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 );
	for (var k = 0; k < n; k++) 
	{
		for (var j = 0; j < n; j++) 
		{
			for (var i = 0; i < n; i++) 
			{

				var materials = 
				[
					gray_material,
					gray_material,
					gray_material,
					gray_material,
					gray_material,
					gray_material
				];

				if (i==0)	// left face = green
				{
					let textName = "./images/l"+(2-j).toString()+k.toString()+".png";
					let loader = new THREE.TextureLoader();
					let material = new THREE.MeshBasicMaterial( { color: 0xffffffff, vertexColors: THREE.FaceColors, map: loader.load(textName), side:THREE.DoubleSide } );
					materials[1] = material;
					geometry.faces[2].link = myLinks[textName];
					geometry.faces[3].link = myLinks[textName];
				}
				if (i==n-1)	// right face = red
				{
					let textName = "./images/r"+(2-j).toString()+(2-k).toString()+".png";
					let loader = new THREE.TextureLoader();
					let material = new THREE.MeshBasicMaterial( { color: 0xffffffff, vertexColors: THREE.FaceColors, map: loader.load(textName),side:THREE.DoubleSide } );
					materials[0] = material;
					geometry.faces[0].link = myLinks[textName];
					geometry.faces[1].link = myLinks[textName];
				}
				if (j == 0)	// bottom face = yellow
				{
					let textName = "./images/bo"+(2-k).toString()+i.toString()+".png";
					let loader = new THREE.TextureLoader();
					let material = new THREE.MeshBasicMaterial( { color: 0xffffffff, vertexColors: THREE.FaceColors, map: loader.load(textName),side:THREE.DoubleSide } );
					materials[3] = material;
					geometry.faces[6].link = myLinks[textName];
					geometry.faces[7].link = myLinks[textName];
				}
				if (j == n-1)	// top face = green
				{
					let textName = "./images/t"+i.toString()+k.toString()+".png";
					let loader = new THREE.TextureLoader();
					let material = new THREE.MeshBasicMaterial( { color: 0xffffffff, vertexColors: THREE.FaceColors, map: loader.load(textName),side:THREE.DoubleSide } );
					materials[2] = material;
					geometry.faces[4].link = myLinks[textName];
					geometry.faces[5].link = myLinks[textName];
				}
				if (k == 0)	// back face = magenta
				{
					let textName = "./images/b"+(2-j).toString()+(2-i).toString()+".png";
					let loader = new THREE.TextureLoader();
					let material = new THREE.MeshBasicMaterial( { color: 0xffffffff, vertexColors: THREE.FaceColors, map: loader.load(textName),side:THREE.DoubleSide } );
					materials[5] = material;
					geometry.faces[10].link = myLinks[textName];
					geometry.faces[11].link = myLinks[textName];
				}
				if (k == n-1)	// front face = cyan
				{
					let textName = "./images/f"+(2-j).toString()+i.toString()+".png";
					let loader = new THREE.TextureLoader();
					let material = new THREE.MeshBasicMaterial( { color: 0xffffffff, vertexColors: THREE.FaceColors, map: loader.load(textName),side:THREE.DoubleSide } );
					materials[4] = material;
					geometry.faces[8].link = myLinks[textName];
					geometry.faces[9].link = myLinks[textName];
				}
				
				var e = new THREE.Mesh( geometry, materials );
				
				e.matrixAutoUpdate = false;
				e.rotationAutoUpdate = false;
				e.matrixAutoUpdate = false;
				
				e.index = nCubes;
				updatePos(e,i,j,k);
				scene.add(e);
				cubes[nCubes] = e;
				nCubes++;
			}
		}
	}	
}


function init() 
{
	//camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	container = document.getElementById('canvas');
	width = container.width;
	height = container.height;
	camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );
	camera.position.z = 7;
	scene = new THREE.Scene();
	
	createCube();
	
	var angle = 45.0 * 3.14159 / 180.0;
	var r = new THREE.Matrix4();
	var axis = new THREE.Vector3(0, 1, 0);
	r.makeRotationAxis(axis, angle);
	rotMatrix.multiplyMatrices(r, rotMatrix);
	
	
	renderer = new THREE.WebGLRenderer({canvas: container, preserveDrawingBuffer:true});	// required for readPixels
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor( 0xffffff, 1);

	renderer.setSize(width, height);	
	//container.appendChild(renderer.domElement);
	document.body.appendChild( renderer.domElement );
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );
	//
	container.addEventListener('resize',    onWindowResize,  false);
	container.addEventListener("mousedown", handleMouseDown, false);
	container.addEventListener("mouseup",   handleMouseUp,   false);
	container.addEventListener("mousemove", handleMouseMove, false);
	// IE9, Chrome, Safari, Opera
	container.addEventListener("mousewheel", onMouseWheel, false);
	// Firefox
	container.addEventListener("DOMMouseScroll", onMouseWheel, false);			
	count = 0;
	
}

function onWindowResize() 
{
	/*camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );*/
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
}

function animate() 
{
	requestAnimationFrame( animate );
	
	if (scramble_mode == true)
	{
		scene.quaternion.setFromRotationMatrix(rotMatrix);
		rotate(movements[current_index][0], movements[current_index][1], movements[current_index][2]);
		if (count == 0)
		{
			current_index++;
			if (current_index == movements.length)
				scramble_mode = false;
			else
				count = 1;
		}
	}
	else
	{
		rotate(current_axis, current_slice, currentAngle);
		scene.quaternion.setFromRotationMatrix(rotMatrix);
		//console.log(scene.quaternion);
	}
	renderer.render( scene, camera );
}

function getClickedCube()
{
	//var x = (event.clientX / window.innerWidth)  * 2 -1;
	//var y = ((window.innerHeight-1-event.clientY) / window.innerHeight) * 2 -1;
	var x = (event.clientX / container.width)  * 2 -1;
	var y = ((container.height-1-event.clientY) / container.height) * 2 -1;

	var vector = new THREE.Vector3(x, y, 0.5);
	vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(cubes);
	if (intersects.length > 0) 
	{
		var dMin = intersects[0].distance;
		var i = 0;
		for (var j=1; j<intersects.length; j++)
			if (dMin > intersects[j].distance)
			{
				dMin = intersects[j].distance;
				i = j;
			}
		return intersects[i];
	}
	return null;

}

function handleMouseDown(event) 
{
	if (event.button == 0)
		mouseLeftDown = true;
	if (event.button == 1)
		mouseMidDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
	if (count == 0)
		lastCubeClicked = getClickedCube();
	else
		lastCubeClicked = null;
}

function multiply_vector(m, v)
{
	var a = m.elements[0] * v.x + m.elements[4] * v.y + m.elements[8] * v.z;
	var b = m.elements[1] * v.x + m.elements[5] * v.y + m.elements[9] * v.z;
	var c = m.elements[2] * v.x + m.elements[6] * v.y + m.elements[10] * v.z;
	if (a < -0.9) a = -1.0; else if (Math.abs(a) > 0.9) a = 1.0; else a = 0.0;
	if (b < -0.9) b = -1.0; else if (Math.abs(b) > 0.9) b = 1.0; else b = 0.0;
	if (c < -0.9) c = -1.0; else if (Math.abs(c) > 0.9) c = 1.0; else c = 0.0;
	return new THREE.Vector3(a,b,c);
}

function handleMouseUp(event) 
{
	if (event.button == 0)
		mouseLeftDown = false;
	if (event.button == 1)
		mouseMidDown = false;
	if (count ==0 && lastCubeClicked != null)
	{
		// let´s see where the user has released the mouse
		var currentCubeUp = getClickedCube();
		if (currentCubeUp != null)
		{
			// we can compute the difference, if not the same
			if (lastCubeClicked.object == currentCubeUp.object)
			{
				if (lastCubeClicked.faceIndex == currentCubeUp.faceIndex)
				{
					//iconClickCallback(lastCubeClicked.)
					iconClickCallback(lastCubeClicked.object.geometry.faces[lastCubeClicked.faceIndex].link);
				}
			}
			else
			{
				// only one different axis is allowed
				let start = getIJK(lastCubeClicked.object.index);
				let end = getIJK(currentCubeUp.object.index);
				
				var ma = lastCubeClicked.object.matrix;
				var mb = currentCubeUp.object.matrix;
				
				//var a = lastCubeClicked.face.normal;
				//var b = currentCubeUp.face.normal;
				var a = faceToNormal(lastCubeClicked.faceIndex);
				var b = faceToNormal(currentCubeUp.faceIndex);
				
				
				var A = multiply_vector(ma,a);
				var B = multiply_vector(mb,b);
				
				var diff = new THREE.Vector3
				(
					B[0]-A[0], 
					B[1]-A[1], 
					B[2]-A[2] 
				);
				if (diff.x == 0.0 && diff.y == 0.0 && diff.z == 0.0) // same normal?
				{
					var diff_index = new THREE.Vector3
					(
						end[0]-start[0], 
						end[1]-start[1], 
						end[2]-start[2] 
					);
					
					var normal = new THREE.Vector3(A.x, A.y, A.z);
					normal.cross(diff_index).normalize();
					
					/*
					if (end[0]-start[0] != 0)
					{
						current_axis = 'y';
						currentAngle = (end[0]-start[0] > 0) ? 90.0 : -90.0;
						current_slice = start[1];
					}
					else if (end[1]-start[1] != 0)
					{
						current_axis = 'x';
						current_slice = start[0];
						currentAngle = (end[1]-start[1] > 0) ? -90.0 : 90.0;
					}
					else
					{
						current_axis = 'x';
						current_slice = start[0];
						currentAngle = (end[2]-start[2] > 0) ? 90.0 : -90.0;
					}
					*/
					if (normal.x == 0.0 && normal.y == 0.0)
					{
						current_axis = 'z';
						currentAngle= (normal.z >= 0.0) ? 90.0:-90.0;
						current_slice = start[2];
					
					}
					else if (normal.y == 0.0 && normal.z == 0.0)
					{
						current_axis = 'x';
						current_slice = start[0];
						currentAngle= (normal.x >= 0.0) ? 90.0:-90.0;
					}
					else
					{
						current_axis = 'y';
						current_slice = start[1];
						currentAngle= (normal.y >= 0.0) ? 90.0:-90.0;
					}
					//if (A.x < 0.0 || A.y < 0.0 || A.z < 0) currentAngle = -currentAngle;

					console.log(currentAngle);
					count = 1;

					
				}
			}
		}
	}
	//console.log("mouse up");
}

function onMouseWheel(event) 
{
	var delta = 0;
	if (!event) // For IE. 
		event = window.event;
	if (event.wheelDelta) 	// IE/Opera. 
	{ 
		delta = event.wheelDelta/120;
	} 
	else if (event.detail) 	// Mozilla case. 
	{ 
		delta = -event.detail/3;
	}
	if (delta)
		handleScroll(delta);
	if (event.preventDefault)
		event.preventDefault();
	event.returnValue = false;
}

function handleScroll(delta) 
{
	camera.position.z += delta * 0.5;
	if (camera.position.z > 40)
		camera.position.z = 40;
	else if (camera.position.z < 6)
		camera.position.z = 6;
}		

function handleMouseMove(event) 
{
	var newX = event.clientX;
	var newY = event.clientY;
	var deltaX = newX - lastMouseX;
	var deltaY = newY - lastMouseY;
	// do something with delta
	if (mouseLeftDown) 	//if (event.button === 0)
	{
		if (lastCubeClicked == null && (deltaX !=0 || deltaY!=0))
		{
			//console.log(lastMouseX, lastMouseY, deltaX, deltaY);
			var angle = 0.01 * Math.sqrt(deltaX*deltaX+deltaY*deltaY);
			var r = new THREE.Matrix4();
			var axis = new THREE.Vector3(deltaY, deltaX, 0.0);
			axis.normalize();
			r.makeRotationAxis(axis, angle);
			rotMatrix.multiplyMatrices(r, rotMatrix);
		}
	}
	else if (mouseMidDown)
	{
		//console.log("mouse move mid  down");
	}
	else if (mouseRightDown)
	{
		//console.log("mouse move right down");
	}
	//console.log("mouse move");
	lastMouseX = newX
	lastMouseY = newY;
}	
	


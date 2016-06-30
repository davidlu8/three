/**
 * Created by luw on 2016/6/29.
 */
function Builder() {
    this.container;
    this.scene;
    this.camera;
    this.objects = [];
    this.renderer;
    this.background;
    this.lights = [];

    this.onPointerDownPointerX;
    this.onPointerDownPointerY;
    this.onPointerDownLon;
    this.onPointerDownLat;
    this.onPointerDownDistance
    this.isUserInteracting = false;
    this.lon = 90;
    this.lat = 15;
    this.phi = 0;
    this.theta = 0;
    this.mouse;
}

Builder.prototype.initialize = function() {
    //初始化容器
    this.initContainer();

    //初始化场景
    this.initScene();

    //初始化摄像头
    this.initCamera();

    //初始化渲染器
    this.initRenderer();
};

//初始化容器
Builder.prototype.initContainer = function() {
    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );
}

//初始化场景
Builder.prototype.initScene = function() {
    this.scene = new THREE.Scene();
}

//初始化摄像头
Builder.prototype.initCamera = function() {
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.y = 200;
    this.camera.position.z = 500;
}

Builder.prototype.initToolbar = function() {
    var info = document.createElement( 'div' );
    info.className = 'dddd';
    info.innerHTML = '';
    this.container.appendChild( info );
}

Builder.prototype.initSettingbar = function() {

}

Builder.prototype.initBackground = function() {
    //var geometry = new THREE.PlaneBufferGeometry( 500, 500 );
    //geometry.rotateX( - Math.PI / 2 );
    //var plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: true } ) );
    //this.scene.add( plane );

    var size = 500, step = 50;
    var geometry = new THREE.Geometry();
    for ( var i = - size; i <= size; i += step ) {
        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
    }
    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
    var line = new THREE.LineSegments( geometry, material );
    this.scene.add( line );
}

Builder.prototype.initRenderer = function() {
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setClearColor( 0xf0f0f0 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );
}

Builder.prototype.initObjects = function() {
    var geometry = new THREE.BoxGeometry( 50, 100, 50 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        //var hex = 0x1133ff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var context = new THREE.ImageUtils.loadTexture("images/bg-02.jpg");
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5, map: context } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.x = 0;
    cube.position.y = 50;
    cube.position.z = 0;
    this.scene.add(cube);
    this.objects.push( cube );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };
    var texture = new THREE.Texture();
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) {
    };
    var loader = new THREE.OBJLoader( manager );
    loader.load( 'obj/box.obj', function ( object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
            }
        } );
        object.position.x = 100;
        object.position.y = 0;
        object.position.z = 100;
        builder.scene.add( object );
    }, onProgress, onError );
}

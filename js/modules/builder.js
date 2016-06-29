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
    this.lights;

    this.onPointerDownPointerX;
    this.onPointerDownPointerY;
    this.onPointerDownLon;
    this.onPointerDownLat;
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
    cube.position.y = 0;
    cube.position.z = 0;
    this.scene.add(cube);
}

Builder.prototype.initRenderer = function() {
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setClearColor( 0xf0f0f0 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );
}

Builder.prototype.initObjects = function() {
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        //var hex = 0x1133ff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;
    this.scene.add( cube );
    this.objects.push( cube );
}

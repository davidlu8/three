/**
 * Created by luw on 2016/6/29.
 */
function Builder(bgWidth, bgHeight) {
    //场景相关属性
    this.container;
    this.scene;
    this.bgWidth = bgWidth;
    this.bgHeight = bgHeight;
    this.camera;
    this.objects = [];
    this.renderer;
    this.background;
    this.lights = [];

    //鼠标事件相关属性
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

    //选中事件相关属性
    this.raycaster;
    this.mouse;
    this.control;
    this.selected = null;
}

Builder.prototype.initialize = function() {
    //初始化容器
    this.initContainer();

    //初始化场景
    this.initScene();

    //初始化摄像头
    this.initCamera();

    //初始化灯光
    this.initLight();

    //初始化渲染器
    this.initRenderer();

    //初始化控制器
    this.initControl();

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
    //this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
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


Builder.prototype.initLight = function() {
    this.scene.add( new THREE.AmbientLight( 0x505050 ) );
    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 500, 500, 500 );
    light.castShadow = true;
    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
    light.shadow.bias = - 0.00022;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    this.scene.add( light );
}

Builder.prototype.initBackground = function() {
    //var geometry = new THREE.PlaneBufferGeometry( 500, 500 );
    //geometry.rotateX( - Math.PI / 2 );
    //var plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xcccccc, visible: true } ) );
    //this.scene.add( plane );

    var size = this.bgWidth, step = this.bgWidth / 5;
    var geometry = new THREE.Geometry();
    for ( var i = - size; i <= size; i += step ) {
        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
    }
    var material = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.2 } );
    var line = new THREE.LineSegments( geometry, material );
    this.scene.add( line );
}


Builder.prototype.initControl = function() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.control = new THREE.TransformControls( this.camera, this.renderer.domElement );
}

Builder.prototype.initRenderer = function() {
    //this.renderer = new THREE.CanvasRenderer();
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0xf0f0f0 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

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
    var context = new THREE.ImageUtils.loadTexture("/images/bg-02.jpg");
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5, map: context } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.x = 0;
    cube.position.y = 50;
    cube.position.z = 0;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.objects.push( cube );

    var geometry = new THREE.BoxGeometry( 20, 30, 150 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        //var hex = 0x1133ff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var context = new THREE.ImageUtils.loadTexture("/images/bg-02.jpg");
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5, map: context } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.x = -100;
    cube.position.y = 15;
    cube.position.z = 100;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.objects.push( cube );


    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) { };
    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'obj/' );
    mtlLoader.load( 'box02.mtl', function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'obj/' );
        objLoader.load( 'box02.obj', function ( object ) {
            object.position.y = 50;
            object.position.x = 100;
            object.position.z = 100;
            builder.scene.add( object );
        }, onProgress, onError );
    });
}

/**
 * Created by luw on 2016/6/29.
 */
function Builder(bgWidth, bgHeight) {
    //场景相关属性
    this.container;
    this.scene;
    this.camera;
    this.renderer;
    this.bgWidth = bgWidth;
    this.bgHeight = bgHeight;
    this.objects = [];
    this.commons = [];
    this.background = [];
    this.lights = [];
    this.lightHelpers = [];
    this.ambientLights = [];

    //墙壁相关属性
    this.walls = [];
    this.wallLines = [];
    this.wall_height = 200;
    this.wall_depth = 20;

    //当前模式
    this.mode = 'dev';

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

    //禁用区块相关属性
    this.forbidBlocks = [];

    //家具信息相关属性
    this.infoBlock;

    //标记相关属性
    this.markStatus;
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

    //初始化选取工具
    this.initPicktool();

    //初始化控制器
    this.initControl();

    //初始化工具栏
    //this.initToolbar();

    //初始化禁用区块数据
    this.initForbidBlockData();

    //初始化信息区块
    this.initInfoBlock();
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
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ); //鱼眼摄像头
    //this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 ); //平角摄像头
    this.camera.position.y = 200;
    this.camera.position.z = 500;
}

Builder.prototype.initToolbar = function() {
    var info = document.createElement( 'div' );
    var toolBlock = document.getElementById('toolBlock');
    info.className = 'toolBar';
    info.innerHTML = toolBlock.innerHTML;
    this.container.appendChild( info );
}

Builder.prototype.initSettingbar = function() {

}

Builder.prototype.initLight = function() {
    //主灯
    var spotLight = new THREE.SpotLight(0x999999, 2);
    spotLight.castShadow = true;
    spotLight.angle = 15;
    spotLight.penumbra = 1;
    spotLight.decay = 1.5;
    spotLight.distance = 1000;

    spotLight.position.set(0, 500, 0);
    spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 1024;
    this.scene.add(spotLight);
    this.lights.push(spotLight);
    //var lightHelper = new THREE.SpotLightHelper(spotLight);
    //this.scene.add(lightHelper);
    //this.lightHelpers.push(lightHelper);

    ////辅灯
    //var spotLight = new THREE.SpotLight(0x666666, 1);
    //spotLight.castShadow = false;
    //spotLight.angle = 15;
    //spotLight.penumbra = 1;
    //spotLight.decay = 1.5;
    //spotLight.distance = 1000;
    //
    //spotLight.position.set(-300, 200, -300);
    //spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 1024;
    //this.scene.add(spotLight);
    //this.lights.push(spotLight);
    //var lightHelper = new THREE.SpotLightHelper(spotLight);
    //this.scene.add(lightHelper);
    //this.lightHelpers.push(lightHelper);
    //
    ////辅灯
    //var spotLight = new THREE.SpotLight(0x666666, 1);
    //spotLight.castShadow = false;
    //spotLight.angle = 15;
    //spotLight.penumbra = 1;
    //spotLight.decay = 1.5;
    //spotLight.distance = 1000;
    //
    //spotLight.position.set(300, 200, 300);
    //spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 1024;
    //this.scene.add(spotLight);
    //this.lights.push(spotLight);
    //var lightHelper = new THREE.SpotLightHelper(spotLight);
    //this.scene.add(lightHelper);
    //this.lightHelpers.push(lightHelper);

    var ambientLight = new THREE.AmbientLight( 0x666666 );
    this.scene.add( ambientLight );
    this.ambientLights.push(ambientLight);
}

Builder.prototype.initBackground = function() {
    var floorMat = new THREE.MeshStandardMaterial( {
        roughness: 1,
        color: 0xffffff,
        metalness: 0.2,
        bumpScale: 0.02,
    });
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load( "materials/hardwood2_diffuse.jpg", function( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 4, 4 );
        floorMat.map = map;
        floorMat.needsUpdate = true;
    } );
    textureLoader.load( "materials/hardwood2_bump.jpg", function( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 4, 4 );
        floorMat.bumpMap = map;
        floorMat.needsUpdate = true;
    } );
    textureLoader.load( "materials/hardwood2_roughness.jpg", function( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 4, 4 );
        floorMat.roughnessMap = map;
        floorMat.needsUpdate = true;
    } );

    var geometry = new THREE.PlaneGeometry( this.bgWidth * 2, this.bgHeight * 2 );
    geometry.rotateX( - Math.PI / 2 );
    var plane = new THREE.Mesh( geometry, floorMat );
    plane.receiveShadow = true;
    this.scene.add( plane );
    this.background.push(plane);

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
    this.background.push( line );
}

Builder.prototype.initWall = function() {
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 160, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 160, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 100, 160, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 100, 160, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 100, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 100, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    var material = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.2 } );
    geometry.rotateY( - Math.PI / 2);
    var line = new THREE.LineSegments( geometry, material );
    line.position.x = - builder.bgWidth;
    line.position.z = - 25;
    this.scene.add( line );
    this.wallLines.push(line);

    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    var material = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.2 } );
    geometry.rotateY( - Math.PI / 2);
    var line = new THREE.LineSegments( geometry, material );
    line.position.x = builder.bgWidth;
    line.position.z = - 185;
    this.scene.add( line );
    this.wallLines.push(line);

    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 130, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 60, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    var material = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.2 } );
    geometry.rotateY( - Math.PI / 2);
    var line = new THREE.LineSegments( geometry, material );
    line.position.x = builder.bgWidth;
    line.position.z = 100;
    this.scene.add( line );
    this.wallLines.push(line);

    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 90, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 90, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 130, 90, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 130, 90, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 130, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 130, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    var material = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.2 } );
    var line = new THREE.LineSegments( geometry, material );
    line.position.z = builder.bgHeight;
    line.position.x = -40;
    line.position.y = 60;
    this.scene.add( line );
    this.wallLines.push(line);

    var geometry = new THREE.BoxGeometry( this.wall_depth, this.wall_height, this.bgHeight * 2 );
    var map = new THREE.ImageUtils.loadTexture("/images/wall-01.jpg");
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 1;
    map.repeat.set( 1, 1, 1 );
    var materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { map: map, shininess: 0 } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
    ];
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        geometry.faces[i].materialIndex = i / 2;
    }
    var multiMaterial = new THREE.MultiMaterial( materials );
    cube = new THREE.Mesh( geometry, multiMaterial );
    cube.position.x = this.bgWidth + this.wall_depth / 2;
    cube.position.y = this.wall_height / 2;
    cube.position.z = 0;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.walls.push( cube );

    var geometry = new THREE.BoxGeometry( this.wall_depth, this.wall_height, this.bgHeight * 2 );
    var map = new THREE.ImageUtils.loadTexture("/images/wall-04.jpg");
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 1;
    map.repeat.set( 1, 1, 1 );
    var materials = [
        new THREE.MeshPhongMaterial( { map: map, shininess: 0 } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
    ];
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        geometry.faces[i].materialIndex = i / 2;
    }
    var multiMaterial = new THREE.MultiMaterial( materials );
    cube = new THREE.Mesh( geometry, multiMaterial );
    cube.position.x =  - (this.bgWidth + this.wall_depth / 2);
    cube.position.y = this.wall_height / 2;
    cube.position.z = 0;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.walls.push( cube );

    var geometry = new THREE.BoxGeometry( this.bgWidth * 2 + this.wall_depth * 2, this.wall_height, 20 );
    var map = new THREE.ImageUtils.loadTexture("/images/wall-02.jpg");
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 1;
    map.repeat.set( 1, 1, 1 );
    var materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { map: map, shininess: 0 } ),
    ];
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        geometry.faces[i].materialIndex = i / 2;
    }
    var multiMaterial = new THREE.MultiMaterial( materials );
    cube = new THREE.Mesh( geometry, multiMaterial );
    cube.position.x =  0;
    cube.position.y = this.wall_height / 2;
    cube.position.z = this.bgHeight + 20 / 2;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.walls.push( cube );

    var geometry = new THREE.BoxGeometry( this.bgWidth * 2 + this.wall_depth * 2, this.wall_height, 20 );
    var map = new THREE.ImageUtils.loadTexture("/images/wall-03.jpg");
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 1;
    map.repeat.set( 1, 1, 1 );
    var materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { map: map, shininess: 0 } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
    ];
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        geometry.faces[i].materialIndex = i / 2;
    }
    var multiMaterial = new THREE.MultiMaterial( materials );
    cube = new THREE.Mesh( geometry, multiMaterial );
    cube.position.x =  0;
    cube.position.y = this.wall_height / 2;
    cube.position.z = - (this.bgHeight + 20 / 2);
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.walls.push( cube );
}

Builder.prototype.initPicktool = function() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
}

Builder.prototype.initControl = function() {
    this.control = new THREE.TransformControls( this.camera, this.renderer.domElement );
    this.scene.add(this.control);
}

Builder.prototype.initRenderer = function() {
    //this.renderer = new THREE.CanvasRenderer();
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0xcccccc );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.container.appendChild( this.renderer.domElement );
}

Builder.prototype.initObjects = function() {
    var map = new THREE.ImageUtils.loadTexture("/images/wall-01.jpg");
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 1;
    map.repeat.set( 1, 1, 1 );

    var materials = [
        new THREE.MeshPhongMaterial( { map: map } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshPhongMaterial( { color: 0xff0000 } ),
        new THREE.MeshPhongMaterial( { color: 0xff0000 } ),
    ];

    var geometry = new THREE.BoxGeometry( 20, 100, 500 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        console.log(i);
        geometry.faces[i].materialIndex = i / 2;

        var hex = Math.random() * 0xffffff;
        //var hex = 0x1133ff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var multiMaterial = new THREE.MultiMaterial( materials );
    cube = new THREE.Mesh( geometry, multiMaterial );
    cube.position.x = 0;
    cube.position.y = 50;
    cube.position.z = 0;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.objects.push( cube );
    return;

    var geometry = new THREE.BoxGeometry( 20, 120, 150 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        //var hex = 0x1133ff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var context = new THREE.ImageUtils.loadTexture("/images/bg-02.jpg");
    var material = new THREE.MeshPhongMaterial();
    cube = new THREE.Mesh( geometry, material );
    cube.position.x = -100;
    cube.position.y = 60;
    cube.position.z = 100;
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.objects.push( cube );

    //var onProgress = function ( xhr ) {
    //    if ( xhr.lengthComputable ) {
    //        var percentComplete = xhr.loaded / xhr.total * 100;
    //        console.log( Math.round(percentComplete, 2) + '% downloaded' );
    //    }
    //};
    //var onError = function ( xhr ) { };
    //
    //THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    //var mtlLoader = new THREE.MTLLoader();
    //mtlLoader.setPath( 'obj/' );
    //mtlLoader.load( 'house.mtl', function( materials ) {
    //    materials.preload();
    //    var objLoader = new THREE.OBJLoader();
    //    objLoader.setMaterials( materials );
    //    objLoader.setPath( 'obj/' );
    //    objLoader.load( 'house.obj', function ( object ) {
    //        object.position.y = 50;
    //        object.position.x = 100;
    //        object.position.z = 100;
    //        object.traverse( function ( child ) {
    //            if ( child instanceof THREE.Mesh ) {
    //                child.scale.set(20, 20, 20);
    //                child.castShadow = true;
    //                builder.scene.add( object );
    //                builder.objects.push( child );
    //
    //                child.geometry.computeBoundingBox();
    //                var bb = child.geometry.boundingBox;
    //                console.log((bb.max.x - bb.min.x) + ','+(bb.max.y - bb.min.y) + ','+(bb.max.z - bb.min.z));
    //            }
    //        } );
    //        //object.scale.set(20, 20, 20);
    //        //builder.scene.add(object);
    //        //builder.objects.push(object);
    //        //builder.control = new THREE.TransformControls( builder.camera, builder.renderer.domElement );
    //        //builder.control.attach(group);
    //        //builder.scene.add(builder.control);
    //
    //    }, onProgress, onError );
    //});
}

Builder.prototype.initForbidBlockData = function() {
    var blocks = document.getElementsByName('bar');
    for(var i = 0; i < blocks.length; i++) {
        var data = [
            blocks[i].getBoundingClientRect().left,
            blocks[i].getBoundingClientRect().right,
            blocks[i].getBoundingClientRect().top,
            blocks[i].getBoundingClientRect().bottom,
        ];
        this.forbidBlocks.push(data);
    }
}

Builder.prototype.initInfoBlock = function() {
    this.infoBock = document.getElementById('info-block');
}

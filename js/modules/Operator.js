/**
 * Created by luw on 2016/6/29.
 */

function Operator() {};

Operator.prototype.initialize = function() {
    //初始化事件监听
    window.addEventListener( 'resize', this.onWindowResize, false );
    document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
    document.addEventListener( 'mousewheel', this.onDocumentMouseWheel, false );
};

Operator.prototype.onWindowResize = function() {
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    builder.camera.aspect = window.innerWidth / window.innerHeight;
    builder.camera.updateProjectionMatrix();
    builder.renderer.setSize( window.innerWidth, window.innerHeight );
}

Operator.prototype.onDocumentMouseDown = function( event ) {
    event.preventDefault();
    builder.isUserInteracting = true;
    builder.onPointerDownPointerX = event.clientX;
    builder.onPointerDownPointerY = event.clientY;
    builder.onPointerDownLon = builder.lon;
    builder.onPointerDownLat = builder.lat;
}

Operator.prototype.onDocumentMouseMove = function( event ) {
    if ( builder.isUserInteracting === true ) {
        builder.lon = ( builder.onPointerDownPointerX - event.clientX ) * 0.1 + builder.onPointerDownLon;
        builder.lat = ( event.clientY - builder.onPointerDownPointerY ) * 0.1 + builder.onPointerDownLat;
    }
}

Operator.prototype.onDocumentMouseUp = function( event ) {
    builder.isUserInteracting = false;
}

Operator.prototype.onDocumentMouseWheel = function( event ) {
    builder.camera.fov -= event.wheelDeltaY * 0.05;
    builder.camera.updateProjectionMatrix();
}

Operator.prototype.render = function() {
    if ( builder.isUserInteracting === false ) {
        builder.lon += 0.1;
    }
    builder.lat = Math.max( - 85, Math.min( 85, builder.lat ) );
    builder.phi = THREE.Math.degToRad( 90 - builder.lat );
    builder.theta = THREE.Math.degToRad( builder.lon );
    builder.camera.position.x = -500 * Math.sin( builder.phi ) * Math.cos( builder.theta );
    builder.camera.position.y = 500 * Math.cos( builder.phi );
    builder.camera.position.z = 500 * Math.sin( builder.phi ) * Math.sin( builder.theta );

    builder.camera.lookAt( builder.scene.position );
    builder.renderer.render( builder.scene, builder.camera );
}
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

    window.addEventListener( 'keydown', this.onDocumentKeyDown, false );

    document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );
    document.addEventListener( 'touchend', this.onDocumentTouchEnd, false );
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

    builder.mouse.x = ( event.clientX / builder.renderer.domElement.clientWidth ) * 2 - 1;
    builder.mouse.y = - ( event.clientY / builder.renderer.domElement.clientHeight ) * 2 + 1;
    builder.raycaster.setFromCamera( builder.mouse, builder.camera );
    var intersects = builder.raycaster.intersectObjects( builder.objects );
    if ( intersects.length > 0 ) {
        if ( builder.selected == null || builder.selected != intersects[ 0 ].object ) {
            builder.selected = intersects[ 0 ].object;

            console.log(JSON.stringify(builder.selected.geometry.groups));
            builder.selected.material.opacity = 0.5;
            builder.control.attach( builder.selected );
            builder.scene.add( builder.control );
        }
    } else {
        if (builder.selected != null) {
            builder.selected.material.opacity = 1;
            builder.selected = null;
            builder.control.detach();
            builder.scene.remove( builder.control );
        }
    }
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

Operator.prototype.onDocumentKeyDown = function( event ) {
    //alert()
    switch ( event.keyCode ) {
        case 81: // Q
            control.setSpace(control.space === "local" ? "world" : "local");
            break;
    }
}

Operator.prototype.onDocumentTouchStart = function( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        builder.isUserInteracting = true;
        builder.onPointerDownPointerX = event.touches[ 0 ].pageX;
        builder.onPointerDownPointerY = event.touches[ 0 ].pageY;
        builder.onPointerDownLon = builder.lon;
        builder.onPointerDownLat = builder.lat;

        builder.mouse.x = ( event.touches[ 0 ].pageX / builder.renderer.domElement.clientWidth ) * 2 - 1;
        builder.mouse.y = - ( event.touches[ 0 ].pageY / builder.renderer.domElement.clientHeight ) * 2 + 1;
        builder.raycaster.setFromCamera( builder.mouse, builder.camera );
        var intersects = builder.raycaster.intersectObjects( builder.objects );
        if ( intersects.length > 0 ) {
            if ( builder.selected == null || builder.selected != intersects[ 0 ].object ) {
                builder.selected = intersects[ 0 ].object;
                builder.selected.material.opacity = 0.5;
                builder.control.attach( builder.selected );
                builder.scene.add( builder.control );
            }
        } else {
            builder.selected = null;
            builder.control.detach();
            builder.scene.remove( builder.control );
        }
    } else if ( event.touches.length == 2 ) {
        builder.onPointerDownDistance = pointerDistance(event.touches[ 0 ], event.touches[ 1 ]);
    }
}

Operator.prototype.onDocumentTouchMove = function( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        if ( builder.isUserInteracting === true ) {
            builder.lon = ( builder.onPointerDownPointerX - event.touches[ 0 ].pageX ) * 0.1 + builder.onPointerDownLon;
            builder.lat = ( event.touches[ 0 ].pageY - builder.onPointerDownPointerY ) * 0.1 + builder.onPointerDownLat;
        }
    } else if ( event.touches.length == 2 ) {
        builder.camera.fov -= (pointerDistance(event.touches[ 0 ], event.touches[ 1 ]) - builder.onPointerDownDistance) * 0.005;
        builder.camera.updateProjectionMatrix();
    }
}

Operator.prototype.onDocumentTouchEnd = function( event ) {
    builder.isUserInteracting = false;
}

Operator.prototype.render = function() {
    if ( builder.isUserInteracting === false && builder.selected === null) {
        builder.lon += 0.1;
    }
    //if (builder.selected !== null) {
    //    builder.control.position.y = builder.selected.geometry.parameters.height / 2;
    //    builder.selected.position.y = builder.selected.geometry.parameters.height / 2;
    //
    //    if (builder.selected.position.x > builder.bgWidth - builder.selected.geometry.parameters.width / 2) {
    //        builder.control.position.x = builder.bgWidth - builder.selected.geometry.parameters.width / 2;
    //        builder.selected.position.x = builder.bgWidth - builder.selected.geometry.parameters.width / 2;
    //    } else if (builder.selected.position.x < -builder.bgWidth + builder.selected.geometry.parameters.width / 2) {
    //        builder.control.position.x = -builder.bgWidth + builder.selected.geometry.parameters.width / 2;
    //        builder.selected.position.x = -builder.bgWidth + builder.selected.geometry.parameters.width / 2;
    //    }
    //    if (builder.selected.position.z > builder.bgHeight - builder.selected.geometry.parameters.depth / 2) {
    //        builder.control.position.z = builder.bgHeight - builder.selected.geometry.parameters.depth / 2;
    //        builder.selected.position.z = builder.bgHeight - builder.selected.geometry.parameters.depth / 2;
    //    } else if (builder.selected.position.z < -builder.bgHeight + builder.selected.geometry.parameters.depth / 2) {
    //        builder.control.position.z = -builder.bgHeight + builder.selected.geometry.parameters.depth / 2;
    //        builder.selected.position.z = -builder.bgHeight + builder.selected.geometry.parameters.depth / 2;
    //    }
    //    //builder.selected.geometry.parameters.height = 50;
    //}

    builder.lat = Math.max( - 85, Math.min( 85, builder.lat ) );
    builder.phi = THREE.Math.degToRad( 90 - builder.lat );
    builder.theta = THREE.Math.degToRad( builder.lon );
    builder.camera.position.x = -500 * Math.sin( builder.phi ) * Math.cos( builder.theta );
    builder.camera.position.y = 500 * Math.cos( builder.phi );
    builder.camera.position.z = 500 * Math.sin( builder.phi ) * Math.sin( builder.theta );

    builder.camera.lookAt( builder.scene.position );
    builder.renderer.render( builder.scene, builder.camera );
}
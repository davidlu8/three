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

    //extend
    document.addEventListener( 'touchstart', this.onDocumentToushStartOnMark, false );
};

Operator.prototype.onWindowResize = function() {
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    builder.camera.aspect = window.innerWidth / window.innerHeight;
    builder.camera.updateProjectionMatrix();
    builder.renderer.setSize( window.innerWidth, window.innerHeight );
}

Operator.prototype.onDocumentMouseDown = function( event ) {
    if (operator.isForbidBlock(event.clientX, event.clientY)) return;
    event.preventDefault();
    builder.isUserInteracting = true;
    builder.onPointerDownPointerX = event.clientX;
    builder.onPointerDownPointerY = event.clientY;
    builder.onPointerDownLon = builder.lon;
    builder.onPointerDownLat = builder.lat;

    if (builder.mode == 'dev') {
        builder.mouse.x = ( event.clientX / builder.renderer.domElement.clientWidth ) * 2 - 1;
        builder.mouse.y = - ( event.clientY / builder.renderer.domElement.clientHeight ) * 2 + 1;
        builder.raycaster.setFromCamera( builder.mouse, builder.camera );
        var intersects = builder.raycaster.intersectObjects( builder.objects );
        if ( intersects.length > 0 ) {
            if ( builder.selected == null || builder.selected != intersects[ 0 ].object ) {
                builder.selected = intersects[ 0 ].object;

                builder.selected.material.opacity = 0.5;
                builder.control.attach( builder.selected );
                //builder.scene.add( builder.control );
            }
        } else {
            if (builder.selected != null) {
                builder.selected.material.opacity = 1;
                builder.selected = null;
                builder.control.detach();
                //builder.scene.remove( builder.control );
            }
        }
        showInfo();
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
        case 13: // Enter
            break;
        case 32: //Space
            if (builder.selected != null) {
                builder.selected.geometry.rotateY( - Math.PI / 2 );
            }
            break;
        case 46: //Delete
            operator.deleteSelected();
            break;
    }
}

Operator.prototype.deleteSelected = function() {
    if (builder.selected != null) {
        builder.objects.splice(builder.objects.indexOf( builder.selected.object ), 1);
        builder.control.detach();
        builder.scene.remove(builder.selected);
        //builder.scene.remove(builder.selected);
    }
}

Operator.prototype.rotationSelected = function(direction) {
    if (builder.selected != null) {
        if (direction == 'left') {
            builder.selected.geometry.rotateY( Math.PI / 2 );
        } else {
            builder.selected.geometry.rotateY( - Math.PI / 2 );
        }
    }
}

Operator.prototype.onDocumentToushStartOnMark = function() {
    if (!operator.isForbidBlock(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY)) {
        if (builder.markStatus == 'mark') {
            var mouse = new THREE.Vector2();
            var raycaster = new THREE.Raycaster();
            mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            mouse.y = -( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera(mouse, builder.camera);
            var intersects = raycaster.intersectObjects(builder.commons);
            if (intersects.length > 0) {
                var rollOverGeo = new THREE.SphereGeometry(7, 32, 32);
                rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
                rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
                rollOverMesh.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                builder.scene.add(rollOverMesh);
                builder.commons.push(rollOverMesh);
            }
        } else if (builder.markStatus == 'delete') {
            var mouse = new THREE.Vector2();
            var raycaster = new THREE.Raycaster();
            mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            mouse.y = -( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera(mouse, builder.camera);
            var intersects = raycaster.intersectObjects(builder.commons);
            if (intersects.length > 0) {
                if (intersects[0].object.type == 'Mesh') {
                    builder.commons.splice(builder.commons.indexOf(intersects[0].object), 1);
                    builder.scene.remove(intersects[0].object);
                }
                //for(var i = 0; i < intersects.length; i++) {
                //    if (intersects[i].object.type == 'Mesh') {
                //        builder.commons.splice(builder.commons.indexOf(intersects[i].object), 1);
                //        builder.scene.remove(intersects[i].object);
                //    }
                //}
            }
        }
    }
}

Operator.prototype.onDocumentTouchStart = function( event ) {
    //event.preventDefault();
    if ( event.touches.length == 1 ) {
        builder.isUserInteracting = true;
        builder.onPointerDownPointerX = event.touches[ 0 ].pageX;
        builder.onPointerDownPointerY = event.touches[ 0 ].pageY;
        builder.onPointerDownLon = builder.lon;
        builder.onPointerDownLat = builder.lat;

        if (!operator.isForbidBlock(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY)) {
            event.preventDefault();
            if (builder.mode == 'dev') {
                builder.mouse.x = ( event.touches[0].pageX / builder.renderer.domElement.clientWidth ) * 2 - 1;
                builder.mouse.y = -( event.touches[0].pageY / builder.renderer.domElement.clientHeight ) * 2 + 1;
                builder.raycaster.setFromCamera(builder.mouse, builder.camera);
                var intersects = builder.raycaster.intersectObjects(builder.objects);
                if (intersects.length > 0) {
                    if (builder.selected == null || builder.selected != intersects[0].object) {
                        builder.selected = intersects[0].object;
                        builder.selected.material.opacity = 0.5;
                        builder.control.attach(builder.selected);
                        //builder.scene.add( builder.control );
                    }
                } else {
                    builder.selected = null;
                    builder.control.detach();
                    //builder.scene.remove( builder.control );
                }
                showInfo();
            }
        }
    } else if ( event.touches.length == 2 ) {
        event.preventDefault();
        builder.onPointerDownDistance = pointerDistance(event.touches[ 0 ], event.touches[ 1 ]);
    }
}

Operator.prototype.onDocumentTouchMove = function( event ) {
    if ( event.touches.length == 1 ) {
        if ( builder.isUserInteracting === true ) {
            builder.lon = ( builder.onPointerDownPointerX - event.touches[ 0 ].pageX ) * 0.1 + builder.onPointerDownLon;
            builder.lat = ( event.touches[ 0 ].pageY - builder.onPointerDownPointerY ) * 0.1 + builder.onPointerDownLat;
        }
    } else if ( event.touches.length == 2 ) {
        event.preventDefault();
        builder.camera.fov -= (pointerDistance(event.touches[ 0 ], event.touches[ 1 ]) - builder.onPointerDownDistance) * 0.005;
        builder.camera.updateProjectionMatrix();
    }
}

Operator.prototype.onDocumentTouchEnd = function( event ) {
    builder.isUserInteracting = false;
}

Operator.prototype.render = function() {
    if ( builder.mode != 'dev' && builder.isUserInteracting === false && builder.selected === null) {
        builder.lon += 0.1;
    }

    this.displayWalls();
    this.restrict();
    builder.lat = Math.max( - 85, Math.min( 85, builder.lat ) );
    builder.phi = THREE.Math.degToRad( 90 - builder.lat );
    builder.theta = THREE.Math.degToRad( builder.lon );
    builder.camera.position.x = -500 * Math.sin( builder.phi ) * Math.cos( builder.theta );
    builder.camera.position.y = 500 * Math.cos( builder.phi );
    builder.camera.position.z = 500 * Math.sin( builder.phi ) * Math.sin( builder.theta );

    builder.camera.lookAt( builder.scene.position );
    builder.renderer.render( builder.scene, builder.camera );
}

Operator.prototype.setMode = function(mode) {
    builder.mode = mode;
    //地面设置
    if (mode == 'dev') {
        builder.background[0].material.visible = false;
        builder.background[1].material.visible = true;
    } else {
        builder.background[0].material.visible = true;
        builder.background[1].material.visible = false;
    }

    //灯光设置
    if (mode == 'dev') {
        for(var i = 0; i < builder.lightHelpers.length; i++) {
            builder.scene.add(builder.lightHelpers[i]);
        }
    } else {
        for(var i = 0; i < builder.lightHelpers.length; i++) {
            builder.scene.remove(builder.lightHelpers[i]);
        }
    }

    //工具栏设置
    if (mode == 'dev') {
        console.log(document.getElementById('info-block').innerHTML.length);
        if (document.getElementById('info-block').innerHTML.length != 0) {
            document.getElementById('info-block').style.display = 'block';
        }
        document.getElementById('operate-block').style.display = 'block';
        document.getElementById('play-block').style.display = 'block';
        document.getElementById('play-button').style.display = 'block';
        document.getElementById('stop-button').style.display = 'none';
    } else {
        document.getElementById('info-block').style.display = 'none';
        document.getElementById('operate-block').style.display = 'none';
        document.getElementById('play-block').style.display = 'none';
        document.getElementById('play-button').style.display = 'none';
        document.getElementById('stop-button').style.display = 'block';
    }

    //墙体设置
    if (mode == 'dev') {
        for(var i = 0; i < builder.walls.length; i++) {
            builder.walls[i].material.visible = false;
        }
        for(var i = 0; i < builder.wallLines.length; i++) {
            builder.wallLines[i].material.visible = true;
        }
    } else {
        for(var i = 0; i < builder.walls.length; i++) {
            builder.walls[i].material.visible = true;
        }
        for(var i = 0; i < builder.wallLines.length; i++) {
            builder.wallLines[i].material.visible = false;
        }
    }

    //控制设置
    if (mode != 'dev') {
        builder.selected = null;
        builder.control.detach();
        showInfo();
    }
}

Operator.prototype.setMode01 = function(mode) {
    builder.mode = mode;
    //地面设置
    if (mode == 'dev') {
        builder.background[0].material.visible = false;
        builder.background[1].material.visible = true;
    } else {
        builder.background[0].material.visible = false;
        builder.background[1].material.visible = false;
    }

    //灯光设置
    if (mode == 'dev') {
        for(var i = 0; i < builder.lightHelpers.length; i++) {
            builder.scene.add(builder.lightHelpers[i]);
        }
    } else {
        for(var i = 0; i < builder.lightHelpers.length; i++) {
            builder.scene.remove(builder.lightHelpers[i]);
        }
    }
}


Operator.prototype.restrict = function() {
    if (builder.selected !== null) {
        var width, height, depth;
        switch(builder.selected.type) {
            case 'Mesh':
                width = builder.selected.geometry.parameters.width;
                height = builder.selected.geometry.parameters.height;
                depth = builder.selected.geometry.parameters.depth;
                break;
            case 'Combinant':
                width = builder.selected.geometry.width;
                height = builder.selected.geometry.height;
                depth = builder.selected.geometry.depth;
                break;
        }
        builder.control.position.y = height / 2;
        builder.selected.position.y = height / 2;

        if (builder.selected.position.x > builder.bgWidth - width / 2) {
            builder.control.position.x = builder.bgWidth - width / 2;
            builder.selected.position.x = builder.bgWidth - width / 2;
        } else if (builder.selected.position.x < -builder.bgWidth + width / 2) {
            builder.control.position.x = -builder.bgWidth + width / 2;
            builder.selected.position.x = -builder.bgWidth + width / 2;
        }
        if (builder.selected.position.z > builder.bgHeight - depth / 2) {
            builder.control.position.z = builder.bgHeight - depth / 2;
            builder.selected.position.z = builder.bgHeight - depth / 2;
        } else if (builder.selected.position.z < -builder.bgHeight + depth / 2) {
            builder.control.position.z = -builder.bgHeight + depth / 2;
            builder.selected.position.z = -builder.bgHeight + depth / 2;
        }
    }
}

Operator.prototype.isForbidBlock = function(PageX, PageY) {
    if (builder.forbidBlocks.length > 1) {
        for(var i = 0; i < builder.forbidBlocks.length; i++) {
            if (PageX >= builder.forbidBlocks[i][0]
                && PageX <= builder.forbidBlocks[i][1]
                && PageY >= builder.forbidBlocks[i][2]
                && PageY <= builder.forbidBlocks[i][3]
            ) {
                return true;
            }
        }
    }
    return false;
}

Operator.prototype.displayWalls = function() {
    if (builder.mode == 'dev') return;
    if (Math.abs(builder.camera.position.x) > Math.abs(builder.camera.position.z)) {
        if (builder.camera.position.x > 0) {
            for(var i = 0; i < builder.walls.length; i++) {
                if (builder.walls[i].position.x > 0) {
                    builder.walls[i].material.visible = false;
                } else {
                    builder.walls[i].material.visible = true;
                }

            }
        } else {
            for(var i = 0; i < builder.walls.length; i++) {
                if (builder.walls[i].position.x < 0) {
                    builder.walls[i].material.visible = false;
                } else {
                    builder.walls[i].material.visible = true;
                }

            }
        }
    } else {
        if (builder.camera.position.z > 0) {
            for(var i = 0; i < builder.walls.length; i++) {
                if (builder.walls[i].position.z > 0) {
                    builder.walls[i].material.visible = false;
                } else {
                    builder.walls[i].material.visible = true;
                }

            }
        } else {
            for(var i = 0; i < builder.walls.length; i++) {
                if (builder.walls[i].position.z < 0) {
                    builder.walls[i].material.visible = false;
                } else {
                    builder.walls[i].material.visible = true;
                }

            }
        }
    }
}

Operator.prototype.setMark = function(status) {
    if (builder.markStatus == null || builder.markStatus != status) {
        if (status == 'mark') {
            document.getElementById('mark-play').style.display = 'none';
            document.getElementById('mark-stop').style.display = 'block';
            document.getElementById('clean-play').style.display = 'block';
            document.getElementById('clean-stop').style.display = 'none';
        } else if (status == 'delete') {
            document.getElementById('mark-play').style.display = 'block';
            document.getElementById('mark-stop').style.display = 'none';
            document.getElementById('clean-play').style.display = 'none';
            document.getElementById('clean-stop').style.display = 'block';
        }
        builder.markStatus = status;
    } else if (builder.markStatus == status) {
        builder.markStatus = null;
        document.getElementById('mark-play').style.display = 'block';
        document.getElementById('mark-stop').style.display = 'none';
        document.getElementById('clean-play').style.display = 'block';
        document.getElementById('clean-stop').style.display = 'none';
    }
}
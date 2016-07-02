/**
 * Created by luw on 2016/7/1.
 */

function Loader() {
    this.rootPath  = 'obj/';
    this.onProgress;
    this.onError;
}

Loader.prototype.initialize = function() {
    this.onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    this.onError = function ( xhr ) { };
}

Loader.prototype.object = function(mtlPath, objPath, scale, info) {
    var mtlLoader = new THREE.MTLLoader();
    var rootPath = this.rootPath;
    mtlLoader.load( rootPath + mtlPath, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load( rootPath + objPath, function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.scale.set(scale, scale, scale);
                    child.castShadow = true;
                    child.type = 'Combinant';
                    if (info == undefined || info == null) {
                        child.info = '';
                    } else {
                        child.info = info;
                    }
                    child.geometry.computeBoundingBox();
                    var box = child.geometry.boundingBox;
                    child.geometry.width = parseInt(Math.abs(box.max.x - box.min.x) * scale);
                    child.geometry.height = 0;
                    child.geometry.depth = parseInt(Math.abs(box.max.z - box.min.z) * scale);
                    child.position.set(0, 0, 0);
                    builder.scene.add(child);
                    builder.objects.push(child);
                }
            });
        }, this.onProgress, this.onError);
    })
}

Loader.prototype.common = function(mtlPath, objPath, scale, position) {
    var mtlLoader = new THREE.MTLLoader();
    var rootPath = this.rootPath;
    mtlLoader.load( rootPath + mtlPath, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load( rootPath + objPath, function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.scale.set(scale, scale, scale);
                    child.position.set(position[0], position[1], position[2]);
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.type = 'Combinant';
                    builder.scene.add(child);
                    builder.commons.push(child);
                }
            });
        }, this.onProgress, this.onError);
    })
}
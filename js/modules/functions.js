/**
 * Created by luw on 2016/6/29.
 */

function animate() {
    requestAnimationFrame( animate );
    operator.render();
}

function pointerDistance(touch01, touch02) {
    return parseInt(Math.sqrt(Math.pow(touch01.pageX - touch02.pageX, 2) + Math.pow(touch01.pageY - touch02.pageY, 2)))
}
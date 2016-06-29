/**
 * Created by luw on 2016/6/29.
 */
function Builder(scene) {
    this.scene = scene;
}

Builder.prototype.background = function() {
    alert(this.scene);
}

var builder = new Builder('eee');
builder.background();
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

function play() {
    if (builder.mode == 'dev') {
        operator.setMode('pro');
    } else {
        operator.setMode('dev');
    }
}

function play01() {
    if (builder.mode == 'dev') {
        operator.setMode01('pro');
    } else {
        operator.setMode01('dev');
    }
}

function add(name) {
    switch (name) {
        case 'chair':
            loader.object('chair/chair.mtl', 'chair/chair.obj', 90, '<b>诺米拉</b>  <a target="buy" href="http://www.ikea.com/cn/zh/catalog/products/50162212/">点击购买</a><br/>椅子, 桦木<br/> 椅子可叠放，不用时可节省空间。 靠背形状能增加落座舒适感。');
            break;
        case 'desk':
            loader.object('desk/desk.mtl', 'desk/desk.obj', 40, '<b>拉克</b>  <a target="buy" href="http://www.ikea.com/cn/zh/catalog/products/50194897/#/30194898">点击购买</a><br/>茶几, 高光 白色。<br/> 高光泽表面能反射光线，带来无限活力。 便于组装。 分量轻，易于移动。');
            break;
        case 'sofa':
            loader.object('sofa/sofa.mtl', 'sofa/sofa.obj', 28, '<b>索德汉</b>  <a target="buy" href="http://www.ikea.com/cn/zh/catalog/products/S49902060/">点击购买</a><br/>一款能随意组合或单独使用的沙发系列。<br/> SÖDERHAMN 沙发和扶手椅系列座位宽大，靠垫松软，为您带来舒适落座体验。');
            break;
        case 'bed':
            loader.object('bed/bed.mtl', 'bed/bed.obj', 75, '<b>HEMNES 汉尼斯</b>  <a target="buy" href="www.ikea.com/cn/zh/catalog/products/S49009546/">点击购买</a><br/>床，黑褐色, Luröy 鲁瑞。<br/> 实木制成，它是一种结实耐用的天然材料。 床侧板含有床板高度调节设置。');
            break;
        case 'cabinet':
            loader.object('desk02/desk.mtl', 'desk02/desk.obj', 60, '<b>BRIMNES 百灵</b>  <a target="buy" href="http://www.ikea.com/cn/zh/catalog/products/60323605/">点击购买</a><br/>衣柜带3个门, 黑色<br/> 可调式搁板，易于根据个人需求调整空间大小。');
            break;
        case 'tv':
            loader.object('tv/tv.mtl', 'tv/tv.obj', 20, '<b>UPPLEVA乌列娃</b>  <a target="buy" href="http://www.ikea.com/cn/zh/catalog/products/90266199/#/40266205">点击购买</a><br/>48英寸电视, 黑色。<br/> 五年品质保证，详见质保手册。 优质高清画质，清晰的图像，鲜明的对比，鲜活的色彩。');
            break;
        case 'house':
            loader.common('house/house.mtl', 'house/house.obj', 70, [0, 0, -60]);
            break;
    }
}

function controller(name) {
    switch (name) {
        case 'rotation-left':
            operator.rotationSelected('left');
            break;
        case 'rotation-right':
            operator.rotationSelected('right');
            break;
        case 'delete':
            operator.deleteSelected();
            break;
        case 'mark':
            operator.setMark('mark');
            break;
        case 'mark-delete':
            operator.setMark('delete');
            break;
    }
}

function showInfo() {
    if (builder.infoBock != undefined) {
        if (builder.selected == null) {
            builder.infoBock.innerHTML = '';
            builder.infoBock.style.display = 'none';
        } else if (!builder.selected.hasOwnProperty('info')) {
            builder.infoBock.style.display = 'none';
        } else if (builder.selected.info.length == 0) {
            builder.infoBock.innerHTML = '';
            builder.infoBock.style.display = 'none';
        } else {
            builder.infoBock.style.display = 'block';
            builder.infoBock.innerHTML = builder.selected.info;
        }
    }
    builder.initForbidBlockData();
}
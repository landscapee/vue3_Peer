
    String.prototype.colorRgb = function () {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = this.toLowerCase();
    if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #fffff
    if (color.length === 4) {
    var colorNew = "#";
    for (var i = 1; i < 4; i += 1) {
    colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
}
    color = colorNew;
}
    // 处理六位的颜色值，转为RGB
    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
    colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
}
    return "RGB(" + colorChange.join(",") + ")";
} else {
    return color;
}
};

    function dist2d(coord1, coord2) {
    let dx = coord1[0] - coord2[0];
    let dy = coord1[1] - coord2[1];
    return Math.sqrt(dx * dx + dy * dy);
}

    function equals(coord1, coord2) {
    let equals = true;
    for (let i = coord1.length - 1; i >= 0; --i) {
    if (coord1[i] != coord2[i]) {
    equals = false;
    break;
}
}
    return equals;
}

    function clearKey() {
    let userkey = sessionStorage.getItem("lg");
    let idStr = sessionStorage.getItem("Identify") || "";
    if (idStr.length > 0) {
    let u = userkey || "";
    if (u.length > 0) {
    let info = JSON.parse(idStr);
    delete info[u];
    sessionStorage.setItem("Identify", JSON.stringify(info));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("lasttime");
}
}
}

    function getToken() {
    let userkey = sessionStorage.getItem("lg");
    let token = false;
    let idStr = sessionStorage.getItem("Identify") || "";
    let lt = sessionStorage.getItem("lasttime") || 0;
    if (idStr.length > 0 && new Date().getTime() - lt < 36000000) {
    let u = userkey || "";
    if (u.length > 0 && JSON.parse(idStr)[u]) {
    token = JSON.parse(idStr)[u].token;
    sessionStorage.setItem("lasttime", new Date().getTime());
}
}
    return token;
}

    function getUserInfo() {
    let userkey = sessionStorage.getItem("lg");
    let info = null;
    let idStr = sessionStorage.getItem("Identify") || "";
    if (idStr.length > 0) {
    let u = userkey || "";
    if (u.length > 0) {
    info = JSON.parse(idStr)[u].data;
}
}
    return info;
}

    let setBaseLayerTrans = function (v) {
    viewer.imageryLayers.get(0).brightness = v;
};
    let getParallelLines = function (coords, offset) {
    var path = [];
    var N = coords.length - 1;
    var max = N;
    var mi, mi1, li, li1, ri, ri1, si, si1, Xi1, Yi1;
    var p0, p1, p2;
    var isClosed = equals(coords[0], coords[N]);
    if (!isClosed) {
    p0 = coords[0];
    p1 = coords[1];
    p2 = [
    p0[0] + ((p1[1] - p0[1]) / dist2d(p0, p1)) * offset,
    p0[1] - ((p1[0] - p0[0]) / dist2d(p0, p1)) * offset,
    ];
    path.push(p2);
    coords.push(coords[N]);
    N++;
    max--;
}
    for (var i = 0; i < max; i++) {
    p0 = coords[i];
    p1 = coords[(i + 1) % N];
    p2 = coords[(i + 2) % N];
    mi = (p1[1] - p0[1]) / (p1[0] - p0[0]);
    mi1 = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    // Prevent alignements
    if (Math.abs(mi - mi1) > 1e-10) {
    li = Math.sqrt(
    (p1[0] - p0[0]) * (p1[0] - p0[0]) + (p1[1] - p0[1]) * (p1[1] - p0[1])
    );
    li1 = Math.sqrt(
    (p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1])
    );
    ri = p0[0] + (offset * (p1[1] - p0[1])) / li;
    ri1 = p1[0] + (offset * (p2[1] - p1[1])) / li1;
    si = p0[1] - (offset * (p1[0] - p0[0])) / li;
    si1 = p1[1] - (offset * (p2[0] - p1[0])) / li1;
    Xi1 = (mi1 * ri1 - mi * ri + si - si1) / (mi1 - mi);
    Yi1 = (mi * mi1 * (ri1 - ri) + mi1 * si - mi * si1) / (mi1 - mi);
    // Correction for vertical lines
    if (p1[0] - p0[0] == 0) {
    Xi1 = p1[0] + (offset * (p1[1] - p0[1])) / Math.abs(p1[1] - p0[1]);
    Yi1 = mi1 * Xi1 - mi1 * ri1 + si1;
}
    if (p2[0] - p1[0] == 0) {
    Xi1 = p2[0] + (offset * (p2[1] - p1[1])) / Math.abs(p2[1] - p1[1]);
    Yi1 = mi * Xi1 - mi * ri + si;
}
    path.push([Xi1, Yi1]);
}
}
    if (isClosed) {
    path.push(path[0]);
} else {
    coords.pop();
    p0 = coords[coords.length - 1];
    p1 = coords[coords.length - 2];
    p2 = [
    p0[0] - ((p1[1] - p0[1]) / dist2d(p0, p1)) * offset,
    p0[1] + ((p1[0] - p0[0]) / dist2d(p0, p1)) * offset,
    ];
    path.push(p2);
}
    return path;
};
    var measureHeight = function (id) {
    if (this.cl) {
    this.cl._children.forEach(function (c) {
    viewer.entities.remove(c);
});
}
    var measure_entities = new Cesium.Entity();
    this.cl = measure_entities;
    var handler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene._imageryLayerCollection
    );
    var positions = [];
    var poly = null;
    var tooltip = document.getElementById(id);
    var height = 0;
    var cartesian = null;
    tooltip.style.display = "block";
    handler.setInputAction(function (movement) {
    if (movement.endPosition) {
    tooltip.style.left = movement.endPosition.x + 3 + "px";
    tooltip.style.top = movement.endPosition.y - 25 + "px";
    if (tooltip.innerHTML.length == 0) {
    tooltip.innerHTML = "<p>单击开始测量</p>";
}
    cartesian = viewer.scene.pickPosition(movement.endPosition);
    if (positions.length >= 2) {
    // debugger
    if (!Cesium.defined(poly)) {
    poly = new PolyLinePrimitive(positions);
} else {
    positions.pop();
    positions.push(cartesian);
}
    height = getHeight(positions);
}
}
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function (movement) {
    var tooltip = document.getElementById(id);
    tooltip.innerHTML = "<p>双击结束</p>";
    cartesian = viewer.scene.pickPosition(movement.position);
    if (positions.length == 0) {
    positions.push(cartesian.clone());
    positions.push(cartesian);
    viewer.entities.add({
    parent: measure_entities,
    name: "高度",
    position: positions[0],
    point: {
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
    heightReference: Cesium.HeightReference.none,
},
    label: {
    text: "0米",
    font: "18px sans-serif",
    fillColor: Cesium.Color.GOLD,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    outlineWidth: 2,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(20, -40),
},
});
}
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (movement) {
    handler.destroy();
    cartesian = viewer.scene.pickPosition(movement.position);
    positions.pop();
    positions.push(cartesian);
    tooltip.style.display = "none";
    var textDisance = height + "米";
    var point1cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
    var point2cartographic = Cesium.Cartographic.fromCartesian(positions[1]);
    var point_temp = Cesium.Cartesian3.fromDegrees(
    Cesium.Math.toDegrees(point1cartographic.longitude),
    Cesium.Math.toDegrees(point1cartographic.latitude),
    point2cartographic.height
    );
    viewer.entities.add({
    parent: measure_entities,
    name: "直线距离",
    position: point_temp,
    point: {
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
    heightReference: Cesium.HeightReference.none,
},
    label: {
    text: textDisance,
    font: "18px sans-serif",
    fillColor: Cesium.Color.GOLD,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    outlineWidth: 2,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(20, -20),
},
});
}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    function getHeight(_positions) {
    var cartographic = Cesium.Cartographic.fromCartesian(_positions[0]);
    var cartographic1 = Cesium.Cartographic.fromCartesian(_positions[1]);
    var height_temp = cartographic1.height - cartographic.height;
    return height_temp.toFixed(2);
}

    var PolyLinePrimitive = (function () {
    function _(positions) {
    this.options = {
    parent: measure_entities,
    name: "直线",
    polyline: {
    show: true,
    positions: [],
    material: Cesium.Color.AQUA,
    width: 2,
},
    ellipse: {
    show: true,
    material: Cesium.Color.GREEN.withAlpha(0.5),
    outline: true,
},
};
    this.positions = positions;
    this._init();
}

    _.prototype._init = function () {
    var _self = this;
    var _update = function () {
    var temp_position = [];
    temp_position.push(_self.positions[0]);
    var point1cartographic = Cesium.Cartographic.fromCartesian(
    _self.positions[0]
    );
    var point2cartographic = Cesium.Cartographic.fromCartesian(
    _self.positions[1]
    );
    var point_temp = Cesium.Cartesian3.fromDegrees(
    Cesium.Math.toDegrees(point1cartographic.longitude),
    Cesium.Math.toDegrees(point1cartographic.latitude),
    point2cartographic.height
    );
    temp_position.push(point_temp);
    return temp_position;
};
    var _update_ellipse = function () {
    return _self.positions[0];
};
    var _semiMinorAxis = function () {
    var point1cartographic = Cesium.Cartographic.fromCartesian(
    _self.positions[0]
    );
    var point2cartographic = Cesium.Cartographic.fromCartesian(
    _self.positions[1]
    );
    /**根据经纬度计算出距离**/
    var geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    var s = geodesic.surfaceDistance;

    return parseFloat(s);
};
    var _height = function () {
    var height_temp = getHeight(_self.positions);
    console.log("测高:", height_temp);
    return parseFloat(height_temp);
};
    //实时更新polyline.positions
    this.options.polyline.positions = new Cesium.CallbackProperty(
    _update,
    false
    );
    this.options.position = new Cesium.CallbackProperty(
    _update_ellipse,
    false
    );
    this.options.ellipse.semiMinorAxis = new Cesium.CallbackProperty(
    _semiMinorAxis,
    false
    );
    this.options.ellipse.semiMajorAxis = new Cesium.CallbackProperty(
    _semiMinorAxis,
    false
    );
    this.options.ellipse.height = new Cesium.CallbackProperty(_height, false);
    viewer.entities.add(this.options);
};

    return _;
})();
};

    function getPointWithHeight(lng, lat) {
    let carto = new Cesium.Cartesian3.fromDegrees(lng, lat);
    let cartographic = Cesium.Cartographic.fromCartesian(carto);
    let elev = viewer.scene.globe.getHeight(cartographic);
    let c = new Cesium.Cartesian3.fromDegrees(lng, lat, elev);
    return c;
}

    function flyTo(lon, lat, height) {
    let carto = new Cesium.Cartesian3.fromDegrees(lon, lat);
    let cartographic = Cesium.Cartographic.fromCartesian(carto);
    let elev = viewer.scene.globe.getHeight(cartographic);
    let des = new Cesium.Cartesian3.fromDegrees(lon, lat, height + elev);
    viewer.camera.flyTo({
    destination: des,
    orientation: {
    //包含了方位(direction)、上方向(up)以及方位角(heading)、俯仰角(pitch)、滚动角(roll)属性的对象。
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-85),
    roll: 0.0,
},
    duration: 3, //飞行持续时间（以秒为单位）
});
}

    function flyToByView(view) {
    let cameraParam = viewer.camera;
    cameraParam.direction = new Cesium.Cartesian3(
    view.direction.x,
    view.direction.y,
    view.direction.z
    );
    cameraParam.position = new Cesium.Cartesian3(
    view.position.x,
    view.position.y,
    view.position.z
    );
    cameraParam.right = new Cesium.Cartesian3(
    view.right.x,
    view.right.y,
    view.right.z
    );
    cameraParam.up = new Cesium.Cartesian3(view.up.x, view.up.y, view.up.z);
}

    function zero_fill_hex(num, digits) {
    var s = num.toString(16);
    while (s.length < digits) s = "0" + s;
    return s;
}

    function bearing(start, end) {
    let rad = Math.PI / 180,
    lat1 = start.lat * rad,
    lat2 = end.lat * rad,
    lon1 = start.lon * rad,
    lon2 = end.lon * rad;
    const a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const b =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    return radiansToDegrees(Math.atan2(a, b));
}

    function Cartesian3ToDegree(cartesian3) {
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
    return {
    lon: Cesium.Math.toDegrees(cartographic.longitude),
    lat: Cesium.Math.toDegrees(cartographic.latitude),
    h: cartographic.height,
};
}

    /**
    * 经纬度坐标转墨卡托坐标
    * @param {经度(角度值)} longitude
    * @param {维度(角度值)} latitude
    */
    // 墨卡托坐标系：展开地球，赤道作为x轴，向东为x轴正方，本初子午线作为y轴，向北为y轴正方向。
    // 数字20037508.34是地球赤道周长的一半：地球半径6378137米，赤道周长2*PI*r = 2 * 20037508.3427892，墨卡托坐标x轴区间[-20037508.3427892,20037508.3427892]
    function lonLatToMercator(longitude, latitude) {
    var E = longitude;
    var N = latitude;
    var x = E * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + N) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return {
    x: x, //墨卡托x坐标——对应经度
    y: y, //墨卡托y坐标——对应维度
}
}

    /*
    * 弧度转换为角度
    */
    function radiansToDegrees(radians) {
    const degrees = radians % (2 * Math.PI);
    return (degrees * 180) / Math.PI;
}

    String.prototype.rgbToHex = function () {
    let rgb = this.toLowerCase();
    if (rgb.charAt(0) == "#") return rgb;

    var ds = rgb.split(/\D+/);
    var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
    return "#" + zero_fill_hex(decimal, 6);
};
    Date.prototype.format = function (fmt) {
    var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
};
    if (/(y+)/.test(fmt))
    fmt = fmt.replace(
    RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
    fmt = fmt.replace(
    RegExp.$1,
    RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
    );
    return fmt;
};

    /**
    * 获取当前时间零时区的表达格式
    * day 平移时间天数
    */
    function getNowTime(day) {
    let now = new Date();
    let nowStr = now.getFullYear();
    nowStr += "-";
    let m = now.getMonth() + 1;
    nowStr += m < 10 ? "0" + m : m;
    nowStr += "-";
    let dt = now.getDate();
    if (isNaN(day) == false) {
    dt += day;
}
    nowStr += dt < 10 ? "0" + dt : dt;
    nowStr += "T";
    let h = now.getHours() - 8;
    nowStr += h < 10 ? "0" + h : h;
    nowStr += ":";
    let mt = now.getMinutes();
    nowStr += mt < 10 ? "0" + mt : mt;
    nowStr += ":";
    let s = now.getSeconds();
    nowStr += s < 10 ? "0" + s : s;
    nowStr += "Z";
    return nowStr;
}

    function getHeight(lng, lat, callback) {
    var terrainProvider = viewer.terrainProvider;
    var positions = [Cesium.Cartographic.fromDegrees(lng, lat)];
    var promise = Cesium.sampleTerrain(terrainProvider, 11, positions);
    Cesium.when(promise, function (updatedPositions) {
    let cartographic = updatedPositions[0];
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let alt = cartographic.height;
    if (callback) {
    callback(lng, lat, alt);
}
});
}

    /**添加圆
    * center： {lng:,lat}
    */
    function addCircle(viewer, id, center, r, color, name) {
    let d = viewer.entities.add({
    id: id,
    position: Cesium.Cartesian3.fromDegrees(center.lng, center.lat),
    ellipse: {
    semiMinorAxis: new Cesium.CallbackProperty(function () {
    return r;
}, false),
    semiMajorAxis: new Cesium.CallbackProperty(function () {
    return r;
}, false),
    material: color ? color : new Cesium.Color(0, 0, 1, 0.8),
    outline: true,
},
    label:
    name && name.length > 0
    ? {
    text: name,
    show: true,
    showBackground: true,
    font: "14px monospace",
    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
    pixelOffset: new Cesium.Cartesian2(-20, -18),
}
    : undefined,
});
    return d;
}

    function addZT(x, y, z) {
    var entities = viewer.entities;
    let cds = ellipse.geometry.coordinates[0];
    let ps = [];
    for (let i = 0; i < cds.length; i++) {
    ps.push(new Cesium.Cartesian3(x, y, z));
}
    entities.add({
    position: Cesium.Cartesian3.fromDegrees(-70.0, 45.0, 100000.0),
    cylinder: {
    hierarchy: new Cesium.PolygonHierarchy(ps),
    length: 200000.0,
    topRadius: 0,
    bottomRadius: 50000.0,
    outline: true,
    outlineColor: Cesium.Color.RED,
    outlineWidth: 4,
    material: Cesium.Color.fromRandom({ alpha: 1.0 }),
},
});
}

    let ThemeContainer = {};
    let subscribeTheme = function (topic, handler) {
    if (undefined == ThemeContainer[topic]) {
    ThemeContainer[topic] = [];
}
    let has = false;
    for (let i = 0; i < ThemeContainer[topic].length; i++) {
    if (ThemeContainer[topic][i] === handler) {
    has = true;
}
}
    if (has == false) {
    ThemeContainer[topic].push(handler);
}
};
    let unSubscribeTheme = function (topic, handler) {
    if (ThemeContainer[topic]) {
    for (let i = 0; i < ThemeContainer[topic].length; i++) {
    if (handler === ThemeContainer[topic][i]) {
    ThemeContainer[topic].splice(i, 1);
    break;
}
}
}
};

    let publishTheme = function (topic, paramArray) {
    if (topic == themeType.FeatureClick) {
    for (let ids in featureClickContainer) {
    let id = ids.split(',');
    if (id.indexOf(paramArray[0].id) != -1) {
    featureClickContainer[ids](paramArray);
}
}
} else if (ThemeContainer[topic]) {
    for (let i = 0; i < ThemeContainer[topic].length; i++) {
    ThemeContainer[topic][i](paramArray);
}
}
};
    let featureClickContainer = {};
    let regFeatureClicked = function (ids, handler) {
    featureClickContainer[ids.toString()] = handler;
}
    let unRegFeatureClick = function (ids) {
    delete featureClickContainer[ids];
}
    let wfsOption = {
    featureNS: "http://www.oet.cn/",
    workZone: "oet",
};
    let initFormat = function (url, layerName) {
    let format = new ol.format.WFS({
    featureNS: wfsOption.featureNS,
    featureType: layerName,
    schemaLocation:
    "http://www.opengis.net/wfs \
                 http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd \
                 " +
    "/geoserver/oet/ows?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=" +
    layerName
});
    return format;
};
    let saveFeatures = function (url, layerName, features, p, callback, type) {
    let fs = [];
    for (let i = 0; i < features.length; i++) {
    let feature = new ol.Feature();
    feature.setGeometryName("geo_range");
    let geom;
    if (undefined == type) {
    geom = new ol.geom.MultiPolygon([
    features[i].getGeometry().getCoordinates(),
    ]);
} else if (type == "point") {
    geom = new ol.geom.Point(
    features[i].getGeometry().getCoordinates(),
    "XY"
    );
}
    feature.setGeometry(geom);
    feature.setProperties(p);
    fs.push(feature);
}
    let format = initFormat(url, layerName);
    //前三个参数分别是要新增，修改，删除的要素数组
    var node = format.writeTransaction(fs, null, null, {
    gmlOptions: {
    srsName: "CRS:84",
},
    featureNS: wfsOption.featureNS,
    featureType: layerName,
});
    let data = new XMLSerializer().serializeToString(node);
    console.log(data);
    $.ajax({
    type: "post",
    url: url,
    data: data,
    headers: {
    "Content-Type": "text/xml",
    //'authorization': 'Basic ' + that.global.wfsOption.authorization
},
    success: function (results) {
    var result = format.readTransactionResponse(results).transactionSummary;
    if (result) {
    callback(result.totalInserted == fs.length);
}
},
    error: function (err) {
},
});
};
    /**
    *
    * @param {包含id，pid属性的对象数组} data
    */
    let generateTreeNode = function (data) {
    for (let j = data.length - 1; j >= 0; j--) {
    let e = data[j];
    if (e.pid == null) {
    e.children = e.children || [];
    for (let i = 0; i < data.length; i++) {
    if (data[i].pid == e.id) {
    e.children.push(data[i]);
    data.splice(i, 1);
}
}
} else {
    for (let i = 0; i < data.length; i++) {
    if (data[i].id == e.pid) {
    data[i].children = data[i].children || [];
    data[i].children.push(e);
    data.splice(j, 1);
    break;
}
}
}
}
}
    let addPointIcon = function ({ lon, lat, url, text, scale ,horizontalOrigin}) {
    let m={
    position: Cesium.Cartesian3.fromDegrees(lon, lat),
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    billboard: {
    image: url || 'static/images/position.png',
    scale: scale || 1,
    // width: 30,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    horizontalOrigin:horizontalOrigin ?horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
},

};
    if(text){
    m.label= {
    text: text,

    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    font: "normal 16px MicroSoft YaHei",
    fillColor: Cesium.Color.RED,
    //pixelOffset : new Cesium.Cartesian2(100.0, 900)
    pixelOffset: new Cesium.Cartesian2(0, -60) // default: (0, 0)
    // eyeOffset: new Cesium.Cartesian3(20.0, 0.0, 0.0), // default
}
}
    return viewer.entities.add(m);
}
    let addPointModel = function (lng, lat, url, name) {
    let ps = Cesium.Cartesian3.fromDegrees(lng, lat, 20);
    let entity = viewer.entities.add({
    position: ps,
    orientation: Cesium.Transforms.headingPitchRollQuaternion(
    ps,
    new Cesium.HeadingPitchRoll(
    Cesium.Math.toRadians(90),
    Cesium.Math.toRadians(0),
    Cesium.Math.toRadians(0)
    )
    ),
    model: {
    uri: url,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    minimumPixelSize: 28,
    maximumScale: 50,
    scale: 1,
},
    label:
    name && name.length > 0
    ? {
    text: name,
    font: "14pt sans-serif",
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
    verticalOrigin: Cesium.VerticalOrigin.BASELINE,
    fillColor: Cesium.Color.BLUE,
    showBackground: true,
    scaleByDistance: new Cesium.NearFarScalar(
    1.5e2,
    1.5,
    8.0e2,
    0.1
    ),
    backgroundColor: new Cesium.Color(
    11 / 255,
    37 / 255,
    132 / 255,
    0.5
    ),
    backgroundPadding: new Cesium.Cartesian2(8, 4),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    10,
    3000000
    ),
    //disableDepthTestDistance: Number.POSITIVE_INFINITY, // draws the label in front of terrain
    //eyeOffset: new Cesium.Cartesian3(0, 70, 0)
}
    : undefined,
});
    return entity.id;
}
    let addPolygon = function (coordinates, fillColor, lineColor, id) {
    let cds = [];
    lineColor = lineColor || [0, 255, 255, 0.5]
    coordinates.forEach(coord => {
    let cd = new Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
    cds.push(cd);
});
    let fill = new Cesium.Color(
    fillColor[0] / 255,
    fillColor[1] / 255,
    fillColor[2] / 255,
    fillColor[3]
    );
    let border = new Cesium.Color(
    lineColor[0] / 255,
    lineColor[1] / 255,
    lineColor[2] / 255,
    lineColor[3]
    );
    let option = {
    polygon: {
    material: fill,
    perPositionHeight: false,
    hierarchy: {
    positions: cds
}
},
    polyline: {
    clampToGround: true,
    width: 2,
    material: Cesium.Color.YELLOW,
    positions: cds
}
}
    if (id) {
    option.id = id
}
    console.log('id', id);
    let polygon = viewer.entities.add(option);

    return polygon.id;

}
    let removeFeature = function (id) {
    let target = viewer.entities.getById(id);
    if (target) {
    viewer.entities.removeById(id)
}
}
    let FeatureManager = {
    addPointIcon,
    addPointModel,
    addPolygon,
    removeFeature
}
    /*
    添加扫描线 depth关闭
    cartographicCenter 扫描中心
    maxRadius 最大半径 米
    scanColor 扫描颜色
    duration 持续时间 毫秒
    */
    let AddCircleScanPostStage = function (
    cartographicCenter,
    maxRadius,
    scanColor,
    duration
    ) {
    var ScanSegmentShader =
    "uniform sampler2D colorTexture;\n" +
    "uniform sampler2D depthTexture;\n" +
    "varying vec2 v_textureCoordinates;\n" +
    "uniform vec4 u_scanCenterEC;\n" +
    "uniform vec3 u_scanPlaneNormalEC;\n" +
    "uniform float u_radius;\n" +
    "uniform vec4 u_scanColor;\n" +
    "vec4 toEye(in vec2 uv, in float depth)\n" +
    " {\n" +
    " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
    " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
    " posInCamera =posInCamera / posInCamera.w;\n" +
    " return posInCamera;\n" +
    " }\n" +
    "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
    "{\n" +
    "vec3 v01 = point -planeOrigin;\n" +
    "float d = dot(planeNormal, v01) ;\n" +
    "return (point - planeNormal * d);\n" +
    "}\n" +
    "float getDepth(in vec4 depth)\n" +
    "{\n" +
    "float z_window = czm_unpackDepth(depth);\n" +
    "z_window = czm_reverseLogDepth(z_window);\n" +
    "float n_range = czm_depthRange.near;\n" +
    "float f_range = czm_depthRange.far;\n" +
    "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
    "}\n" +
    "void main()\n" +
    "{\n" +
    "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
    "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
    "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
    "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
    "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
    "if(dis < u_radius)\n" +
    "{\n" +
    "float f = 1.0 -abs(u_radius - dis) / u_radius;\n" +
    "f = pow(f, 4.0);\n" +
    "gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n" +
    "}\n" +
    "}\n";

    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    var _Cartesian4Center = new Cesium.Cartesian4(
    _Cartesian3Center.x,
    _Cartesian3Center.y,
    _Cartesian3Center.z,
    1
    );
    var _CartographicCenter1 = new Cesium.Cartographic(
    cartographicCenter.longitude,
    cartographicCenter.latitude,
    cartographicCenter.height + 500
    );
    var _Cartesian3Center1 =
    Cesium.Cartographic.toCartesian(_CartographicCenter1);
    var _Cartesian4Center1 = new Cesium.Cartesian4(
    _Cartesian3Center1.x,
    _Cartesian3Center1.y,
    _Cartesian3Center1.z,
    1
    );
    var _time = new Date().getTime();
    var _scratchCartesian4Center = new Cesium.Cartesian4();
    var _scratchCartesian4Center1 = new Cesium.Cartesian4();
    var _scratchCartesian3Normal = new Cesium.Cartesian3();
    var ScanPostStage = new Cesium.PostProcessStage({
    fragmentShader: ScanSegmentShader,
    uniforms: {
    u_scanCenterEC: function () {
    return Cesium.Matrix4.multiplyByVector(
    viewer.camera._viewMatrix,
    _Cartesian4Center,
    _scratchCartesian4Center
    );
},
    u_scanPlaneNormalEC: function () {
    var temp = Cesium.Matrix4.multiplyByVector(
    viewer.camera._viewMatrix,
    _Cartesian4Center,
    _scratchCartesian4Center
    );
    var temp1 = Cesium.Matrix4.multiplyByVector(
    viewer.camera._viewMatrix,
    _Cartesian4Center1,
    _scratchCartesian4Center1
    );
    _scratchCartesian3Normal.x = temp1.x - temp.x;
    _scratchCartesian3Normal.y = temp1.y - temp.y;
    _scratchCartesian3Normal.z = temp1.z - temp.z;
    Cesium.Cartesian3.normalize(
    _scratchCartesian3Normal,
    _scratchCartesian3Normal
    );
    return _scratchCartesian3Normal;
},
    u_radius: function () {
    return (
    (maxRadius * ((new Date().getTime() - _time) % duration)) / duration
    );
},
    u_scanColor: scanColor,
},
});
    return viewer.scene.postProcessStages.add(ScanPostStage);
};
    let addPie = function (option) {
    let olon = option.lon;
    let olat = option.lat;
    let hd = option.hd ? option.hd : 10000;
    let ar = [];
    let ar1 = [];
    let ec = 6356725 + (6378137 - 6356725) * (90 - olat) / 90;
    let ed = ec * Math.cos(olat * Math.PI / 180);
    let bs = 12;
    ec *= bs;
    ed *= bs;
    for (let i = 0; i < 360;) {
    i += 0.01;
    let clon = 100000 * Math.sin(i * Math.PI / 180);
    let clat = 100000 * Math.cos(i * Math.PI / 180);

    let jlon = (clon / ed + olon * Math.PI / 180) * 180 / Math.PI;
    let jlat = (clat / ec + olat * Math.PI / 180) * 180 / Math.PI;


    if (i <= option.percent * 3.6) {
    ar1.push(jlon, jlat);
} else {
    ar.push(jlon, jlat);
}

}
    ar1.push(olon, olat);
    ar.push(olon, olat);
    var redPolygon = viewer.entities.add({
    name: "Red polygon on surface",
    polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray(
    ar1
    ),
    material: Cesium.Color.GREEN,
    extrudedHeight: hd,
},
});
    var redPolygon2 = viewer.entities.add({
    name: "Red polygon on surface",
    polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray(
    ar
    ),
    material: Cesium.Color.BLUE,
    extrudedHeight: hd,
},
    label: {
    text: option.percent * 100 + "%",
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
}
});

    viewer.zoomTo(redPolygon2);
    return redPolygon.id + "$" + redPolygon2.id;
}
    let removePie = function (id) {
    let ids = id.split("$");
    viewer.entities.removeById(ids[0]);
    viewer.entities.removeById(ids[1]);
}
    let addCrossLine = function (option) {
    let lon1 = option.pt1.lon, lat1 = option.pt1.lat;
    let lon2 = option.pt2.lon, lat2 = option.pt2.lat;
    var from = turf.point([lon1, lat1]);
    var to = turf.point([lon2, lat2]);
    var units = "kilometers";
    var options = { units: units };

    var distance = turf.distance(from, to, options);
    var point = turf.point([lon1, lat1]);
    let point1 = turf.point([lon2, lat2]);
    var distance = 1.5 * distance;
    var bearing = option.bearing1;
    var bearing1 = option.bearing2;
    var options = { units: units };
    var destination = turf.destination(point, distance, bearing, options);
    var destination1 = turf.destination(point1, distance, bearing1, options);
    let t1 = destination.geometry.coordinates, t2 = destination1.geometry.coordinates;
    console.log("计算交点结果:"+t1)
    var line1 = turf.lineString([[lon1, lat1], t1]);
    var line2 = turf.lineString([[lon2, lat2], t2]);
    var intersects = turf.lineIntersect(line1, line2);
    if (intersects && intersects.features && intersects.features.length > 0) {
    let re = intersects.features[0].geometry.coordinates;
    let jl1=turf.distance(intersects.features[0], turf.point([lon1, lat1]), options).toFixed(2);
    let jl2=turf.distance(intersects.features[0], turf.point([lon2, lat2]), options).toFixed(2);
    let p= addPointIcon({lon:re[0], lat:re[1],scale:0.2,text:'信号源\n(距离'+option.text1+jl1+"km,距离"+option.text2+jl2+"km)"});
    let p1= addPointIcon({lon:lon1, lat:lat1,scale:0.5,url:'static/images/qz.png',horizontalOrigin : Cesium.HorizontalOrigin.LEFT,text:option.text1+"(方位角:"+option.bearing1+")"});
    let p2= addPointIcon({lon:lon2, lat:lat2,scale:0.5,url:'static/images/qz.png',horizontalOrigin : Cesium.HorizontalOrigin.LEFT,text:option.text2+"(方位角:"+option.bearing2+")"});
    let entities = viewer.entities;
    let l1cds=Cesium.Cartesian3.fromDegreesArray([lon1, lat1, t1[0], t1[1]]),
    l2cds=Cesium.Cartesian3.fromDegreesArray([lon2, lat2, t2[0], t2[1]]);
    let l1 = entities.add({
    polyline: {
    positions: l1cds,
    width: 10.0,
    clampToGround:true,
    material: new Cesium.PolylineGlowMaterialProperty({
    color: Cesium.Color.DEEPSKYBLUE,
    glowPower: 0.25,
}),
},
});
    let l2 = entities.add({
    polyline: {
    positions: l2cds,
    width: 10.0,
    clampToGround:true,
    material: new Cesium.PolylineGlowMaterialProperty({
    color: Cesium.Color.DEEPSKYBLUE,
    glowPower: 0.25,
}),
},
});
    let ids= [p.id,l1.id,l2.id,p1.id,p2.id];
    return ids;
}
}
    let removeCrossLine=function(ids){
    ids.forEach(id=>{
        viewer.entities.removeById(id);
    })
}
    let signUnit = "dBμV";
    let Theme = {
    subscribeTheme,
    unSubscribeTheme,
    publishTheme,
    regFeatureClicked,
    unRegFeatureClick
};
    let themeType = {
    MapClick: "MapClick",
    FeatureClick: "featureClick",
    SysParamChanged: "SysParamChanged",
    SateliteMoving: "SateliteMoving",
    SateliteDeleted: "SateliteDeleted",
    ViewProgramLoaded: "viewProgramLoaded",
    ViewProgramUpdate: "ViewProgramUpdate",
    LayerVisibleChanged: "LayerVisibleChanged",
    MapRightClicked: "MapRightClicked",
    FileDroped: "FileDroped",
    ExpandChanged: "ExpandChanged",
    OnlineCountChanged: "OnlineCountChanged",
    equipmentExInited: "equipmentExInited",
    MapHeightViewChanged: "MapHeightViewChanged",
};
    export default {
    getHeight,
    addCircle,
    Theme,
    themeType,
    getNowTime,
    Cartesian3ToDegree,
    bearing,
    measureHeight,
    getPointWithHeight,
    getParallelLines,
    saveFeatures,
    AddCircleScanPostStage,
    setBaseLayerTrans,
    clearKey,
    getToken,
    getUserInfo,
    signUnit,
    lonLatToMercator,
    generateTreeNode,
    FeatureManager,
    flyTo,
    flyToByView,
    addPie,
    removePie,
    addCrossLine,
    removeCrossLine
};

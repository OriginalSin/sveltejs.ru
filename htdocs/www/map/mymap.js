//console.log('conf', conf);

var map = L.map(L.DomUtil.create('div', 'map', document.body), {
	center: [55.758031, 37.611694],
	zoom: 8,
})


var Mercator = L.TileLayer.extend({
	options: {
		tilesCRS: L.CRS.EPSG3395,
	},
	/*
	_tileOnLoad: function(done, tile) {
		done(null, tile)
		var file = tile.getAttribute('src')
		if (file.indexOf('http') === 0) {
			// console.log('_tileOnLoad', file, tile, tile._file, file.split('/'));
			//fse.ensureDirSync(tile._file.replace(/\d+.png$/, ''))
			//download.image({ url: file, dest: tile._file }).catch(console.error)
		}
	},
	_tileOnError: function(done, tile, e) {
		var file = tile.getAttribute('src')

		// if (file.indexOf('../tiles/') === 0) {
			// tile._file = file.substr(1)
			// var arr = file.split('/')
			// tile.src = L.Util.template(conf.layers[arr[2]].errorTileUrl, {
				// z: arr[3],
				// x: arr[4],
				// y: arr[5].replace('.png', ''),
			// })
		// }
		done(e, tile)
	},*/
	_getTiledPixelBounds: function(center) {
		var pixelBounds = L.TileLayer.prototype._getTiledPixelBounds.call(
			this,
			center
		)
		this._shiftY = this._getShiftY(this._tileZoom)
		pixelBounds.min.y += this._shiftY
		pixelBounds.max.y += this._shiftY
		return pixelBounds
	},

	_getTilePos: function(coords) {
		var tilePos = L.TileLayer.prototype._getTilePos.call(this, coords)
		return tilePos.subtract([0, this._shiftY])
	},

	_getShiftY: function(zoom) {
		var map = this._map,
			pos = map.getCenter(),
			shift =
				map.options.crs.project(pos).y - this.options.tilesCRS.project(pos).y

		return Math.floor(L.CRS.scale(zoom) * shift / 40075016.685578496)
	},
})
L.TileLayer.Mercator = Mercator
L.tileLayer.Mercator = function(url, options) {
	return new Mercator(url, options)
}

var baseLayers = conf.baseLayers.reduce((p, c) => {
	var m = conf.layers[c],
		func = m.type == 'Mercator' ? L.tileLayer.Mercator : L.tileLayer;
	p[m.title] = func(m.urlTemplate, m.options);
	return p;
}, {});

var overlays = conf.overlays.reduce((p, c) => {
	var m = conf.layers[c],
		func = m.type == 'Mercator' ? L.tileLayer.Mercator : L.tileLayer;
	p[m.title] = func(m.urlTemplate, m.options);
	return p;
}, {});
overlays.Marker = L.marker([55.758031, 37.611694])
	.bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
	.openPopup();

baseLayers.OSM.addTo(map);
L.control.layers(baseLayers, overlays).addTo(map);

const fs = require('fs');
const fse = require('fs-extra');
const fetch = require('node-fetch');

const conf = require('./config');

const getTileImage = function(blKey, tile) {
	let cnf = conf.layers[blKey],
		zxy = tile.z + '/' + tile.x + '/' + tile.y + '.png',
		dest = './../../htdocs/www/map/tiles/' + blKey + '/' + zxy,
		destFolder = dest.replace(/\d+.png$/, ''),
		errorTileUrl = cnf.errorTileUrl,
		url = cnf.errorTileUrl;

	fse.ensureDirSync(destFolder);
	for (let k in tile) { url = url.replace('{' + k + '}', tile[k]); }
	url = url.replace('{s}', 'b');

	fetch(url, {
		headers: {
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36'
		}
	})
	.then(req => req.buffer())
	.then((data) => {
		// console.log('ddd', data.length);
		var wstream = fs.createWriteStream(dest);
		wstream.write(data);
		wstream.end();	
	});
	return url;
};

const mapcache = function(req, res, next) {
	let arr = req.url.split('/');
	if (arr.length < 7) {
		next();
	} else {
		// res.redirect(301, getTileImage(arr[3],
		res.redirect(getTileImage(arr[3],
			{
				z: arr[4],
				x: arr[5],
				y: arr[6].replace('.png', ''),
			}
		));
	}
};

module.exports = mapcache;

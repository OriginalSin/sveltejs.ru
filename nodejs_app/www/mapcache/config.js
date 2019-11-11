const yandex =
	'&copy; <a href="https://n.maps.yandex.ru/?oid=1900133#!/?z=18&ll=36.860478%2C55.429679&l=nk%23map">Yandex</a> contributors'
var conf = {
	layers: {
		om: {
			title: 'OSM',
			urlTemplate: './tiles/om/{z}/{x}/{y}.png',
			errorTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				minZoom: 1,
				maxZoom: 19,
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			},
		},
		y1: {
			title: 'Карта(Яндекс)',
			urlTemplate: '../tiles/y1/{z}/{x}/{y}.png',
			errorTileUrl:
				'https://vec01.maps.yandex.net/tiles?l=map&v=18.01.10-2&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
			type: 'Leaflet.tileLayer.Mercator',
			options: {
				maxZoom: 19,
				attribution: yandex,
			},
		},
		ys: {
			title: 'Снимки(Яндекс)',
			urlTemplate: '../tiles/ys/{z}/{x}/{y}.png',
			errorTileUrl:
				'https://sat04.maps.yandex.net/tiles?l=sat&v=3.462.0&x={x}&y={y}&z={z}&lang=ru_RU',
			type: 'Leaflet.tileLayer.Mercator',
			options: {
				maxZoom: 19,
				attribution: yandex,
			},
		},
		yd1: {
			title: 'Дороги',
			urlTemplate: '../tiles/yd1/{z}/{x}/{y}.png',
			errorTileUrl:
				'https://04.core-nmaps-renderer-nmaps.maps.yandex.net?x={x}&y={y}&z={z}&l=mpskl&sl=104,301135,301750,302526,5300026,5400046,70300482,70300490,70300627',
			type: 'Leaflet.tileLayer.Mercator',
			options: {
				minZoom: 8,
				maxZoom: 19,
				attribution: yandex,
			},
		},
		yd2: {
			title: 'Скорости',
			urlTemplate: '../tiles/yd2/{z}/{x}/{y}.png',
			errorTileUrl:
				'https://01.core-nmaps-renderer-nmaps.maps.yandex.net?x={x}&y={y}&z={z}&l=mpskl&sl=104,301135,301750,302526,302827,5300026,5400046,70300236,70300638',
			type: 'Leaflet.tileLayer.Mercator',
			options: {
				minZoom: 8,
				maxZoom: 19,
				attribution: yandex,
			},
		},
		yd3: {
			title: 'Светофоры',
			urlTemplate: '../tiles/yd3/{z}/{x}/{y}.png',
			postfix: '?x={x}&y={y}&z={z}&l=mpskl&sl=301750',
			errorTileUrl: '//01.core-nmaps-renderer-nmaps.maps.yandex.net?x={x}&y={y}&z={z}&l=mpskl&sl=301750',
			options: {
				key: 'm4',
				minZoom: 8,
				maxZoom: 19,
				attribution: yandex,
			}
		},
	},
}

// export default conf
module.exports = conf;

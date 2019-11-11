const fetch = require('node-fetch'),
	fs = require('fs-extra'),
	mysql = require('mysql')
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'host1730430_serg',
		password : '1fb6e4e1',
		database : 'host1730430_ais'
	});
	// pool  = mysql.createPool({
		// connectionLimit : 10,
		// host            : 'localhost',
		// user            : 'host1730430_serg',
		// password        : '1fb6e4e1',
		// database        : 'host1730430_ais'
	// });
const file = './test.txt',
	delta = 15,
	// delta = 60*24,
	authKey = '2a571394-4113-4721-910d-94c4b8629f8b',
	dateToStr = (dt) => {
		let month = 1 + dt.getUTCMonth(),
			d = dt.getUTCDate(),
			h = dt.getUTCHours(),
			m = dt.getUTCMinutes();
		return dt.getUTCFullYear()
			+ (month < 10 ? '0' : '') + month 
			+ (d < 10 ? '0' : '') + d 
			+ (h < 10 ? '0' : '') + h 
			+ (m < 10 ? '0' : '') + m; 
	},
	cur = new Date(),
	// cur = new Date(2018, 11, 17),
	end = dateToStr(cur),
	beg = dateToStr(new Date(cur.getTime() - delta*60*1000));
	filter = '<Filter><And><PropertyIsGreaterThanOrEqualTo><PropertyName>ts_pos_utc</PropertyName><Literal>' + beg +'</Literal></PropertyIsGreaterThanOrEqualTo><PropertyIsLessThan><PropertyName>ts_pos_utc</PropertyName><Literal>' + end +'</Literal></PropertyIsLessThan></And></Filter>';

let url = 'https://gws.exactearth.com/wfs?service=wfs&version=1.1&request=GetFeature&typeName=exactAIS:LVI&outputFormat=json';
url += '&filter=' + encodeURI(filter);
url += '&authKey=' + authKey;
// console.log(url);

fetch(url)
    .then(res => res.json())
    .then(json => {
		// json.url = url;
		// console.log(json);
		
		let arr = json.features.map((it) => {
			let prp = it.properties;
			return	'('
					+ [
						prp.mmsi, prp.imo || 0,
						connection.escape(prp.vessel_name),
						prp.vessel_type_code || 0,
						prp.longitude, prp.latitude,
						prp.cog, prp.sog, prp.ts_pos_utc,
						connection.escape(JSON.stringify(it))
					].join(',')
					+ ')';
		});

		let zap = 'INSERT INTO ais_names (mmsi, imo, vessel_name, vessel_type_code, lng, lat, cog, sog, ts_pos_utc, json)';
		zap += ' VALUES '+ arr.join(',');
		zap += ' ON DUPLICATE KEY UPDATE cnt=cnt+1, lng=VALUES(lng), lat=VALUES(lat), cog=VALUES(cog), sog=VALUES(sog), ts_pos_utc=VALUES(ts_pos_utc)';
		json.zap = zap;
		// fs.outputFile(file, JSON.stringify(json, null, '\t'));

		if (arr.length) {
			console.log('Получено строк: ', arr.length);
			connection.connect();

			connection.query(zap
				  // ,
				 //timeout: 400, // 40s
				  // values: arr
				, function (err, rows, fields) {
					if (err) throw err
					console.log('Результат: ', rows);
					// console.log('The solution is: ', err, rows, fields)
			});

			connection.end();
		}
	}).catch(console.log);
	
	
//var _array_path_to_keys = function(path, keys){
	//let obj = {}
	//if(Array.isArray(path) && path.length > 1){
		//let first = path.shift()
		//obj[first] = keys
		//return _array_path_to_keys(path, obj)
	//}
	//else if(Array.isArray(path)){
		//obj[path[0]] = keys
		//return obj
	//}
	//else{
		//obj[path] = keys
		//return obj
	//}
//}

var extract_data_os = function(doc){
	let keys = {}
	let path = ''
	let host = ''

	if(Array.isArray(doc)){
		Object.each(doc[0].doc.data, function(data, key){
			keys[key] = []
		})

		// path = doc[0].doc.metadata.path.replace(/\./g, '/')
		path = doc[0].doc.metadata.path.replace(/\./g, '_')
		// path = doc[0].metadata.path.split('.')
		host = doc[0].doc.metadata.host

		Array.each(doc, function(item){
			Object.each(item.doc.data, function(value, key){
				let data = {value: value, timestamp: item.doc.metadata.timestamp}
				if(keys[key])
					keys[key].push(data)
			})
		}.bind(this))
	}
	else {
		Object.each(doc.data, function(data, key){
			keys[key] = null
		})
		// path = doc.metadata.path.replace(/\./g, '/')
		path = doc.metadata.path.replace(/\./g, '_')
		// path = doc.metadata.path.split('.')
		host = doc.metadata.host

		Object.each(doc.data, function(value, key){
			let data = {value: value, timestamp: doc.metadata.timestamp}
			keys[key] = data
		})
	}

	// if(path.length > 1){
  //
	// 	let tmp_path = Array.clone(path)
	// 	path = tmp_path.shift()
	// 	let tmp_keys = Object.clone(keys)
  //
  //
	// 	keys = _array_path_to_keys(tmp_path, tmp_keys)
	// }
	// else{
	// 	path = path[0]
	// }


	return {keys: keys, path: path, host: host}
}

module.exports = {
	/**
	* from os.stats.vue
	**/
	extract_data_os: extract_data_os,

	extract_data_os_historical: function (doc){
		let type = ''
		let range = {}
		if(Array.isArray(doc)){
			type = doc[0].doc.metadata.type
			range = doc[0].doc.metadata.range
		}
		else{
			type = doc.metadata.type
			range = doc.metadata.range
		}

		// let {keys, path, host} = this.extract_data_os(doc)
		let {keys, path, host} = extract_data_os(doc)
		path = path.replace('historical/os', 'os/'+type)

		Object.each(keys, function(data, key){
			if(Array.isArray(data)){
				Array.each(data, function(value, index){
					data[index].range = range
				})
			}
			else{
				data.range = range
			}
		})

		return {keys: keys, path: path, host: host}
	}
	/**
	* from os.stats.vue
	**/

}

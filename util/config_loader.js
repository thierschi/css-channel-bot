const fs = require('fs');

var attributes = new Map();

function load_config() {
	load_config(null);
}

function load_config(path) {
	if (path == null) path = 'config.json';

	var raw_data = fs.readFileSync(path);
	JSON_to_map(JSON.parse(raw_data));
}

function JSON_to_map(json_obj) {
	for (let property in json_obj) {
		attributes.set(property, json_obj[property]);
	}
}

function get_attr(attr_name) {
	return attributes.get(attr_name);
}

module.exports = {
	load_config,
	get_attr,
};

const fs = require('fs');
const toml = require('toml');

let parameters;

/**
 * Loads a toml config file at path in filesystem
 * Default location is "./config.toml"
 * 		when path == null || path==undefined
 *
 * @param {string} path to toml config file
 */
function load_config(path) {
	if (path == undefined || path == null) path = 'config.toml';

	let raw_data = fs.readFileSync(path);
	parameters = toml.parse(raw_data);
}

/**
 * Returns parameter of config-file at path.
 * Path-Syntax: [node]/.../[leaf (parameter)]
 *
 * @param {string} parameter_path: Path to cofig parameter
 */
function get(parameter_path) {
	let path = parameter_path.split('/');

	/**
	 * Traverse the tree down until parameter is found
	 */
	let subtree = parameters;
	for (let i = 0; i < path.length - 1; i++) {
		subtree = subtree[path[i]];

		if (subtree == undefined) {
			/**
			 * When subtree is undefinded => path is invalid
			 * throw error
			 */
			let error =
				"Path is invalid: There is no parameter '" + path[i] + "' in ";
			for (let j = 0; j < i; j++) {
				error += path[j] + '/';
			}
			error += '!';

			throw error;
		}
	}
	// return parameter
	return subtree[path[path.length - 1]];
}

module.exports = {
	load_config,
	get,
};

const globals = new Map();

function add(name, e) {
	globals.set(name, e);
}

function get(name) {
	return globals.get(name);
}

module.exports = {
	add,
	get,
};

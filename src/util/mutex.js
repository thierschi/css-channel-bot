const { EventEmitter } = require('events');

/**
 * Mutex Lock to lock variabels in async operations
 */
class Lock {
	constructor() {
		this.locked = false;
		this.ee = new EventEmitter();
	}

	aquire() {
		return new Promise((resolve) => {
			// Lock if nobody else has lock
			if (!this.locked) {
				// Safe because JS doesn't interrupt synchronus work
				this.locked = true;
				return resolve();
			}

			// Otherwise wait for the lock to be released and try to lock again
			const try_lock = () => {
				if (!this.locked) {
					this.locked = true;
					this.ee.removeListener('unlock', try_lock);
					return resolve();
				}
			};
			// Register as listener for unlock
			this.ee.on('unlock', try_lock);
		});
	}

	release() {
		this.locked = false;
		setImmediate(() => this.ee.emit('unlock'));
	}
}

module.exports = {
	Lock,
};

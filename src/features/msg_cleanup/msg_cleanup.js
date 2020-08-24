const Discord = require('discord.js');

const shared = require('../../util/shared_var');
const mutex = require('../../util/mutex');

// Array is used as queue using push and shift
// Lock for array because of async functions
let msg_queue_arr = [];
let msg_queue_arr_lock = new mutex.Lock();

/**
 * Add a message/ messages to cleanup queue
 *
 * @param {Discord.Message} msgs
 */
async function add(...msgs) {
	msgs.forEach((msg) => {
		if (!(msg instanceof Discord.Message))
			throw 'Parameter is not a message object!';

		msg_queue_arr_lock.aquire();
		{
			// Pushing Message IDs to array queueu
			msg_queue_arr.push({
				time: new Date().getTime(),
				guild: msg.guild.id,
				channel: msg.channel.id,
				msg: msg.id,
			});
		}
		msg_queue_arr_lock.release();
	});
	// console.log('Message Cleanup-queue length: ' + msg_queue_arr.length);
}

/**
 * Remove msg from queue, to not get deleted
 *
 * @param {*} id, of message to be ignored
 */
async function ignore(id) {
	msg_queue_arr_lock.aquire();
	{
		// Search for id in queue und remove it when found
		for (let i = 0; i < 0; i++) {
			if (msg_queue_arr[i].msg == id) {
				msg_queue_arr.splice(i, 1);
			}
		}
	}
	msg_queue_arr_lock.release();
}

/**
 * Clean all messages whos timestamp is falls out of the given period
 *
 * @param {String} period, of messages to be keeped (for now)
 */
async function clean(period) {
	delete_messages(to_millies(period));
}

/**
 * Set up periodic cleanup shedule
 *
 * @param {String} period -> Delete all messages older than period, every period
 */
async function periodic_cleanup(period) {
	let millies = to_millies(period);

	while (true) {
		await new Promise((resolve) => setTimeout(resolve, millies));
		delete_messages(millies);
	}
}

/**
 * Delete the all messages that were added longer than millies ms ago
 *
 * @param {long} millies
 */
function delete_messages(millies) {
	let threshold = new Date().getTime() - millies;

	let no_messages_cleaned = 0;
	while (msg_queue_arr.length != 0) {
		/* If the next element in the queue (here index 0 of array) is
		over the given threshold, all elements in the queue are,
		hence deletion can be stopped */
		if (msg_queue_arr[0].time > threshold) break;

		let next;

		msg_queue_arr_lock.aquire();
		{
			next = msg_queue_arr.shift();
		}
		msg_queue_arr_lock.release();

		shared
			.get('Client')
			.guilds.cache.get(next.guild)
			.channels.cache.get(next.channel)
			.messages.fetch(next.msg)
			.then((msg) => msg.delete());

		no_messages_cleaned++;
	}

	if (no_messages_cleaned != 0)
		console.log(
			`[Info][${new Date().toISOString()}]: Cleaned ${no_messages_cleaned} messages.`
		);
}

/**
 * Converts period-string of the following form to ms
 *
 * Format:
 * 		[Number][Unit]
 * 		With unit being:
 * 			d - Days
 * 			h - Hours
 * 			min - Minutes
 * 			s - Seconds
 *
 * @param {String} s, period-string
 */
function to_millies(s) {
	s.toLowerCase();

	let millies;
	switch (s.slice(-1)) {
		case 'n':
			millies = s.slice(0, -3) * 60 * 1000;
			break;
		case 'h':
			millies = s.slice(0, -1) * 60 * 60 * 1000;
			break;
		case 'd':
			millies = s.slice(0, -1) * 24 * 60 * 60 * 1000;
			break;
		case 's':
			millies = s.slice(0, -1) * 1000;
			break;
		default:
			throw 'Invalid period string!';
	}
	return millies;
}

module.exports = {
	add,
	ignore,
	clean,
	periodic_cleanup,
};

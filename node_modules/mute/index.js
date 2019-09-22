'use strict';

/**
 * # `mute`
 *
 * Politely tells one or more streams to shut the heck up for a moment by temporarily reassigning
 * their write methods. Useful when testing noisey modules which lack verbosity options.
 */

var concat = Array.prototype.concat;

function mute(stream) {
	var write = stream && stream.write;
	var originalWrite = write && write.originalWrite;

	// We only need to mute unmuted streams
	if (!write || originalWrite) {
		return;
	}

	function noop() {}
	noop.originalWrite = write;
	stream.write = noop;
}

function unmute(stream) {
	var write = stream && stream.write;
	var originalWrite = write && write.originalWrite;

	// We only need to unmute muted streams
	if (!write || !originalWrite) {
		return;
	}

	stream.write = originalWrite;
}

/**
 * @type Function
 * @param {Stream,Array.<Stream>} ...streams Streams to mute. Defaults to `stdout` and `stderr`.
 * @return {Function} An unmute function.
 */
module.exports = function muteStreams() {
	var streams = concat.apply([], arguments);

	if (!streams.length) {
		streams = [process.stdout, process.stderr];
	}

	streams.forEach(mute);

	return function unmuteStreams() {
		streams.forEach(unmute);
	};
};

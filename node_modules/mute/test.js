import { Writable } from 'stream';
import mute from './index';
import it from 'ava';

it('should mute a stream', async assert => {
	var stream = new Writable();
	var orig = stream.write;

	mute(stream);

	assert.not(stream.write, orig);
});

it('should not mute a muted stream', async assert => {
	var stream = new Writable();
	var orig = stream.write;

	mute(stream);

	var noop = stream.write;

	mute(stream);

	assert.not(stream.write, orig);
	assert.is(stream.write, noop);
});

it('should unmute a stream', async assert => {
	var stream = new Writable();
	var orig = stream.write;
	var unmute = mute(stream);

	unmute();

	assert.is(stream.write, orig);
});

it('should not unmute a non-muted stream', async assert => {
	var a = new Writable();
	var origA = a.write;
	var unmuteA = mute(a);

	var b = new Writable();
	var origB = b.write;
	var unmuteB = mute(a, b);

	assert.not(a.write, origA);
	assert.not(b.write, origB);

	unmuteA();

	assert.is(a.write, origA);
	assert.not(b.write, origB);

	unmuteB();

	assert.is(a.write, origA);
	assert.is(b.write, origB);
});

it('should mute stdout and stderr by default', async assert => {
	var origStdout = process.stdout.write;
	var origStderr = process.stderr.write;
	var unmute = mute();

	console.log('nice try stdout');
	console.error('nice try stderr');

	assert.not(process.stdout.write, origStdout);
	assert.not(process.stderr.write, origStderr);

	unmute();

	assert.is(process.stdout.write, origStdout);
	assert.is(process.stderr.write, origStderr);
});

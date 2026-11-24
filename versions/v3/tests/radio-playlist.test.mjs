import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { nextRadioTrack, radioTracks } from '../src/state/radioTracks.ts';

test('radio starts at the first track, advances in order, then wraps', () => {
  let current = -1;
  for (let i = 0; i <= radioTracks.length; i++) {
    current = nextRadioTrack(current, radioTracks.length);
    assert.equal(current, i % radioTracks.length);
  }
  assert.equal(nextRadioTrack(0, 1), 0);
  assert.equal(nextRadioTrack(-1, 0), -1);
});

test('each playlist entry matches the credits and a local recording', () => {
  const credits = JSON.parse(readFileSync(new URL('../public/audio/credits.json', import.meta.url)));
  assert.deepEqual(radioTracks.map(track => ({
    file: track.src.split('/').pop(),
    title: track.title,
    composer: track.composer,
  })), credits.tracks);
  for (const track of radioTracks) {
    assert.ok(existsSync(new URL('../public' + track.src, import.meta.url)));
  }
});

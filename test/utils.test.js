const { test } = require('node:test');
const assert = require('node:assert');
const { formatUptime } = require('../src/utils');

test('formatUptime formats seconds only', () => {
  assert.strictEqual(formatUptime(5), '5s');
});

test('formatUptime formats minutes and seconds', () => {
  assert.strictEqual(formatUptime(125), '2m 5s');
});

test('formatUptime formats hours, minutes and seconds', () => {
  assert.strictEqual(formatUptime(3723), '1h 2m 3s');
});

test('formatUptime clamps negative values to 0', () => {
  assert.strictEqual(formatUptime(-10), '0s');
});

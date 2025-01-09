import { it, assert, expect } from 'vitest';
import { uuid } from 'short-uuid';
import { decodeApiKey, encodeApiKey, generateSecret, hashSecret, verifySecret } from '@/presentation/api/security';

it("fails at decoding something which isn't an API key", async () => {
  expect(() => decodeApiKey('wrongApiKey')).toThrowError("Couldn't decode API key.");
});

it('encodes and decodes and API key', async () => {
  const clientId = uuid();
  const secret = generateSecret();
  const encodedApiKey = encodeApiKey(clientId, secret);
  const { secret: decodedSecret, clientId: decodedClientId } = decodeApiKey(encodedApiKey);
  assert.equal(decodedSecret, secret);
  assert.equal(decodedClientId, clientId);
});

it('fails at verifying a bad secret ', async () => {
  const secret = generateSecret();
  const { hashedSecret, salt, iterations } = await hashSecret(secret);
  const verified = await verifySecret('badSecret', hashedSecret, salt, iterations);
  assert.isFalse(verified);
});

it('verifies hashed secret', async () => {
  const secret = generateSecret();
  const { hashedSecret, salt, iterations } = await hashSecret(secret);
  const verified = await verifySecret(secret, hashedSecret, salt, iterations);
  assert.isTrue(verified);
});

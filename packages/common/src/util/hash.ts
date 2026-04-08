import { createHash, randomBytes } from 'crypto';

export function tokenGenerationUtil(size = 32, algorithm = 'sha256') {
  const token = randomBytes(size).toString('hex');

  const tokenHash = createHash(algorithm).update(token).digest('hex');

  return { token, tokenHash };
}

export function getHashedTokenFromGenerationFunction(
  token: string,
  algorithm = 'sha256',
) {
  return createHash(algorithm).update(token).digest('hex');
}

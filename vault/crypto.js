/**
 * Starlit Vault Cryptographic Core (Zero External Dependencies)
 * - RFC 7914 scrypt (N=32768, r=8, p=1 -> 32 MiB sequential memory-hard KDF)
 * - Web Crypto PBKDF2-HMAC-SHA256 (600,000 iterations)
 * - Web Crypto HKDF-SHA256 key combiner
 * - Web Crypto AES-256-GCM authenticated decryption with canonical AAD binding
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StarlitVaultCrypto = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function getSubtle() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
      return globalThis.crypto.subtle;
    }
    throw new Error('Web Crypto API (crypto.subtle) is unavailable.');
  }

  function b64ToBytes(b64) {
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(b64, 'base64'));
    }
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }

  function zeroBytes(buf) {
    if (buf && typeof buf.fill === 'function') {
      buf.fill(0);
    }
  }

  async function sha256(data) {
    const subtle = getSubtle();
    const digest = await subtle.digest('SHA-256', data);
    return new Uint8Array(digest);
  }

  /**
   * Pure SHA-256 HMAC + 1-iteration PBKDF2-HMAC-SHA256 (RFC 2898 / RFC 7914).
   * Handles empty passwords (which WebCrypto importKey("raw") rejects) and arbitrary salt sizes.
   */
  async function pbkdf2Sha256Iter1(pwBytes, saltBytes, dkLen) {
    const blockSize = 64;
    let keyBlock = new Uint8Array(blockSize);
    if (pwBytes.length > blockSize) {
      const hashed = await sha256(pwBytes);
      keyBlock.set(hashed);
    } else {
      keyBlock.set(pwBytes);
    }

    const ipad = new Uint8Array(blockSize);
    const opad = new Uint8Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
      ipad[i] = keyBlock[i] ^ 0x36;
      opad[i] = keyBlock[i] ^ 0x5c;
    }

    const blocks = Math.ceil(dkLen / 32);
    const out = new Uint8Array(dkLen);
    const innerBuf = new Uint8Array(blockSize + saltBytes.length + 4);
    innerBuf.set(ipad, 0);
    innerBuf.set(saltBytes, blockSize);
    const outerBuf = new Uint8Array(blockSize + 32);
    outerBuf.set(opad, 0);

    try {
      for (let i = 1; i <= blocks; i++) {
        const off = blockSize + saltBytes.length;
        innerBuf[off] = (i >>> 24) & 0xff;
        innerBuf[off + 1] = (i >>> 16) & 0xff;
        innerBuf[off + 2] = (i >>> 8) & 0xff;
        innerBuf[off + 3] = i & 0xff;

        const innerHash = await sha256(innerBuf);
        outerBuf.set(innerHash, blockSize);
        const u1 = await sha256(outerBuf);

        const destOff = (i - 1) * 32;
        const copyLen = Math.min(32, dkLen - destOff);
        out.set(u1.subarray(0, copyLen), destOff);
      }
      return out;
    } finally {
      zeroBytes(keyBlock);
      zeroBytes(ipad);
      zeroBytes(opad);
    }
  }

  function salsa20_8(B, tmp) {
    for (let i = 0; i < 16; i++) {
      tmp[i] = B[i];
    }
    for (let i = 0; i < 8; i += 2) {
      let u;
      u = (tmp[0] + tmp[12]) | 0; tmp[4] ^= (u << 7) | (u >>> 25);
      u = (tmp[4] + tmp[0]) | 0;  tmp[8] ^= (u << 9) | (u >>> 23);
      u = (tmp[8] + tmp[4]) | 0;  tmp[12] ^= (u << 13) | (u >>> 19);
      u = (tmp[12] + tmp[8]) | 0; tmp[0] ^= (u << 18) | (u >>> 14);

      u = (tmp[5] + tmp[1]) | 0;  tmp[9] ^= (u << 7) | (u >>> 25);
      u = (tmp[9] + tmp[5]) | 0;  tmp[13] ^= (u << 9) | (u >>> 23);
      u = (tmp[13] + tmp[9]) | 0; tmp[1] ^= (u << 13) | (u >>> 19);
      u = (tmp[1] + tmp[13]) | 0; tmp[5] ^= (u << 18) | (u >>> 14);

      u = (tmp[10] + tmp[6]) | 0;  tmp[14] ^= (u << 7) | (u >>> 25);
      u = (tmp[14] + tmp[10]) | 0; tmp[2] ^= (u << 9) | (u >>> 23);
      u = (tmp[2] + tmp[14]) | 0;  tmp[6] ^= (u << 13) | (u >>> 19);
      u = (tmp[6] + tmp[2]) | 0;   tmp[10] ^= (u << 18) | (u >>> 14);

      u = (tmp[15] + tmp[11]) | 0; tmp[3] ^= (u << 7) | (u >>> 25);
      u = (tmp[3] + tmp[15]) | 0;  tmp[7] ^= (u << 9) | (u >>> 23);
      u = (tmp[7] + tmp[3]) | 0;   tmp[11] ^= (u << 13) | (u >>> 19);
      u = (tmp[11] + tmp[7]) | 0;  tmp[15] ^= (u << 18) | (u >>> 14);

      u = (tmp[0] + tmp[3]) | 0; tmp[1] ^= (u << 7) | (u >>> 25);
      u = (tmp[1] + tmp[0]) | 0; tmp[2] ^= (u << 9) | (u >>> 23);
      u = (tmp[2] + tmp[1]) | 0; tmp[3] ^= (u << 13) | (u >>> 19);
      u = (tmp[3] + tmp[2]) | 0; tmp[0] ^= (u << 18) | (u >>> 14);

      u = (tmp[5] + tmp[4]) | 0; tmp[6] ^= (u << 7) | (u >>> 25);
      u = (tmp[6] + tmp[5]) | 0; tmp[7] ^= (u << 9) | (u >>> 23);
      u = (tmp[7] + tmp[6]) | 0; tmp[4] ^= (u << 13) | (u >>> 19);
      u = (tmp[4] + tmp[7]) | 0; tmp[5] ^= (u << 18) | (u >>> 14);

      u = (tmp[10] + tmp[9]) | 0;  tmp[11] ^= (u << 7) | (u >>> 25);
      u = (tmp[11] + tmp[10]) | 0; tmp[8] ^= (u << 9) | (u >>> 23);
      u = (tmp[8] + tmp[11]) | 0;  tmp[9] ^= (u << 13) | (u >>> 19);
      u = (tmp[9] + tmp[8]) | 0;   tmp[10] ^= (u << 18) | (u >>> 14);

      u = (tmp[15] + tmp[14]) | 0; tmp[12] ^= (u << 7) | (u >>> 25);
      u = (tmp[12] + tmp[15]) | 0; tmp[13] ^= (u << 9) | (u >>> 23);
      u = (tmp[13] + tmp[12]) | 0; tmp[14] ^= (u << 13) | (u >>> 19);
      u = (tmp[14] + tmp[13]) | 0; tmp[15] ^= (u << 18) | (u >>> 14);
    }
    for (let i = 0; i < 16; i++) {
      B[i] = (B[i] + tmp[i]) >>> 0;
    }
  }

  function scryptBlockMix(B, Y, r, xBlock, salsaTmp) {
    const lastOff = (2 * r - 1) * 16;
    for (let i = 0; i < 16; i++) {
      xBlock[i] = B[lastOff + i];
    }
    for (let i = 0; i < 2 * r; i++) {
      const bOff = i * 16;
      for (let j = 0; j < 16; j++) {
        xBlock[j] ^= B[bOff + j];
      }
      salsa20_8(xBlock, salsaTmp);
      const yOff = ((i & 1) === 0 ? (i >>> 1) : (r + (i >>> 1))) * 16;
      for (let j = 0; j < 16; j++) {
        Y[yOff + j] = xBlock[j];
      }
    }
    for (let i = 0; i < 32 * r; i++) {
      B[i] = Y[i];
    }
  }

  async function scrypt(pwBytes, saltBytes, N, r, p, dkLen, onProgress) {
    if (N <= 1 || (N & (N - 1)) !== 0) {
      throw new Error('scrypt N must be a power of 2 > 1');
    }
    const blockBytes = 128 * r;
    const blockWords = 32 * r;
    const B = await pbkdf2Sha256Iter1(pwBytes, saltBytes, p * blockBytes);

    const V = new Uint32Array(N * blockWords);
    const XY = new Uint32Array(blockWords);
    const Y = new Uint32Array(blockWords);
    const xBlock = new Uint32Array(16);
    const salsaTmp = new Uint32Array(16);
    const intifyOff = (2 * r - 1) * 16;
    const mask = N - 1;
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

    try {
      for (let blk = 0; blk < p; blk++) {
        const byteBase = blk * blockBytes;
        for (let i = 0; i < blockWords; i++) {
          const b = byteBase + i * 4;
          XY[i] = (B[b] | (B[b + 1] << 8) | (B[b + 2] << 16) | (B[b + 3] << 24)) >>> 0;
        }

        for (let i = 0; i < N; i++) {
          V.set(XY, i * blockWords);
          scryptBlockMix(XY, Y, r, xBlock, salsaTmp);
          if (isBrowser && (i & 4095) === 4095) {
            if (onProgress) onProgress(`deriving scrypt (${Math.round(((i + 1) / (2 * N)) * 100)}%)...`);
            await new Promise((res) => setTimeout(res, 0));
          }
        }

        for (let i = 0; i < N; i++) {
          const j = XY[intifyOff] & mask;
          const vOff = j * blockWords;
          for (let k = 0; k < blockWords; k++) {
            XY[k] ^= V[vOff + k];
          }
          scryptBlockMix(XY, Y, r, xBlock, salsaTmp);
          if (isBrowser && (i & 4095) === 4095) {
            if (onProgress) onProgress(`deriving scrypt (${Math.round(((N + i + 1) / (2 * N)) * 100)}%)...`);
            await new Promise((res) => setTimeout(res, 0));
          }
        }

        for (let i = 0; i < blockWords; i++) {
          const w = XY[i];
          const b = byteBase + i * 4;
          B[b] = w & 0xff;
          B[b + 1] = (w >>> 8) & 0xff;
          B[b + 2] = (w >>> 16) & 0xff;
          B[b + 3] = (w >>> 24) & 0xff;
        }
      }

      return await pbkdf2Sha256Iter1(pwBytes, B, dkLen);
    } finally {
      zeroBytes(B);
      zeroBytes(V);
      zeroBytes(XY);
      zeroBytes(Y);
      zeroBytes(xBlock);
      zeroBytes(salsaTmp);
    }
  }

  async function decryptVault(envelope, passphrase, onProgress) {
    if (!envelope || envelope.v !== 1 || !envelope.kdf || !envelope.kdf.scrypt || !envelope.kdf.pbkdf2 || !envelope.kdf.hkdf) {
      throw new Error('Invalid vault envelope format.');
    }
    if (typeof passphrase !== 'string' || passphrase.length < 1) {
      throw new Error('Passphrase required.');
    }

    const sc = envelope.kdf.scrypt;
    const pb = envelope.kdf.pbkdf2;
    const hk = envelope.kdf.hkdf;

    // Enforce minimum security floor against KDF downgrade attacks
    if (sc.N < 32768 || sc.r < 8 || sc.p < 1 || pb.iterations < 600000) {
      throw new Error('Vault KDF parameters below security policy floor.');
    }

    const expectedAad = `v=1|scrypt=${sc.N},${sc.r},${sc.p}|pbkdf2=${pb.iterations}|s1=${sc.salt}|s2=${pb.salt}|s3=${hk.salt}`;
    if (envelope.aad !== expectedAad) {
      throw new Error('Vault AAD header integrity mismatch.');
    }

    const enc = new TextEncoder();
    const pwBytes = enc.encode(passphrase);
    const s1 = b64ToBytes(sc.salt);
    const s2 = b64ToBytes(pb.salt);
    const s3 = b64ToBytes(hk.salt);
    const iv = b64ToBytes(envelope.iv);
    const ct = b64ToBytes(envelope.ct);
    const aadBytes = enc.encode(expectedAad);
    const subtle = getSubtle();

    let kScrypt = null;
    let kPbkdf2 = null;
    let ikm = null;
    let plainBuf = null;

    try {
      if (onProgress) onProgress('deriving scrypt (32 MiB)...');
      kScrypt = await scrypt(pwBytes, s1, sc.N, sc.r, sc.p, 32, onProgress);

      if (onProgress) onProgress('deriving pbkdf2-sha256 (600k)...');
      const baseKey = await subtle.importKey('raw', pwBytes, 'PBKDF2', false, ['deriveBits']);
      const pbBits = await subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt: s2, iterations: pb.iterations },
        baseKey,
        256
      );
      kPbkdf2 = new Uint8Array(pbBits);

      ikm = new Uint8Array(64);
      ikm.set(kScrypt, 0);
      ikm.set(kPbkdf2, 32);

      if (onProgress) onProgress('combining keys (hkdf-sha256)...');
      const hkdfBase = await subtle.importKey('raw', ikm, 'HKDF', false, ['deriveKey']);
      const aesKey = await subtle.deriveKey(
        {
          name: 'HKDF',
          hash: 'SHA-256',
          salt: s3,
          info: enc.encode('bigbois-vault-v1:aes-256-gcm')
        },
        hkdfBase,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      if (onProgress) onProgress('authenticating aes-256-gcm...');
      const decrypted = await subtle.decrypt(
        { name: 'AES-GCM', iv: iv, additionalData: aadBytes, tagLength: 128 },
        aesKey,
        ct
      );

      plainBuf = new Uint8Array(decrypted);
      if (plainBuf.length < 4) {
        throw new Error('Malformed padded payload.');
      }
      const jsonLen = ((plainBuf[0] << 24) | (plainBuf[1] << 16) | (plainBuf[2] << 8) | plainBuf[3]) >>> 0;
      if (jsonLen === 0 || 4 + jsonLen > plainBuf.length) {
        throw new Error('Invalid payload length prefix.');
      }
      const jsonBytes = plainBuf.subarray(4, 4 + jsonLen);
      const dec = new TextDecoder('utf-8', { fatal: true });
      return JSON.parse(dec.decode(jsonBytes));
    } finally {
      zeroBytes(pwBytes);
      zeroBytes(kScrypt);
      zeroBytes(kPbkdf2);
      zeroBytes(ikm);
      zeroBytes(plainBuf);
    }
  }

  return {
    scrypt,
    decryptVault,
    b64ToBytes
  };
});

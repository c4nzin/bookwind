import { FollowerRoutes } from './user.repository';
/* prettier-ignore */

/**
 * Wraps the URL based on certain conditions.
 * @param url The URL to be wrapped.
 * @returns Wrapped URL based on conditions.
 */
export function extractPathFromUrl(url: string): string {
  const followersIndex = url.indexOf(FollowerRoutes.FOLLOWERS);
  return url.includes(FollowerRoutes.FOLLOWERS) ? url.slice(followersIndex) : FollowerRoutes.FOLLOWINGS;
}

// export function urlWrapper(url: string): string {
//   if (url.includes(PATHS.FOLLOWERS)) {
//     const followersIndex = url.indexOf(PATHS.FOLLOWERS);
//     return url.slice(followersIndex);
//   } else {
//     return PATHS.FOLLOWINGS;
//   }
// }

// function hashString(input: string): string {
//   let hash = 0;

//   if (input.length === 0) return hash.toString();

//   for (let i = 0; i < input.length; i++) {
//     const char = input.charCodeAt(i);
//     hash = (hash << 5) - hash + char;
//     hash |= 0; // 32-bit tamsayı olmasını sağlar
//   }

//   return hash.toString();
// }

// function rotateRight(n: number, x: number): number {
//   return (x >>> n) | (x << (32 - n));
// }

// function ch(x: number, y: number, z: number): number {
//   return (x & y) ^ (~x & z);
// }

// function maj(x: number, y: number, z: number): number {
//   return (x & y) ^ (x & z) ^ (y & z);
// }

// function sigma0(x: number): number {
//   return rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x);
// }

// function sigma1(x: number): number {
//   return rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x);
// }

// function gamma0(x: number): number {
//   return rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3);
// }

// function gamma1(x: number): number {
//   return rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10);
// }

// async function sha256(input: string): Promise<string> {
//   const k: number[] = [
//     0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
//     0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
//     0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
//     0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
//     0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
//     0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
//     0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
//     0xc67178f2,
//   ];

//   const initialHashValues: number[] = [
//     0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
//   ];

//   const initialHashBytes = new Uint8Array(
//     initialHashValues
//       .map((value) => (value & 0xff000000) >> 24)
//       .concat(initialHashValues.map((value) => (value & 0x00ff0000) >> 16))
//       .concat(initialHashValues.map((value) => (value & 0x0000ff00) >> 8))
//       .concat(initialHashValues.map((value) => value & 0x000000ff)),
//   );

//   const encoder = new TextEncoder();
//   const data = encoder.encode(input);

//   let hash = initialHashBytes.slice();
//   const length = data.length * 8;
//   data[length >>> 5] |= 0x80 << (24 - (length % 32));
//   data[(((length + 64) >>> 9) << 4) + 15] = length;

//   for (let i = 0; i < data.length; i += 64) {
//     const words = new Array(64).fill(0);
//     for (let j = 0; j < 64; j++) {
//       words[j] =
//         j < 16
//           ? (data[i + j] << 24) | (data[i + j + 1] << 16) | (data[i + j + 2] << 8) | data[i + j + 3]
//           : gamma1(words[j - 2]) + words[j - 7] + gamma0(words[j - 15]) + words[j - 16];
//       let temp1 = hash[7] + sigma1(hash[4]) + ch(hash[4], hash[5], hash[6]) + k[j] + words[j];
//       let temp2 = sigma0(hash[0]) + maj(hash[0], hash[1], hash[2]);
//       hash = [temp1 + temp2, hash[0], hash[1], hash[2] + temp1, hash[3], hash[4], hash[5], hash[6]];
//     }
//   }

//   const hashBytes = new Uint8Array(
//     hash.flatMap((value) => [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]),
//   );
//   return Array.from(hashBytes)
//     .map((byte) => ('0' + byte.toString(16)).slice(-2))
//     .join('');
// }

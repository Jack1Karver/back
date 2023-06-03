import { AbiContract, builderOpBitString, builderOpInteger } from '@eversdk/core';

const pubkeyRegex = /^[0-9a-fA-F]{64}$/;
const addressRegex = /^-?[0-9a-fA-F]+:[0-9a-fA-F]{64}$/;
const onlyZero = /^0+$/;

// :: String -> String
const strip0x = (str: string) => str.replace(/^0x/, '');
const add0x = (str: string) => (str === '' ? '' : `0x${strip0x(str)}`);
const stripWorkchain = (str: string) => str.replace(/^[^:]*:/, '');

const convert = (from: any, to: any) => (data: string) => Buffer.from(data, from).toString(to);
const hexToUtf8 = (hex: string) => convert('hex', 'utf8')(strip0x(hex));
const utf8ToHex = convert('utf8', 'hex');
const base64Encode = convert('utf8', 'base64');
const base64Decode = (str: string) => Buffer.from(str, 'base64').toString('utf8');

// :: * -> Bool
const isValidPublicKey = (x: any) =>
  typeof x === 'string' && pubkeyRegex.test(strip0x(x)) && !onlyZero.test(strip0x(x));
const isValidAddress = (x: any) => typeof x === 'string' && addressRegex.test(x) && !onlyZero.test(stripWorkchain(x));

// :: String|Number, String|Number -> Bool
const isNear = (x: string | number, y: string | number) =>
  Math.abs(parseInt(y.toString()) - parseInt(x.toString())) < 200000000; // 2e8

const toNano = (n: number) => n * 1000000000; // 1e9
const fromNano = (n: number) => {return n / 1000000000};

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const hexEncode = (string: string): string => {
  let hex, i;

  let result = '';
  for (i = 0; i < string.length; i++) {
    hex = string.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
};

const hexDecode = (string: string): string => {
  const hexes = string.match(/.{1,4}/g) || [];
  let back = '';
  for (let j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
};

const hexToDec = (hexString: string) => parseInt(hexString, 16);

const u = (size: number, x: string | number | bigint | boolean) => {
  if (size === 256) {
    return builderOpBitString(`x${BigInt(x).toString(16).padStart(64, '0')}`);
  } else {
    return builderOpInteger(size, x);
  }
};

export const u8 = (x: string | number | bigint | boolean) => u(8, x);
export const u32 = (x: string | number | bigint | boolean) => u(32, x);
export const u128 = (x: string | number | bigint | boolean) => u(128, x);
export const u256 = (x: string | number | bigint | boolean) => u(256, x);

export {
  add0x,
  fromNano,
  toNano,
  isNear,
  isValidAddress,
  isValidPublicKey,
  sleep,
  strip0x,
  hexEncode,
  hexDecode,
  base64Encode,
  base64Decode,
  utf8ToHex,
  hexToUtf8,
  hexToDec,
};

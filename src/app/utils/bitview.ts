/* tslint:disable:no-bitwise */

/**
 * Manipulate bits in ArrayBuffers.
  * Works like a DataView but indexes in bits.
  *
  * based on https://github.com/kig/bitview.js
 */
export class BitView {
  private u8: Uint8Array;

  constructor(buf: string | Iterable<number>) {
    if (typeof buf === 'string') {
      buf = atob(buf).split('').map(c => c.charCodeAt(0));
    }
    this.u8 = new Uint8Array(buf);
  }

  getBit (idx: number): number {
    const v = this.u8[idx >> 3];
    const off = idx & 0x7;
    return (v >> (7 - off)) & 1;
  }

  setBit (idx: number, val: number) {
    const off = idx & 0x7;
    if (val) {
      this.u8[idx >> 3] |= (0x80 >> off);
    } else {
      this.u8[idx >> 3] &= ~(0x80 >> off);
    }
  }

  toBase64 (): string {
    return btoa(String.fromCharCode.apply(null, this.u8));
  }

  fromBase64 (b64: string): void {
    this.u8 = new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));
  }
}

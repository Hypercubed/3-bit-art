import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef, HostBinding, EventEmitter } from '@angular/core';
import { BitView } from '../utils/bitview';
import { rtrim } from '../utils/util';

const touchMode = !!(navigator.userAgent.toLowerCase().match(/(android|iphone|ipod|ipad|blackberry)/));

@Component({
  selector: 'app-three-bit-canvas',
  templateUrl: './three-bit-canvas.component.html',
  styleUrls: ['./three-bit-canvas.component.scss']
})
export class ThreeBitCanvasComponent implements OnInit, AfterViewInit {

  @Input()
  size = [16, 16];

  @Input()
  scale = 10;

  @Input()
  color: any;

  @Input()
  drawingEnabled = true;

  @Input()
  get data(): string {
    return rtrim('/', this._data);
  }
  set data(b64: string) {
    this._data = (b64 + '/'.repeat(128)).slice(0, 128);
    this.bitData.fromBase64(this._data);
    this.refreshImageData();
    this.draw();
    this.dataChange.emit(rtrim('/', this._data));
  }

  @Output()
  dataChange = new EventEmitter();

  @ViewChild('canvas') canvasRef: ElementRef;

  @HostBinding('style.width')
  get width() {
    return this.size[0] * this.scale;
  }

  @HostBinding('style.height')
  get height() {
    return this.size[0] * this.scale;
  }

  _data: string = '/'.repeat(128);
  bitData = new BitView(this._data);
  imageData: ImageData;
  context: CanvasRenderingContext2D;
  gridSize = 1;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.getContext('2d');

    this.context.rect(0, 0, this.size[0], this.size[1]);
    this.context.fillStyle = 'white';
    this.context.fill();
    this.imageData = this.context.getImageData(0, 0, this.size[0], this.size[1]);

    this.refreshImageData();
    this.draw();

    if (this.drawingEnabled) {
      this.canvas.addEventListener(touchMode ? 'touchstart' : 'mousedown', this.onMoveEvent.bind(this), false);
      this.canvas.addEventListener(touchMode ? 'touchmove' : 'mousemove', this.onMoveEvent.bind(this), false);
    }
  }

  refreshImageData(): void {
    if (!this.imageData) {
      return;
    }

    for (let i = 0; i < 256; i++) {
      const index = i * 4;
      const i2 = i * 3;

      this.imageData.data[index + 0] = this.bitData.getBit(i2) * 255;
      this.imageData.data[index + 1] = this.bitData.getBit(i2 + 1) * 255;
      this.imageData.data[index + 2] = this.bitData.getBit(i2 + 2) * 255;
      this.imageData.data[index + 3] = 255;
    }
  }

  draw(): void {
    setTimeout(() => this.context.putImageData(this.imageData, 0, 0), 10);
  }

  detectLeftButton(evt) {
    evt = evt || window.event;
    if ('buttons' in evt) {
      return evt.buttons === 1;
    }
    const button = evt.which || evt.button;
    return button === 1;
  }

  onMoveEvent(e: any): void {
    e.preventDefault();
    if (!this.detectLeftButton(e)) { return; }
    const pos = touchMode ? this.getTouchPos(e) : this.getMousePos(e);
    return this.drawPixel(pos.x, pos.y);
  }

  getMousePos(e: any): any {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x : e.clientX - rect.left,
      y : e.clientY - rect.top
    }
  }

  getTouchPos(e: any): any {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.targetTouches[0];
    return {
      x : touch.pageX - rect.left,
      y : touch.pageY - rect.top
    };
  }

  drawPixel (x: number, y: number): void {
    x = Math.floor(x / this.scale / this.gridSize) * this.gridSize;
    y = Math.floor(y / this.scale / this.gridSize) * this.gridSize;

    if (x < this.size[0] && y < this.size[1]) {
      const {r, g, b} = this.color.rgb;
      return this.setPixel(x, y, r, g, b, 255);
    }
  }

  setPixel (x: number, y: number, r: number, g: number, b: number, a: number): void {
    const i = (x + y * this.imageData.width);

    const index = i * 4;
    this.imageData.data[index + 0] = r;
    this.imageData.data[index + 1] = g;
    this.imageData.data[index + 2] = b;
    this.imageData.data[index + 3] = a;

    const i2 = i * 3
    /* tslint:disable:no-bitwise */
    this.bitData.setBit(i2, ~~(r / 255));
    this.bitData.setBit(i2 + 1, ~~(g / 255));
    this.bitData.setBit(i2 + 2, ~~(b / 255));
    /* tslint:enable:no-bitwise */

    this.data = this.bitData.toBase64();
    return this.draw();
  }

  toDataURL() {
    return this.canvas.toDataURL('image/png');
  }

  toPxonData(): any[] {
    if (!this.imageData) {
      return;
    }

    const pxonData = [];

    for (let i = 0; i < 256; i++) {
      const y = Math.floor(i / 16) * this.scale;
      const x = i % 16 * this.scale;

      const i2 = i * 3;


      const r = this.bitData.getBit(i2) * 255;
      const g = this.bitData.getBit(i2 + 1) * 255;
      const b = this.bitData.getBit(i2 + 2) * 255;

      pxonData.push({
        x,
        y,
        color: `rgba(${r},${g},${b},1)`,
        size: this.scale
      });
    }

    return pxonData;
  }
}

import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { trigger, sequence, transition, animate, style, state } from '@angular/core';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MdSnackBar } from '@angular/material';

import { BitView } from './utils/bitview';

let i = 0;
function nextId() {
  return i++;
}

@Component({
  selector: 'app-root',
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('anim', [
      transition('* => void', [
        style({ width: '*', opacity: '1', transform: 'translateY(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'}),
        sequence([
          animate('.25s ease', style({ width: '*', opacity: '.2', transform: 'translateY(20px)', 'box-shadow': 'none'  })),
          animate('.1s ease', style({ width: '0', opacity: 0, transform: 'translateY(20px)', 'box-shadow': 'none'  }))
        ])
      ]),
      transition('void => active', [
        style({ width: '0', opacity: '0', transform: 'translateY(20px)', 'box-shadow': 'none' }),
        sequence([
          animate('.1s ease', style({ width: '*', opacity: '.2', transform: 'translateY(20px)', 'box-shadow': 'none'  })),
          animate('.35s ease', style({
            width: '*',
            opacity: 1,
            transform: 'translateY(0)',
            'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'
          }))
        ])
      ])
    ])
  ]
})
export class AppComponent {
  gallary: any[] = [];

  data: string = '/'.repeat(128);
  canvasSize = [16, 16];

  colors = [
    { name: 'Black', value: '#000000', rgb: {r: 0, g: 0, b: 0 } },
    { name: 'Blue', value: '#0000ff', rgb: {r: 0, g: 0, b: 255 } },
    { name: 'Green', value: '#00ff00', rgb: {r: 0, g: 255, b: 0 } },
    { name: 'Cyan', value: '#00ffff', rgb: {r: 0, g: 255, b: 255 } },
    { name: 'Red', value: '#ff0000', rgb: {r: 255, g: 0, b: 0 } },
    { name: 'Magenta', value: '#ff00ff', rgb: {r: 255, g: 0, b: 255 } },
    { name: 'Yellow', value: '#ffff00', rgb: {r: 255, g: 255, b: 0 } },
    { name: 'White', value: '#ffffff', rgb: {r: 255, g: 255, b: 255 } }
  ];
  color: any = this.colors[0];

  constructor(public location: Location, public snackBar: MdSnackBar) {
    const path = this.location.path(true);
    this.data = (path.length !== 0) ? path : localStorage.getItem('data') || this.data;

    const gallary = localStorage.getItem('gallary');
    if (gallary) {
      this.gallary = JSON.parse(gallary).map(data => {
        return {
          data,
          id: nextId()
        }
      });
    }
  }

  onSave(): any {
    this.gallary.push({ id: nextId(), data: this.data });
    this.saveGallery();
    return this.snackBar.open('768 bits saved to your gallary', undefined, {
      duration: 1000
    });
  }

  saveGallery() {
    const gallary = this.gallary.map(g => g.data);
    localStorage.setItem('gallary', JSON.stringify(this.gallary));
  }

  onDataChange(data: string): void {
    this.data = data;
    localStorage.setItem('data', data);
    this.location.replaceState(data);
  }

  onDeleteGallaryItem(id: number): any {
    this.gallary = this.gallary.filter(g => g.id !== id);
    this.saveGallery();
    return this.snackBar.open('768 bits removed from your gallary', undefined, {
      duration: 1000
    });
  }

  trackByFn(index, item) {
    return item.id;
  }
}

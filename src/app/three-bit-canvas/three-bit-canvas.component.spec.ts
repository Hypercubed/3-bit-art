import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeBitCanvasComponent } from './three-bit-canvas.component';

describe('ThreeBitCanvasComponent', () => {
  let component: ThreeBitCanvasComponent;
  let fixture: ComponentFixture<ThreeBitCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeBitCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeBitCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

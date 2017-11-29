import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SwiperComponent} from './swiper.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('SwiperComponent', () => {
  let component: SwiperComponent;
  let fixture: ComponentFixture<SwiperComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
                                       imports: [ NoopAnimationsModule ],
                                       declarations: [ SwiperComponent ]
                                     }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

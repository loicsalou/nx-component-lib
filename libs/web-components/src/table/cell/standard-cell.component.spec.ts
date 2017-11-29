import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Column, StandardCellComponent} from '../index';
import {Link} from '../test-table.component';

@Component({
             template: `
               <div>
                 <zas-standard-cell *ngFor="let col of cols" [row]="row" [col]="col"></zas-standard-cell>
               </div>
             `
           })
export class TestStandardCellComponent {
  cols: Column[] = [
    {field: 'stringCol', label: 'label of stringCol'},
    {field: 'stringCol2', label: 'label of stringCol2'},
    {field: 'numberCol', label: 'label of numberCol'},
    {field: 'booleanCol', label: 'label of booleanCol'},
    {field: 'booleanCol2', label: 'label of booleanCol2'},
    {field: 'linkCol', label: 'label of linkCol'},
    {field: 'otherCol', label: 'label of otherCol'}
  ];
  // rivate link: Link = {url: 'http://www.zas.admin.ch', label: 'Site de la ZAS'};
  private link: Link = new Link('http://www.zas.admin.ch', 'Site de la ZAS');
  row = {
    stringCol: 'string',
    stringCol2: 'string2',
    numberCol: 123,
    booleanCol: true,
    booleanCol2: false,
    linkCol: this.link,
    otherCol: {att1: 'att1', att2: 123}
  };

  constructor() {
  }
}

describe('StandardCellComponent', () => {
  let component: TestStandardCellComponent;
  let fixture: ComponentFixture<TestStandardCellComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
                                       declarations: [ StandardCellComponent, TestStandardCellComponent ]
                                     }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStandardCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should wrap 2 string cells', () => {
    const debugEl = fixture.debugElement;
    const tags = debugEl.queryAll(By.css('.stringCell'));
    expect(tags.length).toBe(2);
    expect(tags[ 0 ].nativeElement.textContent).toBe('string');
    expect(tags[ 1 ].nativeElement.textContent).toBe('string2');
  });

  it('should wrap 1 number cell', () => {
    const debugEl = fixture.debugElement;
    const tags = debugEl.queryAll(By.css('.numberCell'));
    expect(tags.length).toBe(1);
    expect(+tags[ 0 ].nativeElement.textContent).toBe(123);
  });

  it('should wrap 2 boolean cells', () => {
    const debugEl = fixture.debugElement;
    let tags = debugEl.queryAll(By.css('.booleanCell'));
    expect(tags.length).toBe(2);
    tags = debugEl.queryAll(By.css('input[type]'));
    expect(tags.length).toBe(2);
    expect(tags[ 0 ].nativeElement.checked).toBe(true);
    expect(tags[ 1 ].nativeElement.checked).toBe(false);
  });

  it('should wrap 1 link cell with URL and label of site', () => {
    const debugEl = fixture.debugElement;
    let tags = debugEl.queryAll(By.css('.linkCell'));
    expect(tags.length).toBe(1);
    tags = debugEl.queryAll(By.css('a[href]'));
    expect(tags.length).toBe(1);
    expect(tags[ 0 ].properties[ 'href' ]).toBe('http://www.zas.admin.ch');
    expect(tags[ 0 ].nativeElement.innerText).toBe('Site de la ZAS');
  });

  it('should wrap 1 other cell', () => {
    const debugEl = fixture.debugElement;
    const tags = debugEl.queryAll(By.css('.otherCell'));
    expect(tags.length).toBe(1);
  });
});

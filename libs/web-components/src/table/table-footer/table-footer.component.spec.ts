import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {TestModule} from '../test.module.spec';
import {Navs} from '../../navs';
import {TableFooterComponent} from './table-footer.component';
import {LocalPreferencesManagerService, MockPreferencesManagerService} from '../../shared';

describe('TableFooterComponent', () => {
  let component: TableFooterComponent<Navs>;
  let fixture: ComponentFixture<TableFooterComponent<Navs>>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
                                       imports: [ TestModule ],
                                       providers: [
                                         {
                                           provide: LocalPreferencesManagerService,
                                           useClass: MockPreferencesManagerService
                                         }
                                       ]
                                     }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should wrap a single span with trash icon', () => {
    const debugEl = fixture.debugElement;
    const content = debugEl.queryAll(By.css('span.fa-trash-o'));
    expect(content.length).toBe(1);
  });
});

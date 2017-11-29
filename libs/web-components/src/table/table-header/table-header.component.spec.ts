import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {TestTableComponent} from '../test-table.component';
import {TestModule} from '../test.module.spec';
import {LocalPreferencesManagerService, MockPreferencesManagerService} from '../../shared';

describe('TestTableComponent and TableHeaderComponent', () => {
  let component: TestTableComponent;
  let fixture: ComponentFixture<TestTableComponent>;

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
    fixture = TestBed.createComponent(TestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create TestTableComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should wrap TableHeaderComponent', () => {
    // iven the table
    const debugEl = fixture.debugElement;
    // etch zas-table-header
    const zasHeader = debugEl.query(By.css('.ui-datatable-header div.zas-table-header'));
    // heck found
    expect(zasHeader).toBeTruthy();
  });

  it('TableHeaderComponent should wrap search input', () => {
    // iven the table
    const tableEl = fixture.debugElement;
    // etch zas-table-header
    const zasHeader = tableEl.query(By.css('.ui-datatable-header div.zas-table-header'));
    if (zasHeader) {
      // etch filter part
      const filterPart = zasHeader.query(By.css('div.table-filter'));
      expect(filterPart).toBeTruthy();
      const searchField = filterPart.query(By.css('.fa-search'));
      expect(searchField).toBeTruthy();
    }
  });

  it('TableHeaderComponent should wrap search input', () => {
    // iven the table
    const tableEl = fixture.debugElement;
    // etch zas-table-header
    const zasHeader = tableEl.query(By.css('.ui-datatable-header div.zas-table-header'));
    if (zasHeader) {
      // etch export part
      const exportPart = zasHeader.query(By.css('div.table-export'));
      expect(exportPart).toBeTruthy();
    }
  });

  it('TableHeaderComponent should wrap column chooser', () => {
    // iven the table
    const tableEl = fixture.debugElement;
    // etch zas-table-header
    const zasHeader = tableEl.query(By.css('.ui-datatable-header div.zas-table-header'));
    if (zasHeader) {
      // etch col-chooser part
      const colChooserPart = zasHeader.query(By.css('div.table-col-chooser'));
      expect(colChooserPart).toBeTruthy();
      // etch col-chooser part and check columns are all there
      const colItems = zasHeader.queryAll(By.css('li.ui-multiselect-item'));
      expect(colItems.length).toBeTruthy(7);
    }
  });
});

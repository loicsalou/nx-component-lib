/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {Message} from '../shared';
import {NavsInputDirective} from './navs-input.directive';
import {NavsService} from './navs.service';
import {newEvent} from '../test-utils';

@Component({
             template: `
               <div>
                 <input class='inputNavsko' [zasNavs]='7560000000000' (onMessage)='onMessage1($event)'>
                 <input class='inputNavsok' [zasNavs]='7560000000019' (onMessage)='onMessage2($event)'>
                 <input class='inputNavsTooShort' [zasNavs]='756000000' (onMessage)='onMessage3($event)'>
                 <input class='inputNavsRegex' [zasNavs]='9991234567890' (onMessage)='onMessage4($event)'>
                 <input class='inputNavsEan' [zasNavs]='7560000000001' (onMessage)='onMessage5($event)'>
               </div>
             `
           })
class TestComponent {
  message1: string;
  message2: string;
  message3: string;

  // ever called due to spy
  onMessage1(message: Message) {
    message.toString();
  }

  // ever called due to spy
  onMessage2(message: Message) {
    message.toString();
  }

  // input>
  onMessage3(message: Message) {
    this.message1 = message.key;
  }

  // input>
  onMessage4(message: Message) {
    this.message2 = message.key;
  }

  // input>
  onMessage5(message: Message) {
    this.message3 = message.key;
  }
}

function triggerEnterForEach(fixture) {
  const elements: DebugElement[] = fixture.debugElement.queryAll(By.directive(NavsInputDirective));
  elements.forEach(elem => elem.triggerEventHandler('onMessage', elem.attributes[ 'class' ]));
}

/*tslint:disable no-console*/
describe('Directive: NavsInputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
                                               imports: [ FormsModule ],
                                               declarations: [ TestComponent, NavsInputDirective ],
                                               providers: [ NavsService ],
                                               schemas: [ NO_ERRORS_SCHEMA ]
                                             }).createComponent(TestComponent);
    component = fixture.componentInstance;
    spyOn(component, 'onMessage1');
    spyOn(component, 'onMessage2').and.callThrough();
    spyOn(component, 'onMessage3').and.callThrough();
    spyOn(component, 'onMessage4').and.callThrough();
    spyOn(component, 'onMessage5').and.callThrough();
    fixture.detectChanges();
    triggerEnterForEach(fixture);
  });

  // creation
  it('should create test component and 10 directives should call test component once', () => {
    component = fixture.componentInstance;
    // e composant de test doit être créé
    expect(component).toBeTruthy();
    // il renferme 2 input directives et 4 non inputs. Chacune émet un message.
    expect(callsTo(component.onMessage1)).toEqual(1);
    expect(callsTo(component.onMessage2)).toEqual(1);
    expect(callsTo(component.onMessage3)).toEqual(1);
    expect(callsTo(component.onMessage4)).toEqual(1);
    expect(callsTo(component.onMessage5)).toEqual(1);
  });

  // INCORRECT INPUT: testing error cases
  it('should contain wrong navs 7560000000000', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('input.inputNavsko')).nativeElement;
    // a directive est censée mettre à jour la value de l'input.
    const val = tag.value;
    expect(val).toContain('7560000000000');
  });

  it('should be set ng-invalid class', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('input.inputNavsko')).nativeElement;
    // a directive est censée mettre à jour la value de l'input et le déclarer invalide.
    expect(tag.classList).toContain('ng-invalid');
  });

  it('should be called onMessage once and be invalid on focusOut', () => {
    // près un ENTER la directive est censée émettre un message d'erreur
    const lastCall = mostRecentCallTo(component.onMessage1);
    const lastMessage: Message = lastCall.args[ 0 ];
    expect(callsTo(component.onMessage1)).toEqual(1);
    // le spy sur onMessage1 ne fait pas call through ! donc ne pas vérifier le last message
    // expect(lastMessage.level).toEqual(1);

    // ocusIn: déformatage mais rien ne change
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('input.inputNavsko')).nativeElement;
    tag.dispatchEvent(newEvent('focusin', true, false));
    fixture.detectChanges();

    // ocusOut: formatage + ng-invalid
    tag.dispatchEvent(newEvent('focusout', true, false));
    fixture.detectChanges();

    // a directive n'émet pas de message d'erreur mais le champ est invalide
    expect(tag.classList).toContain('ng-invalid');
    // a directive est censée mettre à jour la value de l'input.
    const val = tag.value;
    expect(val).toContain('7560000000000');
  });

  // CORRECT INPUT: testing correct cases
  it('should contain correct formatted navs 756.0000.0000.19', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('input.inputNavsok')).nativeElement;
    // a directive est censée mettre à jour la value de l'input.
    const val = tag.value;
    expect(val).toContain('756.0000.0000.19');
  });

  it('should contain correct editable navs 7560000000019', () => {
    const debugEl = fixture.debugElement;
    const tag = debugEl.query(By.css('input.inputNavsok')).nativeElement;
    // a directive est censée déformater la value de l'input.
    tag.dispatchEvent(newEvent('focusin', true, false));
    fixture.detectChanges();
    expect(tag.value).toContain('7560000000019');
  });
});

// returns the count of calls to a given component
export function callsTo(component) {
  return component.calls.count();
}

// returns the most recent call to a given component
export function mostRecentCallTo(component) {
  return component.calls.mostRecent();
}

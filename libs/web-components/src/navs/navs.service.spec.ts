/**
 * Created by U80830793 on 06.06.2016.
 */
import {NavsService, NavsValidityStatus} from './navs.service';

describe('NavsService', () => {
  beforeEach(() => {
    this.NavsService = new NavsService();
  });

  // ********************** isValid tests
  const validNavs = [
    '756.2208.0295.57',
    '756\'2208\'0295\'57',
    '756 2208 0295 57',
    '7562208029557',
    '87696351110',
    '876.96.351.110',
    '876 96 351 110',
    '876\'96\'351\'110'
  ];

  const invalidNavs = [
    '7560000000000',
    '75600000000000000000',
    '75600000',
    '756aaaabbbbcc',
    '10000000000',
    '100.00.000.000'
  ];

  it('should be valid ' + validNavs, () => {
    let result;

    for (const navs of validNavs) {
      result = this.NavsService.getNavsValidityStatus(navs);
      expect(result).toBe(NavsValidityStatus.Valid);
    }
  });

  it('should not be valid' + invalidNavs, () => {
    let result;

    for (const navs of invalidNavs) {
      result = this.NavsService.getNavsValidityStatus(navs);
      expect(result).not.toBe(NavsValidityStatus.Valid);
    }
  });

  // ********************** isValid error tests - AVS13
  it('should say 7560000000000 validity is InvalidEan', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '7560000000000';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.InvalidEan);
  });

  it('should say navs 75600000000000000000 has WrongSize', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '75600000000000000000';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.WrongSize);
  });

  it('should say navs 75600000 has WrongSize', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '75600000';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.WrongSize);
  });

  it('should say 756aaaabbbbcc validity is RegexFailed', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '756aaaabbbbcc';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.RegexFailed);
  });

  // ********************** isValid error tests - AVS11
  it('should say 10000000000 validity is InvalidEan', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '10000000000';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.InvalidEan);
  });

  it('should say 87696351111 validity is InvalidEan', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '87696351111';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.InvalidEan);
  });

  it('should say navs 100000000000 has WrongSize', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '100000000000';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.WrongSize);
  });

  it('should say 1000000000c validity is RegexFailed', () => {
    let mock: string, result: NavsValidityStatus;

    mock = '1000000000c';
    result = this.NavsService.getNavsValidityStatus(mock);
    expect(result).toBe(NavsValidityStatus.RegexFailed);
  });

  // ********************** formatNavs tests - AVS13
  it('should format to 756.2208.0295.57', () => {
    let result;

    result = this.NavsService.formatNavs('7562208029557');
    expect(result).toEqual('756.2208.0295.57');
  });

  it('should format 756\'2208\'0295\'57 to 756.2208.0295.57', () => {
    let result;

    result = this.NavsService.formatNavs('756\'2208\'0295\'57');
    expect(result).toEqual('756.2208.0295.57');
  });

  it('should not format to 756.0000.0000.00 because it\'s incorrect', () => {
    let result;

    result = this.NavsService.formatNavs('7560000000000');
    expect(result).toEqual('7560000000000');
  });

  it('should not format 756\'0000\'0000\'00 to 756.0000.0000.00 because it\'s incorrect', () => {
    let result;

    result = this.NavsService.formatNavs('756\'0000\'0000\'00');
    expect(result).toEqual('756\'0000\'0000\'00');
  });

  // ********************** formatNavs tests - AVS11
  it('should format to 876.96.351.110', () => {
    let result;

    result = this.NavsService.formatNavs('87696351110');
    expect(result).toEqual('876.96.351.110');
  });

  it('should format 876\'96\'351\'110 to 876.96.351.110', () => {
    let result;

    result = this.NavsService.formatNavs('876\'96\'351\'110');
    expect(result).toEqual('876.96.351.110');
  });

  it('should format 876 96 351 110 to 876.96.351.110', () => {
    let result;

    result = this.NavsService.formatNavs('876 96 351 110');
    expect(result).toEqual('876.96.351.110');
  });

  it('should not format to 876.00.000.00 because it\'s incorrect', () => {
    let result;

    result = this.NavsService.formatNavs('8760000000');
    expect(result).toEqual('8760000000');
  });

  it('should not format 876\'00\'000\'000 to 876.00.000.00 because it\'s incorrect', () => {
    let result;

    result = this.NavsService.formatNavs('876 00 000 00');
    expect(result).toEqual('876 00 000 00');
  });

  // ********************** isNavsFormatted tests
  const formattedNavs = [
    '756.2208.0295.57',
    '756\'2208\'0295\'57',
    '756 2208 0295 57',
    '876 96 351 110',
    '876.96.351.110',
    '876\'96\'351\'110'
  ];

  const badlyFormattedNavs = [
    '756.2208\'0295.57',
    '756 2208\'0295.57',
    '756*2208*0295*57',
    '756..2208.0295.57',
    '756 2208  0295 57',
    '7562208029557',
    '876 96 351.110',
    '876 96.351.110',
    '876 9635 1110',
    '876.96..351.110',
    '876"96"351"110'
  ];

  it('should be formated correctly ' + formattedNavs, () => {
    let result;

    for (const navs of formattedNavs) {
      result = this.NavsService.isNavsFormatted(navs);
      expect(result).toBeTruthy();
    }
  });

  it('should not be formated correctly' + badlyFormattedNavs, () => {
    let result;

    for (const navs of badlyFormattedNavs) {
      result = this.NavsService.isNavsFormatted(navs);
      expect(result).toBeFalsy();
    }
  });
});

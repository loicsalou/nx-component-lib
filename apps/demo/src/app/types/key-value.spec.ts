import { KeyValue } from './key-value';

type officeType = KeyValue<'officePc', number>;
type decisionIdType = KeyValue<'decisionId', number>;
type vnType = KeyValue<'vn', number>;
type pcAgencyType = KeyValue<'pcAgency', number>;
type commentType = KeyValue<'comment', string>;
type addressType = KeyValue<'address', string>;
type ValidFrom = KeyValue<'validFrom', Date>;

type DecisionType = [officeType, decisionIdType, vnType, pcAgencyType, commentType, addressType, ValidFrom];

interface Decision {
  officePc: number;
  decisionId: number;
  vn: number;
  pcAgency: number;
  comment: string;
  address: string;
  validFrom: Date;
}

type myValue = 'valeur1' | 'valeur2' | 'valeur3';

describe('KeyValue tests', () => {
  it('simple usage', () => {
    const kv1: KeyValue<string, number> = ['hello', 123];
  });

  it('compares DecisionType and Decision interface', () => {
    const tDecision: DecisionType = [
      ['officePc', 403],
      ['decisionId', 403],
      ['vn', 403],
      ['pcAgency', 403],
      ['comment', 'commentaire'],
      ['address', 'une adresse'],
      ['validFrom', new Date()]
    ];
    const iDecision: Decision = {
      officePc: 403,
      decisionId: 403,
      vn: 403,
      pcAgency: 403,
      comment: 'commentaire',
      address: 'une adresse',
      validFrom: new Date()
    };
  });

  it('advances usage', () => {
    const kv1: KeyValue<string, number> = ['hello', 123];
  });
});

import {DataTable} from 'primeng/primeng';
import {SortOption} from './table-sorting';

/**
 * Wrapper des APIs de la Datatable de primeNg sur lesquelles on s'appuie.
 * Objectifs:
 * - ne pas surutiliser les appels nous rendant dépendants de l'implémentation de PrimeNg
 * - s'isoler un minimum de cette implémentation pour disposer d'une façade et pouvoir modifier en un seul point le
 * jour où l'implémentation évolue
 * @author Loic Salou
 */
export class PrimeDatatableApi {
  private datatable: DataTable;

  constructor(datatable: DataTable) {
    this.datatable = datatable;
  }

  setMultiSortMeta(multisortMeta) {
    this.datatable.multiSortMeta = multisortMeta;
  }

  sortMultiple() {
    this.datatable.sortMultiple();
  }

  setSortField(sortOptions: SortOption) {
    if (sortOptions) {
      this.datatable.sortField = sortOptions.field;
      this.datatable.sortOrder = sortOptions.order;
    }
  }

  sortSingle() {
    this.datatable.sortSingle();
  }
}

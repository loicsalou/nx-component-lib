import {DataTable, SortMeta} from 'primeng/primeng';
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

  setMultiSortMeta(multisortMeta: SortMeta[]) {
    this.datatable.sortMode='multiple';
    this.datatable.multiSortMeta = multisortMeta;
  }

  setSortField(sortOptions: SortOption) {
    if (sortOptions) {
      this.datatable.sortMode='single';
      this.datatable.sortField = sortOptions.field;
      this.datatable.sortOrder = sortOptions.order;
    }
  }

  sortSingle() {
    this.datatable.sortSingle();
  }

  groupOn(col: string) {
    if (col) {
      this.datatable.groupField = col;
      this.datatable.rowGroupMode = 'subheader';
      this.datatable.expandableRowGroups = true;
    } else {
      this.datatable.groupField = undefined;
      this.datatable.rowGroupMode = undefined;
      this.datatable.expandableRowGroups = undefined;
    }
  }

  getData() {
    return this.datatable.value;
  }
}

import {DataTable, SelectItem, SortMeta} from 'primeng/primeng';
import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import {PrimeDatatableApi} from './prime-datatable.api';
import {Column} from './table-column';
import {ReorderEvent, ResizeEvent, SortEvent, ToggleEvent} from './table-events';
import {SortOption} from './table-sorting';
import {GroupingOption} from './table-grouping';
import {PreferencesManagerService} from '../../shared';

export class TableModelHandler<T> {
  // en cours d'affichage: utilisées dans le multiselect du choix des colonnes
  colChooserColumns: string[];
  // mapping label de la colonne vers le champ (utilisé pour les selectItems du choix des colonnes affichées)
  colChooserOptions: SelectItem[];

  // colonnes visibles dans les groupHeaders de la table
  visibleColumns: Column[];

  // Données de la table
  data: T[];

  // Pagination
  paginatorDisplayed = true;

  // options de tri
  sortOptions: SortOption;
  // grouping facultatif
  grouped = false;
  groupingOptions: GroupingOption;

  // clé dans le storage
  private key: string;

  // colonnes disponibles
  private columns: Column[];

  // Regroupement des lignes par colonne de regroupement
  private groups: Dictionary<T[]> = {};

  // Les groupHeaders sont créés par le GroupHandler si il est fourni et n'ont de sens que pour les tables avec
  // regroupement de lignes
  private groupHeaders: Map<any, any> = new Map<any, any>();

  // primeNg datatable
  private datatable: PrimeDatatableApi;

  constructor(key: string,
              columns: Column[],
              private preferencesService: PreferencesManagerService,
              groupingOptions?: GroupingOption | boolean,
              private groupHandler?: GroupHandler<T>) {
    this.key = key;
    this.columns = columns;
    if (!columns || this.columns.length === 0) {
      throw new Error('une table a au moins une colonne');
    }

    // Options de groupagge
    this.initGrouping(this.groupingOptions);

    // initialisation des options du header
    this.initTableModel();

    // appliquer les préférences
    this.restoreDatatablePrefs();
  }

  /**
   * renvoie la colonne de regroupement ou undefined si pas de regroupement.
   * @returns {string}
   */
  groupingColumn(): string {
    if (this.grouped) {
      return this.groupingOptions.field;
    }

    return undefined;
  }

  getGroupHeader(row: T, key: any) {
    const groupingValue = row[ this.groupingColumn() ];
    return this.groupHeaders[ groupingValue ][ key ];
  }

  /**
   * Change le contenu de la table en terme de données (rows)
   * @param {T[]} data
   */
  setData(data: T[]) {
    this.data = data;
    this.groups = this.groupData(data);
    this.handleGroups(this.groups);
    this.sort(this.sortOptions);
  }

  /**
   * Permet de renseigner l'objet Datatable pour que le tableModel puisse piloter les tris, qui sont pour l'instant
   * défaillants dans PrimgNg lors du grouping.
   * @param {DataTable} table
   */
  setDatatable(table: PrimeDatatableApi) {
    this.datatable = table;
  }

  // vent handling
  columnsToggled(event: ToggleEvent) {
    this.colChooserColumns = event.value;
    this.rebuildVisibleColumns();
    this.savePrefs();
  }

  colResize(event: ResizeEvent) {
    const colIndex = event.element.cellIndex;
    const newWidth = event.element.style.width;
    const col: Column = this.visibleColumns[ colIndex ];
    col.width = newWidth;
    // ttention PrimeNg utilise "width" pour régler la largeur (pas min-width) et si on essaie de se baser sur
    // min-width on a à la fois width et min-width renseignés dans le style de la colonne et du coup celle-ci ne
    // peut plus être rétrécie
    col.style = {width: col.width};
    this.savePrefs();
  }

  colReordered(event: ReorderEvent) {
    this.colChooserColumns = event.columns.map(col => col.field);
    this.rebuildVisibleColumns();
    if (this.grouped) {
      this.groupingOptions.field = this.colChooserColumns[ 0 ];
      this.groups = this.groupData(this.data);
      this.handleGroups(this.groups);
      this.sort(this.sortOptions);
    }
    this.savePrefs();
  }

  groupSize(groupName: string): number {
    return this.groups[ groupName ] ? this.groups[ groupName ].length : 0;
  }

  group(groupName: string): T[] {
    return this.groups[ groupName ];
  }

  sorted(event: SortEvent) {
    this.sort(<SortOption>{field: event.field, order: event.order});
    this.savePrefs();
  }

  resetDatatablePrefs() {
    this.preferencesService.resetPrefs(this.key);
    this.initTableModel();
  }

  sort(sortOptions: SortOption) {
    // TODO le multisort ne semble pas fonctionner, je l'enlève, à revoir si besoin
    if (this.datatable) {
      if (this.grouped) {
        if (!sortOptions) {
          sortOptions = {field: this.groupingOptions.field, order: this.groupingOptions.order};
        }
        // garder le tri demandé
        this.sortOptions = {field: sortOptions.field, order: sortOptions.order};
        // i tri sur la colonne de regroupement prendre le sens du tri dans les options de regroupement
        if (this.sortOptions.field === this.groupingOptions.field) {
          this.groupingOptions.order = sortOptions.order;
        }
        // imposer le nouvel ordre de tri, par options de grouping en premier
        const multisortMeta: SortMeta[] = [
          {field: this.groupingOptions.field, order: this.groupingOptions.order},
          {field: sortOptions.field, order: sortOptions.order}
        ];
        this.datatable.setMultiSortMeta(multisortMeta);
        this.data = this.datatable.getData();
      } else {
        if (!sortOptions) {
          sortOptions = {field: this.columns[ 0 ].field, order: 1};
        }
        this.sortOptions = {field: sortOptions.field, order: sortOptions.order};
        this.datatable.setSortField(this.sortOptions);
      }

      this.savePrefs();
    }
  }

  // Appliquer l'option de groupage
  applyGrouping() {
    this.initGrouping(this.grouped);
    if (this.grouped) {
      this.groups = this.groupData(this.data);
      this.handleGroups(this.groups);
    }
  }

  // ==============================================================================
  // ============================== méthodes internes =============================
  // ==============================================================================

  private handleGroups(groups: Dictionary<T[]>) {
    if (this.groupHandler) {
      this.groupHeaders = this.groupHandler.buildHeaders(groups);
    } else {
      this.groupHeaders = new Map<string, string>();
      Object.getOwnPropertyNames(this.groups).forEach(key => {
        this.groupHeaders[ key ] = {};
        this.groupHeaders[ key ][ this.groupingColumn() ] = key;
      });
    }
  }

  private initTableModel() {
    this.colChooserColumns = this.columns
      .filter(col => col.visible === undefined || col.visible === true)
      .map(col => col.field);
    this.sortOptions = undefined;
    this.rebuildVisibleColumns();
    this.initColLabels();
  }

  private groupData(data: T[]) {
    if (this.groupingOptions) {
      return _.groupBy(data, this.groupingOptions.field);
    }
  }

  /**
   * Reconstruit les colonnes de la table.
   * <ul>
   * <li>On prend parmi toutes les colonnes possibles celles qui font partie de la sélection et on les met, dans
   * l'ordre, dans les visibleColumns</li>
   * <li>les visibleColumns sont reconstituées: on prend les colonnes statiques issues du code, on applique par-dessus
   * ce qui a été sauvegardé dans les préférences. Ainsi si une donnée a été ajoutée dans les colonnes issues du
   * code on ne les perd pas avec le restore</li>
   * <li>Pour l'instant on ne gère pas la suppression de data dans les colonnes statiques. A voir si cela s'avère
   * nécessaire</li>
   * </ul>
   */
  private rebuildVisibleColumns() {
    if (!this.visibleColumns) {
      this.visibleColumns = [];
    }
    this.visibleColumns = this.colChooserColumns
      .map(field => {
        const resultCol = this.columns.find(col => field === col.field);
        if (resultCol) {
          // colonne demandée déjà dans les visibleColumns, on écrase simplement les options
          const visibleCol = this.visibleColumns.find(col => field === col.field);
          if (visibleCol) {
            Object.assign(resultCol, visibleCol);
            if (resultCol.sortable === undefined) {
              // triable par défaut
              resultCol.sortable = true;
            }
          }
          if (!resultCol.width && !resultCol.style) {
            resultCol.width = '80px';
            resultCol.style = {width: resultCol.width};
          }
          // le clone est obligatoire pour que Prime recalcule toutes les colonnes
          return Object.assign({}, resultCol);
        } else {
          // colonne demandée non définie, on l'écarte
          this.colChooserColumns = this.colChooserColumns.filter(col => col !== field);
        }
      })
      .filter(col => col !== undefined);
  }

  /**
   * initialise les traductions des groupHeaders de colonnes dans le select du choix des colonnes
   */
  private initColLabels() {
    this.colChooserOptions = this.columns.map(col => {
      return {
        label: col.label,
        value: col.field,
        styleClass: col.styleClass
      };
    });
  }

  /**
   * sauvegarde les préférences de l'utilisateur
   */
  private savePrefs() {
    const preferences: TablePreferences = {
      displayedColumns: this.colChooserColumns,
      visibleColumns: this.visibleColumns.map(vc => {
        const saved = Object.assign({}, vc);
        delete saved.sortable;
        delete saved.visible;
        delete saved.clickable;
        return saved;
      }),
      sortOptions: this.sortOptions,
      groupingOptions: this.groupingOptions
    };

    this.preferencesService.savePrefs(this.key, preferences);
  }

  /**
   * restore les préférences de l'utilisateur
   */
  private restoreDatatablePrefs(): any {
    const restored: TablePreferences = this.preferencesService.restorePrefs(this.key);
    if (restored) {
      this.colChooserColumns = restored.displayedColumns;
      this.sortOptions = restored.sortOptions ? restored.sortOptions : this.sortOptions;
      this.groupingOptions = restored.groupingOptions ? restored.groupingOptions : this.groupingOptions;
      this.visibleColumns = restored.visibleColumns.map((col: Column) => {
        delete col.clickable;
        delete col.visible;
        delete col.sortable;
        return col;
      });
      this.rebuildVisibleColumns();
    }
  }

  private initGrouping(groupingOptions: GroupingOption | boolean) {
    if (typeof groupingOptions === 'boolean') {
      if (groupingOptions) {
        this.grouped = true;
        this.groupingOptions = {field: this.colChooserColumns[ 0 ], order: 1};
      }
    } else {
      this.groupingOptions = groupingOptions;
      this.grouped = groupingOptions !== undefined;
    }

    if (this.datatable) {
      this.datatable.groupOn(this.groupingColumn());
      this.sort(this.sortOptions);
    }
  }
}

export interface GroupHandler<T> {
  buildHeaders(groupsByGroupingKey: Dictionary<T[]>): Map<any, any>;
}

export interface TablePreferences {
  // iste des colonnes visibles, par ordre gauche-droite
  displayedColumns: string[];
  // olonnes avec leurs options
  visibleColumns: Column[];
  // ptions de tri
  sortOptions?: SortOption;
  // ptions de tri
  groupingOptions?: GroupingOption;
}

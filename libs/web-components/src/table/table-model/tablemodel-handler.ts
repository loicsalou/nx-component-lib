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
  displayedColumns: string[];
  // colonnes visibles dans les headers de la table
  visibleColumns: Column[];
  // Données de la table
  data: T[];
  // Données de la table
  paginatorDisplayed = true;
  // options de tri
  sortOptions: SortOption;
  // mapping label de la colonne vers le champ (utilisé pour les selectItems du choix des colonnes affichées)
  colOptions: SelectItem[];
  // grouping facultatif
  groupingOptions: GroupingOption;
  // clé dans le storage
  private key: string;
  // colonnes disponibles, affichées et visibles
  private columns: Column[];
  // egroupement des lignes par colonne de regroupement
  private groups: Dictionary<T[]> = {};

  // Les headers sont créés par le GroupHandler si il est fourni et n'ont de sens que pour les tables avec regroupement
  // de lignes
  private headers: Map<any, any> = new Map<any, any>();

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
    if (typeof groupingOptions === 'boolean') {
      if (groupingOptions) {
        this.groupingOptions = {field: columns[ 0 ].field, order: 1};
      }
    } else {
      this.groupingOptions = groupingOptions;
    }
    this.reinitTableModel();
    this.restoreDatatablePrefs();
  }

  /**
   * renvoie la colonne de regroupement ou undefined si pas de regroupement.
   * @returns {string}
   */
  groupingColumn(): string {
    if (!this.groupingOptions) {
      return undefined;
    }

    return this.groupingOptions.field;
  }

  getHeader(row: T, key: any) {
    const groupingValue = row[ this.groupingColumn() ];
    return this.headers[ groupingValue ][ key ];
  }

  /**
   * Change le contenu de la table en terme de données (rows)
   * @param {T[]} data
   */
  setData(data: T[]) {
    this.data = data;
    this.groups = this.groupData(data);
    this.handleGroups(this.groups);
    // requis, sinon la datatable n'a pas encore conscience que les data sont là. Il faut laisser le process se
    // terminer avant de traiter le sort ==> un simple timeout suffit, ce n'est pas une question de temps mais
    // d'asynchronisme
    setTimeout(() => this.sort(this.sortOptions), 100);
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
    this.displayedColumns = event.value;
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
    this.displayedColumns = event.columns.map(col => col.field);
    this.rebuildVisibleColumns();
    if (this.groupingOptions) {
      this.groupingOptions.field = this.displayedColumns[ 0 ];
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
    this.reinitTableModel();
  }

  sort(sortOptions: SortOption) {
    // ODO le multisort ne semble pas fonctionner, je l'enlève, à revoir si besoin
    if (this.datatable) {
      if (this.groupingOptions) {
        if (!sortOptions) {
          sortOptions = {field: this.groupingOptions.field, order: this.groupingOptions.order};
        }
        // arder le tri demandé
        this.sortOptions = {field: sortOptions.field, order: sortOptions.order};
        // i tri sur la colonne de regroupement prendre le sens du tri dans les options de regroupement
        if (this.sortOptions.field === this.groupingOptions.field) {
          this.groupingOptions.order = sortOptions.order;
        }
        // i on a la table, imposer le nouvel ordre de tri, par options de grouping en premier
        if (this.datatable) {
          const multisortMeta: SortMeta[] = [
            {field: this.groupingOptions.field, order: this.groupingOptions.order},
            {field: sortOptions.field, order: sortOptions.order}
          ];
          this.datatable.setMultiSortMeta(multisortMeta);
          this.datatable.sortMultiple();
        }
      } else {
        if (!sortOptions) {
          sortOptions = {field: this.columns[ 0 ].field, order: 1};
        }
        this.sortOptions = {field: sortOptions.field, order: sortOptions.order};
        this.datatable.setSortField(this.sortOptions);
        this.datatable.sortSingle();
      }

      this.savePrefs();
    }
  }

  // ==============================================================================
  // ============================== méthodes internes =============================
  // ==============================================================================

  private handleGroups(groups: Dictionary<T[]>) {
    if (this.groupHandler) {
      this.headers = this.groupHandler.buildHeaders(groups);
    } else {
      this.headers = new Map<string, string>();
      Object.getOwnPropertyNames(this.groups).forEach(key => {
        this.headers[ key ] = {};
        this.headers[ key ][ this.groupingColumn() ] = key;
      });
    }
  }

  private reinitTableModel() {
    this.displayedColumns = this.columns
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
    this.visibleColumns = this.displayedColumns
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
          this.displayedColumns = this.displayedColumns.filter(col => col !== field);
        }
      })
      .filter(col => col !== undefined);
  }

  /**
   * initialise les traductions des headers de colonnes dans le select du choix des colonnes
   */
  private initColLabels() {
    this.colOptions = this.columns.map(col => {
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
      displayedColumns: this.displayedColumns,
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
      this.displayedColumns = restored.displayedColumns;
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

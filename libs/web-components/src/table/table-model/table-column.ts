/**
 * Définition d'une colonne de table, comprenant de multiples options
 */
export interface Column {
  // nom du champ
  field: any;
  // label du champ (pour le header de la table)
  label: string;
  // champ triable ou pas
  sortable?: boolean;
  // indique si la représentation de la colonne doit se faire via un icone
  icon?: boolean;
  // largeur de la colonne si modifiée
  style?: any;
  // classe(s) CSS pour le selectItem de la colonne dans le choix des colonnes
  styleClass?: any;
  // visibilité initiale de la colonne (lorsqu'on n'utilise pas les préférences), true par défaut
  visible?: boolean;
  // largeur de la colonne si modifiée
  width?: string;
  // facultatif. cliquable ? défaut non
  clickable?: boolean;
  // facultatif. Footer cliquable ? défaut ==> attribut clickable
  footerClickable?: boolean;
}

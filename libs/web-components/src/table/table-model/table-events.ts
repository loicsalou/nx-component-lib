import {Column as PrimeColumn} from 'primeng/primeng';

export interface ToggleEvent {
  originalEvent: MouseEvent;
  value: string[];
}

export interface ResizeEvent {
  delta: number;
  element: any;
}

export interface ReorderEvent {
  columns: PrimeColumn[];
  dragIndex: string;
  dropIndex: number;
}

export interface SortEvent {
  field: string;
  order: number;
  multisortmeta: any;
}

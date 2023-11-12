import {SortOption} from "./SortTypes";

export interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    sortOption?: SortOption
    numeric: boolean;
}
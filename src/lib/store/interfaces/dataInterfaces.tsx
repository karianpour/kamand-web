
export interface IQueryData {
	queryParam: any;
	data: any[];
	selection: ISelection,
	loading: boolean;
	error: boolean;
}

export interface ISelection {
	isSelected(index: number): boolean,
	setSelected(index: number, selected: boolean): void,
	selected: boolean,
}

export interface IQueryData {
	key?: string,
	// queryParam: any;
	queryParams: any;
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
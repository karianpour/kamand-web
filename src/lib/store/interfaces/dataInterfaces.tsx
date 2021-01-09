export interface IQueryParams {
	[key: string]: any,
}
export interface IQueryData {
	key?: string,
	// queryParam: any;
	queryParams: IQueryParams;
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
import { Pagination } from "@mui/material";
import { ViewStatus, ViewStatusProps, ViewStatusState } from "./View.Status";

export interface ViewPagingProps extends ViewStatusProps {}

export interface ViewPagingState extends ViewStatusState {
	records: any[];
	page: number;
	pageSize: number;
	pageCount: number;
	rowCount: number;
}

export class ViewPaging<P extends ViewPagingProps, S extends ViewPagingState, SS = any> extends ViewStatus<P, S, SS> {
	constructor(props: P) {
		super(props);
		this.initRecords = this.initRecords.bind(this);
		this.getRecords = this.getRecords.bind(this);
		this.onPageChange = this.onPageChange.bind(this);
		this.onRowsPerPageChange = this.onRowsPerPageChange.bind(this);
		this.doPaginationRender = this.doPaginationRender.bind(this);
		this.state = {
			...this.state,
			records: [],
			page: 1,
			pageSize: 10,
			pageCount: 0,
			rowCount: 0,
		};
	}

	protected initRecords(count: number, rows: any[]) {}

	protected getRecords(page: number) {}

	protected onPageChange(event: any, page: number) {
		this.getRecords(page);
	}

	protected onRowsPerPageChange(e: any) {
		this.setState({
			page: 0,
			pageSize: e.target.value,
		});
	}

	protected doPaginationRender() {
		return this.state.rowCount > this.state.pageSize && <Pagination sx={{ mt: 2 }} className="pagination" count={this.state.pageCount} page={this.state.page} onChange={this.onPageChange} variant="outlined" shape="rounded" />;
	}
}

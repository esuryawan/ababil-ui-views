import React from "react";
import { Alert, AlertColor, AlertTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import { Session, theAuthService } from "ababil-auth";

export enum Severity {
	None = 0,
	Success,
	Info,
	Warning,
	Error,
}

export interface ViewStatusProps {}

export interface ViewStatusState {
	message: string;
	severity: Severity;
	errorCode: number;
	session: Session | undefined;
}

export class ViewStatus<P extends ViewStatusProps, S extends ViewStatusState, SS = any> extends React.Component<P, S, SS> {
	constructor(props: P) {
		super(props);
		this.state = {
			...this.state,
			message: "",
			severity: Severity.None,
			errorCode: 0,
			session: theAuthService.getSession(),
		};
		this.onStatusError = this.onStatusError.bind(this);
		this.onStatusClose = this.onStatusClose.bind(this);
		this.doStatusRender = this.doStatusRender.bind(this);
	}

	onStatusError(error: any, severity: number) {
		let s = "";
		if (typeof error === "string") {
			s = error;
		} else {
			s = error.message;
			if (error.response && error.response.data) {
				let rc = error.response.status;
				if (error.response.data.errcode) {
					rc = error.response.data.errcode;
				}
				if (error.response.data.errdesc) {
					s = rc + ": " + error.response.data.errdesc;
				} else if (error.response.statusText) {
					s = rc + ": " + error.response.statusText;
				} else {
					s = error.message;
				}
				if (error.response.data.message) {
					s = s + ". " + error.response.data.message;
				}
			}
		}

		this.setState({
			errorCode: error.response ? error.response.status : 0,
			message: s,
			severity: severity,
		});
	}

	onStatusClose() {
		// check login is expired
		if (this.state.errorCode === 440) {
			theAuthService.logout();
			document.location.href = "/";

			// user not login
		} else if (this.state.errorCode === 401) {
			theAuthService.logout();
			document.location.href = "/";

			// check secure token doesnot exist
		} else if (this.state.errorCode === 403) {
			document.location.href = "/";
		}
		this.setState({
			severity: 0,
		});
	}

	doStatusRender() {
		if (this.state.severity > Severity.None) {
			let s: AlertColor | undefined;
			let t: string = "";
			switch (this.state.severity) {
				case Severity.Success:
					s = "success";
					t = "Success";
					break;
				case Severity.Info:
					s = "info";
					t = "Info";
					break;
				case Severity.Warning:
					s = "warning";
					t = "Warning";
					break;
				case Severity.Error:
					s = "error";
					t = "Error";
					break;

				default:
					break;
			}
			let button = <CloseIcon fontSize="inherit" />;
			switch (this.state.errorCode) {
				case 401:
				case 440:
					button = <LoginIcon />;
					break;

				default:
					break;
			}
			let messages = this.state.message.split("|");
			return (
				<Alert
					severity={s}
					sx={{ mt: 2 }}
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							size="small"
							onClick={() => {
								this.onStatusClose();
							}}
						>
							{button}
						</IconButton>
					}
				>
					<AlertTitle>{t}</AlertTitle>
					{messages.map((x: string, i: number) => {
						return (
							<ul key={i}>
								<li>{x}</li>
							</ul>
						);
					})}
				</Alert>
			);
		} else {
			return "";
		}
	}
}

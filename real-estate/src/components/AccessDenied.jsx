export default function AccessDenied() {
	return (
		<div className="uk-position-relative" uk-height-viewport="offset-top: true">
			<div className="uk-position-center">
				<h1 className="uk-text-danger">
				<span
					uk-icon="icon: ban; ratio: 10"
					className="uk-margin-large-right"
				></span>Access denied</h1>
			</div>
		</div>
	);
}
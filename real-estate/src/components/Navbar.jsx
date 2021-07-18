export default function Navbar({ principal = null }) {
	return (
		<nav className="uk-navbar-container" uk-navbar="">
			<div className="uk-width-expand backgroundf">
				<div className="uk-navbar-left">
					<div className="uk-navbar-item uk-logo colorf" href="#">Real Estate</div>
				</div>
			</div>
		</nav>
	);
}
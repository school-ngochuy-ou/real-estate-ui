import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import { $fetch } from '../fetch';
import { setCookie, removeCookie } from '../utils';
import { auth } from '../config/default';

export default function Navbar() {
	const [model, setModel] = useState({
		username: "",
		password: ""
	});
	const [loginFormVision, toggleLoginFormVision] = useState(false);
	const { principal } = useAuth();
	const onSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const [res, err] = await $fetch(`/api/authenticate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(model)
		});

		if (err) {
			console.error(err);
			return;
		}

		setCookie(auth.tokenName, (await res.json()).id_token, 7);
		window.location.reload(false);
	};
	const onModelChange = (event) => {
		setModel({
			...model,
			[event.target.name]: event.target.value
		});
	};

	return (
		<Fragment>
			<nav className="uk-navbar-container backgroundf" uk-navbar="">
				<div className="uk-navbar-left">
					<Link to="/" className="uk-link-reset">
						<div className="uk-navbar-item uk-logo colorf uk-link-reset">
							Real Estate
						</div>
					</Link>
				</div>
				<div className="uk-navbar-right uk-margin-right">
				{
					principal != null && principal.authorities.includes(auth.role.ADMIN) ? (
						<Link to="/user/list">
							<button
								className="uk-button uk-button-muted uk-text-emphasis uk-margin-right"
							>
								Users
							</button>
						</Link>
					) : null
				}
				{
					principal == null ? (
						<button className="uk-button uk-button-muted uk-text-emphasis"
						onClick={() => toggleLoginFormVision(true)}>
							Login
						</button>
					) : (
						<button className="uk-button uk-button-muted uk-text-emphasis"
						onClick={() => {
							removeCookie(auth.tokenName);
							window.location.reload(false);
						}}>
							Logout
						</button>
					)
				}	
				</div>
			</nav>
			{
				principal == null && loginFormVision === true ? (
					<div id="modal-sections" uk-modal="" className="uk-open uk-display-block">
						<div className="uk-modal-dialog">
							<div className="uk-modal-header">
								<h2 className="uk-modal-title">Login</h2>
							</div>
							<div className="uk-modal-body">
								<form onSubmit={onSubmit}>
									<div className="uk-margin">
										<label className="uk-label backgroundf">Username</label>
										<input
											className="uk-input"
											type="text"
											name="username"
											placeholder="Username"
											value={model.username}
											onChange={onModelChange}
										/>
									</div>
									<div className="uk-margin">
										<label className="uk-label backgroundf">Password</label>
										<input
											className="uk-input"
											type="password"
											name="password"
											placeholder="Password"
											value={model.password}
											onChange={onModelChange}
										/>
									</div>
								</form>
							</div>
							<div className="uk-modal-footer uk-text-right">
								<button
									className="uk-button uk-button-default" type="button"
									onClick={() => toggleLoginFormVision(false)}
								>Cancel</button>
								<button
									className="uk-button backgroundf" type="button"
									onClick={onSubmit}
								>Login</button>
							</div>
						</div>
					</div>
				) : null
			}
		</Fragment>
	);
}
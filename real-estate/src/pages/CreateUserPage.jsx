import { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import { $fetch } from '../fetch';
import { useAuth } from '../hooks/auth';
import { auth } from '../config/default';

import AccessDenied from '../components/AccessDenied';

const STORE = {
	model: {
		username: "",
		email: "",
		password: "",
		phoneNumber: ""
	}
}

const MODIFY_MODEL = "MODIFY_MODEL";

export default function CreateUserPage() {
	const [store, dispatchStore] = useReducer(
		(oldState, { type = null, payload = null } = {}) => {
			switch(type) {
				case MODIFY_MODEL: {
					const { name, value } = payload;

					if (typeof name !== 'string') {
						return oldState;
					}

					const { model } = oldState;

					return {
						...oldState,
						model: {
							...model,
							[name]: value
						}
					};
				}
				default: return oldState;
			}
		}, { ...STORE }
	);
	const onModelChange = event => {
		const { name, value } = event.target;

		dispatchStore({
			type: MODIFY_MODEL,
			payload: { name, value }
		});
	};
	const { push } = useHistory();
	const onSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const [res, err] = await $fetch(`/api/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				...model,
				'login': model.username,
				'authorities': [auth.role.USER]
			})
		}, principal.token);

		if (err) {
			console.error(err);
			return;
		}

		if (res.ok) {
			push('/user/list');
			return;
		}

		console.error(await res.text());
	};
	const { model } = store;
	const { principal } = useAuth();

	if (principal == null) {
		return <AccessDenied />;
	}

	if (!principal.authorities.includes(auth.role.ADMIN)) {
		return <AccessDenied />;	
	}

	return (
		<div className="uk-padding">
			<h1 className="uk-heading-line">
				<span>Create a new User</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="uk-margin">
					<input
						className="uk-input"
						type="text"
						name="email"
						placeholder="Email"
						onChange={onModelChange}
						required="required"
						value={model.email}
					/>
				</div>
				<div className="uk-margin">
					<input
						className="uk-input"
						type="text"
						name="username"
						placeholder="Username"
						required="required"
						onChange={onModelChange}
						value={model.username}
					/>
				</div>
				<div className="uk-margin">
					<input
						className="uk-input"
						type="text"
						name="phoneNumber"
						placeholder="Phone"
						required="required"
						onChange={onModelChange}
						value={model.phoneNumber}
					/>
				</div>
				<div className="uk-margin">
					<input
						className="uk-input"
						type="password"
						name="password"
						placeholder="Password"
						required="required"
						onChange={onModelChange}
						value={model.password}
					/>
				</div>
				<div className="uk-margin">
					<button className="uk-button backgroundf" type="submit">Submit</button>
				</div>
			</form>
		</div>
	);
}
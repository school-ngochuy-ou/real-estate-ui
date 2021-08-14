import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { $fetch } from '../fetch';

import { useAuth } from '../hooks/auth';

import { auth } from '../config/default';

import AccessDenied from '../components/AccessDenied';

const store = {
	model: {
		"firstName" : "",
		"lastName" : "",
		"email" : "",
		"phoneNumber" : "",
		"id" : 1,
		"login" : "",
		"imageUrl" : "",
		"activated" : false,
		"langKey" : "",
		"createdBy" : "",
		"createdDate" : null,
		"lastModifiedBy" : "",
		"lastModifiedDate" : null,
		"authorities" : []
	}
};
const roles = Object.entries(auth.role).map(role => role[1].split("ROLE_")[1]);

export default function EditUserPage() {
	const [model, setModel] = useState(store.model);
	const { principal } = useAuth();
	const { id: username } = useParams();

	useEffect(() => {
		if (principal == null || username == null || username.length === 0) {
			return;
		}

		const doFetch = async () => {
			const [res, err] = await $fetch(`/api/admin/users/${username}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			}, principal.token);

			if (err) {
				console.error(err);
				return;
			}

			if (res.ok) {
				setModel(await res.json());
				return;
			}

			console.error(await res.json());
		};

		doFetch();
	}, [username, principal, setModel]);
	const onModelChange = (event) => {
		const { target: { name, value } } = event;

		setModel({
			...model,
			[name]: value
		});
	};
	const onModelAuthoritiesChange = (event) => {
		const { target: { value, checked } } = event;

		if (checked === false) {
			setModel({
				...model,
				authorities: [...model.authorities].filter(role => role !== value)
			});
			return;
		}

		setModel({
			...model,
			authorities: [...model.authorities, value]
		});
	}
	const onSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const [res, err] = await $fetch(`/api/admin/users/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(model)
		}, principal.token);

		if (err) {
			console.error(err);
			return;
		}

		if (res.ok) {
			setModel(await res.json());
			return;
		}

		console.error(await res.json());
	};

	if (principal == null) {
		return <AccessDenied />;
	}

	if (!principal.authorities.includes(auth.role.ADMIN)) {
		return <AccessDenied />;
	}

	return (
		<div className="uk-container">
			<h1 className="uk-heading-line">
				<span>Edit User {model && model.login}</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="uk-margin">
					<label className="uk-label backgroundf">First Name</label>
					<input
						className="uk-input"
						type="text"
						placeholder="First Name"
						name="firstName"
						value={model.firstName}
						onChange={onModelChange}
					/>
				</div>
				<div className="uk-margin">
					<label className="uk-label backgroundf">Last Name</label>
					<input
						className="uk-input"
						type="text"
						placeholder="Last Name"
						name="lastName"
						value={model.lastName}
						onChange={onModelChange}
					/>
				</div>
				<div className="uk-margin">
					<label className="uk-label backgroundf">Email</label>
					<input
						className="uk-input"
						type="email"
						placeholder="Email"
						name="email"
						value={model.email}
						onChange={onModelChange}
					/>
				</div>
				<div className="uk-margin">
					<label className="uk-label backgroundf">Phone Number</label>
					<input
						className="uk-input"
						type="text"
						placeholder="Phone number"
						name="phoneNumber"
						value={model.phoneNumber}
						onChange={onModelChange}
					/>
				</div>
				<div className="uk-margin">
					<label className="uk-label backgroundf">Image</label>
					<input
						className="uk-input"
						type="text"
						placeholder="Image"
						name="imageUrl"
						value={model.imageUrl}
						onChange={onModelChange}
					/>
				</div>
				{
					principal.authorities.includes(auth.role.ADMIN) ? (
						<Fragment>
							<div className="uk-margin">
								<label className="uk-label backgroundf">Login</label>
								<input
									className="uk-input"
									type="text"
									placeholder="Login"
									name="login"
									value={model.login}
									onChange={onModelChange}
								/>
							</div>
							<div className="uk-margin">
								<label className="uk-label backgroundf">Authorities</label>
								<br/>
								{
									roles.map(role => (
										<div
											className="uk-margin-small"
											key={role}
										>
											<input
												className="uk-checkbox uk-margin-small-right"
												type="checkbox"
												name="authorities"
												checked={model.authorities.includes(`ROLE_${role}`)}
												value={`ROLE_${role}`}
												onChange={onModelAuthoritiesChange}
											/>
											<label>{role}</label>		
										</div>
									))
								}
							</div>
							<div className="uk-margin">
								<label className="uk-label backgroundf">Activation</label>
								<br/>
								<div className="uk-margin-small">
									<input
										className="uk-radio uk-margin-small-right"
										type="radio"
										name="activated"
										value={true}
										onChange={onModelChange}
									/>
									<label>Active</label>
								</div>
								<div className="uk-margin-small">
									<input
										className="uk-radio uk-margin-small-right"
										type="radio"
										name="activated"
										value={false}
										onChange={onModelChange}
									/>
									<label>Inactive</label>
								</div>
							</div>
							<div className="uk-margin">
								<label className="uk-label backgroundf">Language Key</label>
								<input
									className="uk-input"
									type="text"
									name="langKey"
									value={model.langKey}
									onChange={onModelChange}
								/>
							</div>
						</Fragment>
					) : null
				}
				<div className="uk-margin">
					<button
						type="Submit"
						className='uk-button backgroundf'
					>Submit</button>
				</div>
			</form>
		</div>
	);
}
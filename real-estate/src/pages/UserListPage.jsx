import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { $fetch } from '../fetch';

import { useAuth } from '../hooks/auth';

import { auth } from '../config/default';

import AccessDenied from '../components/AccessDenied';

const store = {
	list: []
};

export default function UserListPage() {
	const [list, setList] = useState(store.list);
	const { principal } = useAuth();

	useEffect(() => {
		const doFetch = async () => {
			if (principal == null) {
				return;
			}

			const [res, err] = await $fetch(`/api/admin/users`, {
				headers: {
					'Accept': 'application/json'
				}
			}, principal.token);

			if (err) {
				console.error(err);
				return;
			}

			if (res.ok) {
				setList(await res.json());
				return;
			}

			console.error(await res.json());
		};

		doFetch();
	}, [principal, setList]);
	const deleteUser = async (username) => {
		const [res, err] = await $fetch(`/api/admin/users/${username}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json'
			}
		}, principal.token);

		if (err) {
			console.error(err);
			return;
		}

		if (res.ok) {
			setList(list.filter(user => user.login !== username));
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
				<span>Account List</span>
			</h1>
			<table className="uk-table uk-table-justify uk-table-divider">
				<thead>
					<tr>
						<th className="uk-width-small">Username</th>
						<th>Role</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
				{
					list.map(user => (
						<tr key={user.login}>
							<td>{user.login}</td>
							<td>
							{
								user.authorities.map(ele => ele.split("ROLE_")[1]).join(', ')
							}
							</td>
							<td>
								<Link to={`/user/edit/${user.login}`}>
									<button
										className="uk-button uk-button-default uk-margin-right"
										type="button"
									>EDIT</button>
								</Link>
								<button
									className="uk-button uk-button-danger"
									type="button"
									onClick={() => deleteUser(user.login)}
								>DELETE</button>
							</td>
						</tr>	
					))
				}
				</tbody>
			</table>
			<div className="uk-margin">
				<Link to="/user/create">
					<button className="uk-button uk-button-primary">Create User</button>
				</Link>
			</div>
		</div>
	);
}
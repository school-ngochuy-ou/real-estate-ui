import { useEffect, useReducer, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import { $fetch } from '../fetch';

import { auth } from '../config/default';

const STORE = {
	model: null,
}

const SET_MODEL = "SET_MODEL";

export default function ViewProjectPage() {
	const { id } = useParams();
	const [store, dispatchStore] = useReducer(
		(oldState, { type = null, payload = null } = {}) => {
			switch(type) {
				case SET_MODEL: {
					if (payload == null || typeof payload !== 'object') {
						return oldState;
					}

					return {
						...oldState,
						model: payload
					};
				}
				default: return oldState;
			}
		}, { ...STORE }
	);

	useEffect(() => {
		const doFetch = async () => {
			if (id == null) {
				return;
			}

			const [res, fetchProductErr] = await $fetch(`/api/projects/${id}`);

			if (fetchProductErr) {
				console.error(fetchProductErr);
				return;
			}

			dispatchStore({
				type: SET_MODEL,
				payload: await res.json()
			});
		};

		doFetch();
	}, [id, dispatchStore]);
	const { principal } = useAuth();
	const switchGeneralView = () => {
		setView(<GeneralView model={model} principal={principal}/>);
	};
	const switchDescriptionView = () => {
		setView(<OwnerDescriptionView model={model} />);
	};
	const { model } = store;
	const [view, setView] = useState();

	if (id == null || model == null) {
		return null;
	}

	return (
		<div className="uk-padding" style={{width: "850px"}}>
			<div className="uk-grid-small" uk-grid="">
				<div className="uk-width-3-4">
					<h2 className="uk-heading">{model.address}</h2>
				</div>
				<div className="uk-width-1-4">
					<h2 className="uk-text-right">{model.price}</h2>
				</div>
			</div>
			<div className="uk-margin">
				<ul uk-tab="" id="tab">
					<li><a href="#tab" onClick={switchGeneralView}>General</a></li>
					<li><a href="#tab" onClick={switchDescriptionView}>Descriptions</a></li>
				</ul>
			</div>
			{
				view == null ? (
					<GeneralView
						model={model}
						principal={principal}
					/>
				)
				: view
			}
		</div>
	);
}

function GeneralView({ model = null, principal = null }) {
	if (model == null) {
		return null;
	}
	console.log(principal);
	return (
		<div>
			<div className="uk-grid-small uk-child-width-1-2" uk-grid="">
				<div>
					<table className="uk-width-1-1">
						<thead></thead>
						<tbody>
							<tr>
								<td className="uk-text-bold uk-width-small">Owner</td>
								<td>{model.owner}</td>
							</tr>
							<tr>
								<td className="uk-text-bold">Type</td>
								<td>{model.homeType.typeName}</td>
							</tr>
						</tbody>

					</table>
				</div>
				<div>
					<table className="uk-width-1-1">
						<thead></thead>
						<tbody>
							<tr>
								<td className="uk-text-bold uk-width-small">Status</td>
								<td>{model.projectStatus}</td>
							</tr>
							<tr>
								<td className="uk-text-bold uk-width-small">Floor space</td>
								<td>{model.floorSpace}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="uk-margin">
				<h4 className="uk-heading">Description</h4>
				<p>{model.desciption}</p>
			</div>
			<div className="uk-margin">
			{
				principal != null && principal.authorities.includes(auth.role.USER) ? (
					<Link to={`/project/edit/${model.id}`}>
						<button className="uk-button backgroundf">
							Edit Project
						</button>
					</Link>
				) : null
			}
			</div>
		</div>
	);
}

function OwnerDescriptionView({ model }) {
	if (model == null) {
		return null;
	}

	return (
		<div className="uk-padding">
			{ model.ownerDesciption }
		</div>
	);
}
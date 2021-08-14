// import { Fragment, useReducer, useEffect } from 'react';
import { useReducer, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { $fetch } from '../fetch.js';
import { useAuth } from '../hooks/auth';

import { auth } from '../config/default';

import AccessDenied from '../components/AccessDenied';

const STORE = {
	form: {
		model: {
			address: "",
			city: "",
			rooms: 1,
			price: 40000,
			floorSpace: 10.00,
			attachment: "",
			extras: [],
			homeType: ""
		},
		extras: [],
		homeTypes: []
	}
};

const dispatchers = {
	MODIFY_MODEL: (payload, oldState) => {
		const { name, value } = payload;

		if (typeof name !== 'string') {
			return oldState;
		}

		const { form, form: { model } } = oldState;

		return {
			...oldState,
			form: {
				...form,
				model: { ...model, [name]: value }
			}
		};
	},
	SET_EXTRAS: (payload, oldState) => {
		if (!Array.isArray(payload)) {
			return oldState;
		}

		return {
			...oldState,
			form: {
				...oldState.form,
				extras: payload
			}
		};
	},
	SET_HOMETYPES: (payload, oldState) => {
		if (!Array.isArray(payload)) {
			return oldState;
		}

		return {
			...oldState,
			form: {
				...oldState.form,
				homeTypes: payload
			}
		};	
	}
};

const MODIFY_MODEL = "MODIFY_MODEL";
const SET_EXTRAS = "SET_EXTRAS";
const SET_HOMETYPES = "SET_HOMETYPES";

export default function CreateProjectPage() {
	const [store, dispatchStore] = useReducer(
		(oldState, { type = null, payload = null } = {}) => {
			const dispatcher = dispatchers[type];

			return dispatcher == null ? oldState : dispatcher(payload, oldState);
		}, { ...STORE }
	);
	const history = useHistory();
	const onModelChange = (event) => {
		dispatchStore({
			type: MODIFY_MODEL,
			payload: {
				name: event.target.name,
				value: event.target.value
			}
		});
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const [res, err] = await $fetch(`/api/projects`, {
			method: 'POST',
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
			history.push("/home");
			return;	
		}

		console.error(await res.text());
	};
	useEffect(() => {
		const doFetch = async () => {
			const [extras, fetchExtrasErr] = await $fetch(`/api/extras`, {
				headers: {
					'Accept': 'application/json'
				}
			});

			if (fetchExtrasErr) {
				console.error(fetchExtrasErr);
				return;
			}

			dispatchStore({
				type: SET_EXTRAS,
				payload: await extras.json()
			});

			const [homeTypes, fetchHomeTypesErr] = await $fetch(`/api/home-types`, {
				headers: {
					'Accept': 'application/json'
				}
			});

			if (fetchHomeTypesErr) {
				console.error(fetchHomeTypesErr);
				return;
			}

			dispatchStore({
				type: SET_HOMETYPES,
				payload: await homeTypes.json()
			});
		};

		doFetch();
	}, []);
	const onCheckBoxChange = (event) => {
		const { value, checked } = event.target;

		if (checked) {
			dispatchStore({
				type: MODIFY_MODEL,
				payload: {
					name: "extras",
					value: [...model.extras, { id: value }]
				}
			});
			return;
		}

		dispatchStore({
			type: MODIFY_MODEL,
			payload: {
				name: "extras",
				value: [...model.extras].filter(ele => ele.id !== value)
			}
		});
		return;
	};
	const onHomeTypeChange = (event) => {
		const { value } = event.target;

		dispatchStore({
			type: MODIFY_MODEL,
			payload: {
				name: event.target.name,
				value: homeTypes.filter(ele => ele.id === parseInt(value))[0]
			}
		});
	};
	const {
		form: { model, extras, homeTypes }
	} = store;
	const { principal } = useAuth();

	if (principal === null) {
		return (
			<AccessDenied />
		);
	}

	if (!principal.authorities.includes(auth.role.USER)) {
		return <AccessDenied />
	}

	return (
		<div className="uk-padding uk-width-2xlarge">
			<h1 className="uk-heading-line">
				<span>Create Project</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="uk-margin uk-grid-small uk-child-width-1-2" uk-grid="">
					<div>
						<div>
							<label className="uk-label backgroundf">Address</label>
							<input
								className="uk-input"
								name="address"
								type="text"
								placeholder="Address"
								onChange={onModelChange}
								value={model.address}
							/>
						</div>
					</div>
					<div>
						<div>
							<label className="uk-label backgroundf">City</label>
							<input
								className="uk-input"
								name="city"
								type="text"
								placeholder="City"
								onChange={onModelChange}
								value={model.city}
							/>
						</div>
					</div>
				</div>
				<div className="uk-margin uk-grid-small uk-child-width-1-2" uk-grid="">
					<div>
						<div>
							<label className="uk-label backgroundf">Rooms</label>
							<input
								className="uk-input"
								name="rooms"
								type="number"
								placeholder="Number of rooms"
								onChange={onModelChange}
								value={model.number}
							/>
						</div>
					</div>
					<div>
						<div>
							<label className="uk-label backgroundf">Price</label>
							<input
								className="uk-input"
								name="price"
								type="number"
								placeholder="Price"
								onChange={onModelChange}
								value={model.price}
							/>
						</div>
					</div>
				</div>
				<div className="uk-margin uk-grid-small uk-child-width-1-2" uk-grid="">
					<div>
						<div>
							<label className="uk-label backgroundf">Floor space</label>
							<input
								className="uk-input"
								name="floorSpace"
								type="number"
								placeholder="Floor space"
								onChange={onModelChange}
								value={model.floorSpace}
							/>
						</div>
					</div>
					<div>
						<div>
							<label className="uk-label backgroundf">Attachment</label>
							<input
								className="uk-input"
								name="attachment"
								type="text"
								placeholder="Attachment"
								onChange={onModelChange}
								value={model.attachment}
							/>
						</div>
					</div>
				</div>
				<div className="uk-margin uk-grid-small uk-child-width-1-2" uk-grid="">
					<div>
						<div>
							<label className="uk-label backgroundf">Extras</label>
							{
								extras.map(ele => (
									<div className="uk-margin-small" key={ele.id}>
										<input
											type="checkbox" className="uk-checkbox"
											name="extras" onChange={onCheckBoxChange}
											value={ele.id}
										/>
										<label>{ele.extraName}</label>
									</div>
								))
							}			
						</div>
					</div>
					<div>
						<div>
							<label className="uk-label backgroundf">Home Type</label>
							<select
								name="homeType" className="uk-width-1-1 uk-select"
								placeholder="Home Type"
								onChange={onHomeTypeChange} value={model.homeType.id}
							>
							{
								homeTypes.map(ele => (
									<option key={ele.id} value={ele.id}>{ele.typeName}</option>
								))
							}								
							</select>
						</div>
					</div>
				</div>
				<div className="uk-margin">
					<button className="uk-button backgroundf" type="submit">Submit</button>
				</div>
			</form>
		</div>
	);
}
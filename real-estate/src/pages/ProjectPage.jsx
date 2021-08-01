import { useEffect, useReducer } from 'react';
import { $fetch } from '../fetch.js';

const ALL = "ALL";
const MIN = "MIN";
const MAX = "MAX";

const STORE = {
	homeTypes: [],
	projects: {
		elements: [],
		view: null
	},
	filter: {
		homeType: ALL,
		price: [0, 10000000],
		floorSpace: [0, 10000000],
	}
};

const SET_HOMETYPES = "SET_HOMETYPES";
const SET_PROJECTS = "SET_PROJECTS";
const SET_PROJECTS_VIEW = "SET_PROJECTS_VIEW";
const MODIFY_FILTER = "MODIFY_FILTER";

const SORTS_NO_SORT = "NO_SORT";
const SORTS_LOWEST_PRICE = "LOWEST_PRICE";
const SORTS_HIGHEST_PRICE = "HIGHEST_PRICE";

export default function ProjectPage() {
	const [store, dispatchStore] = useReducer(
		(oldState, { type = null, payload = null} = {}) => {
			switch (type) {
				case SET_PROJECTS_VIEW: {
					if (payload != null && !Array.isArray(payload)) {
						return oldState;
					}

					return {
						...oldState,
						projects: {
							...oldState.projects,
							view: payload
						}
					};
				}
				case MODIFY_FILTER: {
					const { name, value } = payload;

					if (typeof name !== 'string') {
						return oldState;
					}

					return  {
						...oldState,
						filter: {
							...oldState.filter,
							[name]: value
						}
					};
				}
				case SET_HOMETYPES: {
					if (!Array.isArray(payload)) {
						return oldState;
					}

					return {
						...oldState,
						homeTypes: payload
					};
				}
				case SET_PROJECTS: {
					if (!Array.isArray(payload)) {
						return oldState;
					}

					const { projects } = oldState;

					return {
						...oldState,
						projects: {
							...projects,
							elements: payload
						}
					};
				}
				default: {
					return oldState;
				}
			}
		}, { ...STORE }
	);

	useEffect(
		() => {
			const fetchStore = async () => {
				const [getHomeTypesRes, getHomeTypesErr] = await $fetch('/api/home-types', {
					method: 'GET',
					headers: {
						'Accept': 'application/json'
					}
				});

				if (getHomeTypesErr) {
					console.error(getHomeTypesErr);
					return;
				}

				dispatchStore({
					type: SET_HOMETYPES,
					payload: await getHomeTypesRes.json()
				});

				const [getProjectsRes, getProjectsErr] = await $fetch('/api/projects', {
					method: 'GET',
					headers: {
						'Accept': 'application/json'
					}
				});

				if (getProjectsErr) {
					console.error(getProjectsErr);
				}

				dispatchStore({
					type: SET_PROJECTS,
					payload: await getProjectsRes.json()
				});
			};
			fetchStore();
		},
	[]);
	const sortProjects = (event) => {
		switch (event.target.value) {
			case SORTS_HIGHEST_PRICE: {
				const projectList = [
					...store.projects.elements
				].sort((left, right) => left.price < right.price ? 1 : -1);

				dispatchStore({
					type: SET_PROJECTS,
					payload: projectList
				});

				return;
			}
			case SORTS_LOWEST_PRICE: {
				const projectList = [
					...store.projects.elements
				].sort((left, right) => left.price > right.price ? 1 : -1);

				dispatchStore({
					type: SET_PROJECTS,
					payload: projectList
				});

				return;
			}
			default: return;
		}
	};
	const filter = async ({ homeType = homeTypeCriteria, priceStart = priceCriteria[0], priceEnd = priceCriteria[1], spaceStart = floorSpaceCriteria[0], spaceEnd = floorSpaceCriteria[1]}) => {
		const [filterRes, filterErr] = await $fetch(`/api/projects?${homeType !== ALL ? `homeTypeId.equals=${homeType}` : ""}&price.greaterThanOrEqual=${priceStart}&price.lessThanOrEqual=${priceEnd}&floorSpace.greaterThanOrEqual=${spaceStart}&floorSpace.lessThanOrEqual=${spaceEnd}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		});

		if (filterErr) {
			console.log(filterErr);
			return [];
		}

		return await filterRes.json();
	};
	const onPriceChange = async (limitType, event) => {
		const value = event.target.value === 0 ? 0 : parseInt(event.target.value);

		if (value < 0 || isNaN(value)) {
			return;
		}

		const newPrice = [ ...store.filter.price ];

		newPrice[limitType === MIN ? 0 : 1] = value;

		let list = await filter({
			priceStart: newPrice[0],
			priceEnd: newPrice[1],
		});

		dispatchStore({
			type: SET_PROJECTS_VIEW,
			payload: list
		});
		dispatchStore({
			type: MODIFY_FILTER,
			payload: {
				name: "price",
				value: newPrice
			}
		});
		return;
	};
	const onFloorSpaceChange = async (limitType, event) => {
		const value = event.target.value === 0 ? 0 : parseInt(event.target.value);

		if (value < 0 || isNaN(value)) {
			return;
		}

		const newSpace = [ ...store.filter.floorSpace ];

		newSpace[limitType === MIN ? 0 : 1] = value;

		let list = await filter({
			spaceStart: newSpace[0],
			spaceEnd: newSpace[1],
		});

		dispatchStore({
			type: SET_PROJECTS_VIEW,
			payload: list
		});
		dispatchStore({
			type: MODIFY_FILTER,
			payload: {
				name: "floorSpace",
				value: newSpace
			}
		});
		return;
	};
	const onHomeTypeChange = async (event) => {
		const typeId = event.target.value;

		if (typeId.length === 0 || typeId === store.filter.homeType) {
			console.log("skip");
			return;	
		}

		const list = await filter({homeType: typeId});

		dispatchStore({
			type: MODIFY_FILTER,
			payload: {
				name: "homeType",
				value: typeId
			}
		});
		dispatchStore({
			type: SET_PROJECTS_VIEW,
			payload: list
		});
	};
	const { filter: {
		homeType: homeTypeCriteria,
		price: priceCriteria,
		floorSpace: floorSpaceCriteria
	}} = store;
	const renderedElements = store.projects.view != null ? store.projects.view : store.projects.elements;

	return (
		<div
			className="uk-grid-collapse uk-grid-match"
			uk-grid=""
			uk-height-viewport="expand: true"
		>
			<div className="uk-width-1-4">
				<div className="uk-padding-small">
					<div className="uk-margin">
						<label className="uk-label backgroundf">Filter</label>
					</div>
					<div>
						<div className="uk-margin">
							<label>City</label>
							<select className="uk-select">
								<option>All</option>
							</select>
						</div>
						<div className="uk-margin">
							<label>Home type</label>
							<select
								className="uk-select"
								onChange={onHomeTypeChange}
							>
								<option value={ALL}>All Homes</option>
								{
									store.homeTypes.map(type => (
										<option
											key={type.id}
											value={type.id}
										>{type.typeName}</option>
									))
								}
							</select>
						</div>
						<div className="uk-margin">
							<label>Bedrooms</label>
							<select className="uk-select">
								<option>0+ BR</option>
							</select>
						</div>
						<div className="uk-margin">
							<label>Price</label>
							<div
								className="uk-grid-collapse uk-child-width-1-2"
								uk-grid=""
							>
								<div>
									<input
										className="uk-input"
										type="number"
										placeholder="0"
										onChange={(event) => onPriceChange(MIN, event)}
									/>
								</div>
								<div>
									<input
										className="uk-input"
										type="number"
										placeholder="10000000"
										onChange={(event) => onPriceChange(MAX, event)}
									/>
								</div>
							</div>
						</div>
						<div className="uk-margin">
							<label>Floor space</label>
							<div
								className="uk-grid-collapse uk-child-width-1-2"
								uk-grid=""
							>
								<div>
									<input
										className="uk-input"
										type="number"
										placeholder="0"
										onChange={(event) => onFloorSpaceChange(MIN, event)}
									/>
								</div>
								<div>
									<input
										className="uk-input"
										type="number"
										placeholder="10000000"
										onChange={(event) => onFloorSpaceChange(MAX, event)}
									/>
								</div>
							</div>
						</div>
						<div className="uk-margin">
							<div
								className="uk-grid-collapse"
								uk-grid=""
							>
								<div className="uk-width-expand">
									<label>Elevators</label>
								</div>
								<div className="uk-width-auto">
									<input type="radio" className="uk-radio"/>
								</div>
							</div>
						</div>
						<div className="uk-margin">
							<div
								className="uk-grid-collapse"
								uk-grid=""
							>
								<div className="uk-width-expand">
									<label>Swimming pool</label>
								</div>
								<div className="uk-width-auto">
									<input type="radio" className="uk-radio"/>
								</div>
							</div>
						</div>
						<div className="uk-margin">
							<div
								className="uk-grid-collapse"
								uk-grid=""
							>
								<div className="uk-width-expand">
									<label>Finished basement</label>
								</div>
								<div className="uk-width-auto">
									<input type="radio" className="uk-radio"/>
								</div>
							</div>
						</div>
						<div className="uk-margin">
							<div
								className="uk-grid-collapse"
								uk-grid=""
							>
								<div className="uk-width-expand">
									<label>Gym</label>
								</div>
								<div className="uk-width-auto">
									<input type="radio" className="uk-radio"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="uk-width-3-4 uk-padding">
				<div>
					<header className="uk-padding-small uk-margin">
						<div className="uk-grid-collapse" uk-grid="">
							<div className="uk-width-expand"></div>
							<div className="uk-width-auto">
								<select
									className="uk-select"
									onChange={sortProjects}
									value={SORTS_NO_SORT}
								>
									<option
										value={SORTS_NO_SORT}
									>No sort</option>
									<option
										value={SORTS_LOWEST_PRICE}
									>Lowest price</option>
									<option
										value={SORTS_HIGHEST_PRICE}
									>Highest price</option>
								</select>
							</div>
						</div>						
					</header>
					<section>
						<div
							className="uk-grid-small uk-grid-medium uk-child-width-1-4@s uk-flex-center uk-text-center uk-grid-match"
							uk-grid=""
						>
						{
							renderedElements.map(project => (
								<div key={project.id}>
									<div
										className="uk-card uk-box-shadow-large uk-card-default"
									>
										<div className="uk-card-body uk-padding-remove">
											<div className="uk-inline">
												<img
													className="uk-width-1-1 uk-height-1-1"
													src="images/joel-filipe-RFDP7_80v5A-unsplash.jpg"
													alt="joel-filipe-RFDP7_80v5A-unsplash.jpg"/>
												<div className="uk-overlay uk-light uk-position-bottom">
													<label className="uk-badge uk-text-medium">{project.attachment}</label>
												</div>
											</div>
										</div>
										<div className="uk-card-footer">
											<dl className="uk-description-list">
												<dt>{project.price}</dt>
												<dd>
													<span
														className="uk-margin-small-right"
														uk-icon="icon: location">
													</span>
													<span>{project.address}</span>
												</dd>
											</dl>
										</div>
									</div>
								</div>
							))
						}
						</div>
					</section>
				</div>
			</div>
		</div>			
	);
}
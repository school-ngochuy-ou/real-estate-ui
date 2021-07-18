import { useEffect, useReducer } from 'react';
import { $fetch } from '../fetch.js';

const STORE = {
	homeTypes: [],
	projects: []
};

const SET_HOMETYPES = "SET_HOMETYPES";
const SET_PROJECTS = "SET_PROJECTS";

const SORTS_NO_SORT = "NO_SORT";
const SORTS_LOWEST_PRICE = "LOWEST_PRICE";
const SORTS_HIGHEST_PRICE = "HIGHEST_PRICE";

export default function ProjectPage() {
	const [store, dispatchStore] = useReducer(
		(oldState, { type = null, payload = null} = {}) => {
			switch (type) {
				case SET_HOMETYPES: {
					if (!Array.isArray(payload)) {
						return oldState;
					}

					return {
						...oldState,
						homeTypes: payload
					}
				}
				case SET_PROJECTS: {
					if (!Array.isArray(payload)) {
						return oldState;
					}

					return {
						...oldState,
						projects: payload
					}
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
					...store.projects
				].sort((left, right) => left.price < right.price ? 1 : -1);

				dispatchStore({
					type: SET_PROJECTS,
					payload: projectList
				});

				return;
			}
			case SORTS_LOWEST_PRICE: {
				const projectList = [
					...store.projects
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
							<select className="uk-select">
								<option>All Homes</option>
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
									/>
								</div>
								<div>
									<input
										className="uk-input"
										type="number"
										placeholder="10000000"
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
									/>
								</div>
								<div>
									<input
										className="uk-input"
										type="number"
										placeholder="10000000"
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
							className="uk-grid-small uk-grid-medium uk-child-width-1-4@s uk-flex-center uk-text-center"
							uk-grid=""
						>
						{
							store.projects.map(project => (
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
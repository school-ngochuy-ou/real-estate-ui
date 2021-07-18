export default function ProjectPage() {
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
					<header>
						
					</header>
					<section>
						<div
							className="uk-grid-small uk-child-width-1-3@s uk-flex-center uk-text-center"
							uk-grid=""
						>
							<div>
								<div className="uk-card uk-box-shadow-large uk-card-large uk-card-default">
									<div className="uk-card-body uk-padding-remove">
										<div className="uk-inline">
											<img
												className="uk-width-1-1 uk-height-1-1"
												src="images/joel-filipe-RFDP7_80v5A-unsplash.jpg"
												alt="joel-filipe-RFDP7_80v5A-unsplash.jpg"/>
											<div className="uk-overlay uk-light uk-position-bottom">
												<label className="uk-badge uk-text-medium">3 Universal St.</label>
											</div>
										</div>
									</div>
									<div className="uk-card-footer">
										<dl className="uk-description-list">
											<dt>$12830</dt>
											<dd>
												<span
													className="uk-margin-small-right"
													uk-icon="icon: location">
												</span>
												<span>
													Miami, FL
												</span>
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>			
	);
}
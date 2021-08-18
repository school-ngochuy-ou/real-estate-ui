import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function BookmarkPage() {
	const { push } = useHistory();
	const [bookmark, setBookmark] = useState(JSON.parse(localStorage.bookmark == null ? "[]" : localStorage.bookmark));
	const unpin = (id) => {
		const newMarks = bookmark.filter(mark => mark.id !== id);
		setBookmark(newMarks);
		localStorage.bookmark = JSON.stringify(newMarks);
	};

	return (
		<div className="uk-container">
			<div className="uk-margin-top">
				<h1 className="uk-heading-line">
					<span>Saved Projects</span>
				</h1>
				{
					bookmark == null || bookmark.length === 0 ? (
						<p className="uk-text-lead">You haven't saved any Projects</p>
					) : (
						<table className="uk-table uk-table-hover">
							<thead></thead>
							<tbody>
							{
								bookmark.map(project => (
									<tr
										key={project.id}
									>
										<td className="uk-table-shrink">
											<div style={{width: "60px", height: "60px"}}>
												<img
													className="uk-width-1-1 uk-height-1-1 uk-border-circle"
													src="images/joel-filipe-RFDP7_80v5A-unsplash.jpg"
													alt="joel-filipe-RFDP7_80v5A-unsplash.jpg"
												/>
											</div>
										</td>
										<td className="uk-table-expand">
											<div className="uk-text-lead colors">
												{project.address}	
											</div>
										</td>
										<td className="uk-table-expand">
											<div className="colors uk-text-right uk-text-large">
												{project.owner}
											</div>
										</td>
										<td className="uk-table-expand">
											<div className="colors uk-text-right uk-text-large">
												{project.price}
											</div>
										</td>
										<td className="uk-table-expand">
											<button
												className="uk-button backgroundf uk-margin-right"
												onClick={() => push(`/p/${project.id}`)}
											>Checkout</button>
											<button
												className="uk-button uk-button-muted"
												onClick={() => unpin(project.id)}
											>Unpin</button>
										</td>
									</tr>
								))
							}
							</tbody>
						</table>
					)
				}
			</div>
		</div>
	);
}
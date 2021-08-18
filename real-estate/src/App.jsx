import './App.css';
import { Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import CreateProjectPage from './pages/CreateProjectPage.jsx';
import CreateUserPage from './pages/CreateUserPage.jsx';
import ViewProjectPage from './pages/ViewProjectPage.jsx';
import UserListPage from './pages/UserListPage.jsx';
import EditUserPage from './pages/EditUserPage.jsx';
import EditProjectPage from './pages/EditProjectPage.jsx';
import BookmarkPage from './pages/BookmarkPage.jsx';

function App() {
	return (
		<div className="App">
			<Navbar />
			<Switch>
				<Route path="/bookmark" render={
					props => <BookmarkPage {...props} />
				}/>
				<Route path="/user/create" render={
					props => <CreateUserPage {...props} />
				}/>
				<Route path="/project/edit/:id" render={
					props => <EditProjectPage {...props} />
				}/>
				<Route path="/project" render={
					props => <CreateProjectPage {...props} />
				}/>
				<Route path="/p/:id" render={
					props => <ViewProjectPage {...props} />
				}/>
				<Route path="/user/list" render={
					props => <UserListPage {...props} />
				}/>
				<Route path="/user/edit/:id" render={
					props => <EditUserPage {...props} />
				}/>
				<Route path="/" render={
					props => <ProjectPage {...props} exact />
				}/>
			</Switch>
		</div>
	);
}

export default App;
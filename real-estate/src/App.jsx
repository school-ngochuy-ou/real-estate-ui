import './App.css';
import { Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProjectPage from './pages/ProjectPage.jsx';

function App() {
	return (
		<div className="App">
			<Navbar />
			<Route path="/projects" render={
				(props) => <ProjectPage {...props} />
			}/>
		</div>
	);
}

export default App;
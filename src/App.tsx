import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tracker from "./pages/Tracker";
import Journal from "./pages/Journal";
import Forum from "./pages/Forum";
import Education from "./pages/Education";

function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-neutral-50 text-neutral-900">
				<main className="pb-20">
					<Routes>
						<Route path="/" element={<Tracker />} />
						<Route path="/journal" element={<Journal />} />
						<Route path="/forum" element={<Forum />} />
						<Route path="/education" element={<Education />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
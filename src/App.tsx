import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Tracker from "./pages/Tracker";
import Journal from "./pages/Journal";
import Forum from "./pages/Forum";
import Education from "./pages/Education";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Tracker />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/education" element={<Education />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
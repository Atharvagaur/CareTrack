import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Issues from './pages/Issues.jsx';
import KanbanBoard from './pages/KanbanBoard.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

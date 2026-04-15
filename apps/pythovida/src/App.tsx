import { Routes, Route } from 'react-router';

import Nav from './components/Nav'
import Dashboard from './components/Dashboard'


function App() {
  return (
      <>
      <Nav />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;

import { Routes, Route } from 'react-router';

function App() {
  return (
      <>
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;

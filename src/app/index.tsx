import { PreloaderProvider } from './providers/Preloader/PreloaderProvider';
import { SelectRole } from '../features/select-role/Select-role';
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });
  if (loading) return <PreloaderProvider />;


  return (
    <div className="flex justify-center">
      <SelectRole />
    </div>
  );
}

export default App;

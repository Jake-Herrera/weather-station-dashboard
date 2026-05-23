import { useReadings } from '@/hooks/useReadings';

function App() {
  const {
    readings,
    loading,
    error,
  } = useReadings('esp32-01');

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <pre>
      {JSON.stringify(readings, null, 2)}
    </pre>
  );
}

export default App;

import { useInitializeSession } from './hooks/useInitializeSession';

function App() {
  useInitializeSession();

  return (
    <div>
      <h1>Financial Monitoring Platform</h1>
      <p>Frontend and anonymous session setup are working.</p>
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import './App.css';

function App(): JSX.Element {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api')
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 40000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return <div className="text-red-600 text-3xl">Here is the menu</div>;
};

export default App;
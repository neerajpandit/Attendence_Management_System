import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import router from './routes';
import Loader from './components/Loader';
import { Toaster } from 'react-hot-toast';
import './fontawesome';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router()} />
      <Toaster />
    </Suspense>
  );
}

export default App;

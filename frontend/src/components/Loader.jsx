import { Triangle } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center justify-center space-x-2">
        <Triangle height={80} width={80} color="white" ariaLabel="loading" />
      </div>
    </div>
  );
};

export default Loader;

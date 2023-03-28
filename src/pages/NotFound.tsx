import { HomeIcon } from '@heroicons/react/24/outline';

function NotFound() {
  function openHome() {
    window.location.href = '/';
  }

  return (
    <div className="text-gray-700 bg-gray-100 h-screen flex flex-col justify-center items-center space-y-6">
      <div className="text-5xl font-semibold">404</div>
      <div className="text-3xl font-medium">Page Not Found</div>
      <div className="flex flex-row items-center space-x-2 group group-hover:cursor-pointer">
        <HomeIcon
          onClick={openHome}
          className="h-8 w-8 text-indigo-500 transform group-hover:text-indigo-600 group-hover:cursor-pointer transition-all duration-200"
        />
        <div className="text-xl underline">
          <a
            href="/"
            className="text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200"
          >
            Go back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

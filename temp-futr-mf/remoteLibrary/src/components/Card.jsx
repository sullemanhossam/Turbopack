import TailwindWrapper from "../../tailwind.wrapper";

export function Card() {
  return (
    <div className="bg-green-500 text-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Onboarding Complete</h2>
        <div className="bg-white text-green-500 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <span className="inline-block px-2 py-1 bg-green-500 border border-green-200 rounded-full text-xs font-medium text-green-200 mb-4">
          New User
        </span>
        <p className="text-sm text-green-200">Congratulations on completing the onboarding process! You're all set to start using our app.</p>
      </div>
      <div className="flex justify-end gap-2 p-4">
        <button className="px-4 py-2 bg-white text-green-500 hover:bg-green-600 hover:text-white rounded-md transition-colors">View Dashboard</button>
        <button className="px-4 py-2 bg-white text-green-500 hover:bg-green-600 hover:text-white rounded-md transition-colors">
          Explore Features
        </button>
      </div>
    </div>
  );
}

export default () => {
  return (
    <TailwindWrapper>
      <Card />
    </TailwindWrapper>
  );
};

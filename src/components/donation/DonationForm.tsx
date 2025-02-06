import { DonationFormProps } from "./types";

export const DonationForm = ({ content }: DonationFormProps) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title || "Make a Donation"}</h2>
        <p className="text-center text-gray-600 mb-8">{content.description}</p>
        <form>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Donation Amount</label>
            <input
              type="number"
              id="amount"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <button className="w-full bg-primary text-white py-3 px-6 rounded-lg">
            {content.buttonText || "Donate Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

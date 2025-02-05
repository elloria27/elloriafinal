import { DonationFormProps } from "@/types/content-blocks";

export const DonationForm = ({ content }: DonationFormProps) => {
  return (
    <div className="donation-form">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="mb-4">{content.description}</p>
      <form>
        <div className="mb-4">
          <label htmlFor="donation-amount" className="block text-sm font-medium text-gray-700">
            Donation Amount
          </label>
          <input
            type="number"
            id="donation-amount"
            name="amount"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter amount"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="donor-name" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="donor-name"
            name="name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="donor-email" className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            id="donor-email"
            name="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter your email"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
        >
          Donate
        </button>
      </form>
    </div>
  );
};

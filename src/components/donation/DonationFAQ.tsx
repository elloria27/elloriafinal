import { DonationFAQProps } from "./types";

export const DonationFAQ = ({ content }: DonationFAQProps) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title || "Frequently Asked Questions"}</h2>
        <p className="text-center text-gray-600 mb-12">{content.description}</p>
        <div className="space-y-6">
          {content.faqs?.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
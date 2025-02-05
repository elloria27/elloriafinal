import { DonationFAQProps } from "@/types/content-blocks";

export const DonationFAQ = ({ content }: DonationFAQProps) => {
  return (
    <div className="donation-faq">
      <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
      <ul className="space-y-4">
        {content.faqs.map((faq, index) => (
          <li key={index} className="border-b pb-4">
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

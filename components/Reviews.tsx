"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const reviews = [
  {
    text: "Exchange fees are reasonable, support responses are super fast. I consider Bytexp2p the best place for your escrow crypto exchange.",
    author: "Ander Hilson - Twitter",
  },
  {
    text: "You can swap as many crypto as possible. Its awesome to use Bytexp2p for your escrow swaps. The support is also very active and handling issues.",
    author: "Garry David - Discord",
  },
  {
    text: "Been using Bytexp2p for some time now. Had a little issue once but the support responded and rectified it immediately. I'll recommend Bytexp2p to anyone, anytime. The escrow process is simple and very efficient.",
    author: "Smith Jordan - Twitter",
  },
];

const faqs = [
  {
    question: "What is Crypto escrow service?",
    answer:
      "An escrow service is a mediator service that keeps the money for a transaction in safekeeping until the Bitcoins / other crypto assets are handed over. Escrow protects buyers from fraudulent sellers by requiring the Bitcoin to be deposited up front, before any money changes hands.",
  },
  {
    question: "What is cryptocurrency?",
    answer:
      "Fundamentally, cryptocurrencies are digital money. The blockchain is a database, or digital ledger, for recording transactions of said digital money. This digital money isn't backed by any government or institution. Popular crypto cryptocurrencies include; Bitcoin, Ether, Doge and thousands more.",
  },
  {
    question: "How do I fund my exchange account?",
    answer:
      "Log into your account, In the dashboard interface click on <b>Deposit</b> and select the cryptocurrency. Follow the easy instructions to complete the payment into your exchange account to start a trade.",
  },
  {
    question: "How can I withdraw my funds?",
    answer:
      "After a successful trade, the exchanged assets are moved to your spot wallet. You can easily withdraw to your desired digital wallet by proceeding to request for withdrawal. withdrawals are processed instantly.",
  },
];

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-dark-bg3 rounded-xl p-4 mb-4 border border-gray-700">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold">{question}</h3>
        <ChevronDown
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="mt-2">
          <p
            className="text-gray-400 text-sm"
            dangerouslySetInnerHTML={{ __html: answer }}
          ></p>
        </div>
      )}
    </div>
  );
};

const Reviews = () => {
  return (
    <section className="bg-dark-bg5 py-5">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Reviews</h2>

        {/* Mobile Reviews */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto space-x-4 p-4">
            {reviews.map((review, index) => (
              <div key={index} className="flex-shrink-0 w-full sm:w-2/3">
                <div className="bg-dark-bg3 rounded-xl p-6 border border-gray-700">
                  <div className="flex">
                    <img
                      src="https://Peershieldex.com/assets/images/comment.png"
                      alt=""
                      className="w-12 h-12"
                    />
                    <div className="ml-4">
                      <p className="text-sm text-gray-400">{review.text}</p>
                      <small className="mt-2 text-sm block text-gray-500">
                        <span className="text-green-500 mr-2">•</span>
                        {review.author}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Reviews */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-dark-bg3 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex">
                <img
                  src="https://peershieldex.com/assets/images/comment.png"
                  alt=""
                  className="w-12 h-12"
                />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">{review.text}</p>
                  <small className="mt-2 text-sm block text-gray-500">
                    <span className="text-green-500 mr-2">•</span>
                    {review.author}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            FAQs on Exchange
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

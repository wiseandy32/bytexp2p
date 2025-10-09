import { CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';

const practices = [
  {
    icon: <Zap className="text-blue-500" />,
    title: 'Lightning Quick',
    description: 'To make sure you take full advantage of the cryptocurrency market, we offer a respectable transaction speed.',
    aosDuration: '400',
  },
  {
    icon: <TrendingUp className="text-blue-500" />,
    title: 'Instant Withdrawals',
    description: 'To make sure you take full advantage of the cryptocurrency market, we offer a respectable transaction speed.',
    aosDuration: '600',
  },
  {
    icon: <CheckCircle className="text-blue-500" />,
    title: 'Low Exchange Fees',
    description: 'We offer very low exchange fees. Completely flexible rates to allow smooth transaction between trade parties.',
    aosDuration: '400',
  },
  {
    icon: <Shield className="text-blue-500" />,
    title: 'Secure & Private',
    description: 'To prevent disagreements between traders, we handle trades using automated procedures and multi-signature transaction processes.',
    aosDuration: '600',
  },
];

const BestPractices = () => {
  return (
    <div className="w-full py-20 anuphan relative overflow-hidden">
      <img src="https://peershieldex.com/assets/images/the-line.png" alt="" className="absolute top-0 left-0 w-full h-full opacity-20 hidden md:block" />
      <img src="https://peershieldex.com/assets/images/the-line.png" alt="" className="absolute top-0 left-0 w-[200%] h-full opacity-20 block md:hidden" />

      <div className="container mx-auto py-4 px-4 sm:px-0">
        <div className="text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="600">
          <h1 className="anuphan-2 text-4xl font-bold">A New World of Crypto Exchange</h1>
          <h5 className="text-gray-400 anuphan mt-2">
            Best Practices to enhance your experience
          </h5>
        </div>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:px-5 aos-init aos-animate">
          {practices.map((practice, index) => (
            <div
              key={index}
              className="aos-init aos-animate"
              data-aos="fade-up"
              data-aos-duration={practice.aosDuration}
            >
              <div className="flex items-center p-4 rounded-lg">
                {practice.icon}
                <div className="ml-4">
                  <p className="anuphan-2 m-0 font-bold">{practice.title}</p>
                  <p className="text-sm text-gray-400 m-0">
                    {practice.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestPractices;

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$29',
      features: ['Single location', 'Up to 1,000 products', 'Basic reporting', 'Email support'],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$79',
      features: ['Up to 3 locations', 'Unlimited products', 'Advanced reporting', 'Priority support', 'Inventory management'],
      cta: 'Try Pro',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited locations', 'Customizable features', 'Dedicated account manager', '24/7 phone support', 'API access'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Pricing Plans</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect plan for your business needs
          </p>
        </div>

        <div className="mt-24 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col ${plan.highlighted ? 'ring-2 ring-indigo-600' : ''}`}>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                {plan.highlighted && (
                  <p className="absolute top-0 py-1.5 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-full transform -translate-y-1/2">
                    Most Popular
                  </p>
                )}
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">{plan.name} plan for growing businesses</p>

                <ul role="list" className="mt-6 space-y-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <CheckCircle className="flex-shrink-0 w-6 h-6 text-indigo-500" aria-hidden="true" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="#"
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;


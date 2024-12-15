import Link from 'next/link';
import { Book, Code, Database, Settings } from 'lucide-react';

const DocumentationPage = () => {
  const sections = [
    { title: 'Getting Started', icon: Book, description: 'Learn how to set up and configure your POS system' },
    { title: 'API Reference', icon: Code, description: 'Detailed documentation for integrating with our API' },
    { title: 'Data Management', icon: Database, description: 'Best practices for managing your inventory and customer data' },
    { title: 'System Configuration', icon: Settings, description: 'Advanced settings and customization options' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Documentation</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Everything you need to know about using our POS system
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {sections.map((section) => (
            <Link key={section.title} href={`/documentation/${section.title.toLowerCase().replace(' ', '-')}`}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <section.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
                      <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <dl className="space-y-8">
            {[
              { question: "How do I update my inventory?", answer: "You can update your inventory by navigating to the 'Inventory' section in your dashboard and clicking on 'Update Stock'." },
              { question: "Can I integrate with my existing systems?", answer: "Yes, our POS system offers various integration options. Check our API documentation for more details." },
              { question: "How often is the documentation updated?", answer: "We update our documentation regularly to reflect the latest features and improvements. Check the 'Last Updated' date at the bottom of each page." },
            ].map((faq) => (
              <div key={faq.question}>
                <dt className="text-lg font-medium text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;


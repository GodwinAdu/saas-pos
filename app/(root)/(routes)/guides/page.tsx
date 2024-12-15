import Link from 'next/link';
import { ArrowRight, BookOpen, Video, FileText } from 'lucide-react';

const GuidesPage = () => {
  const guides = [
    { title: 'Getting Started with Your POS', type: 'Article', icon: BookOpen, time: '5 min read' },
    { title: 'Setting Up Your First Store', type: 'Video', icon: Video, time: '10 min watch' },
    { title: 'Managing Inventory Efficiently', type: 'Article', icon: FileText, time: '8 min read' },
    { title: 'Processing Transactions', type: 'Video', icon: Video, time: '15 min watch' },
    { title: 'Generating Sales Reports', type: 'Article', icon: FileText, time: '7 min read' },
    { title: 'Customer Management Best Practices', type: 'Article', icon: BookOpen, time: '6 min read' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Guides & Tutorials</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Learn how to make the most of your POS system with our comprehensive guides
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.title} href={`/guides/${guide.title.toLowerCase().replace(/ /g, '-')}`}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <guide.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    <span className="ml-2 text-sm font-medium text-gray-500">{guide.type}</span>
                    <span className="ml-auto text-sm text-gray-400">{guide.time}</span>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">{guide.title}</h2>
                  <div className="flex items-center text-indigo-600">
                    <span className="text-sm font-medium">Read more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to help. Reach out to us for personalized assistance.</p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;


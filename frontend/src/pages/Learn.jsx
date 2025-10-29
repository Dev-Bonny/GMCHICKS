export default function Learn() {
  const articles = [
    {
      title: 'Getting Started with Poultry Farming',
      content: 'Poultry farming is a rewarding venture. Start by choosing the right breed for your goals - layers for eggs or broilers for meat. Ensure proper housing with adequate ventilation and space.',
      icon: '🐣'
    },
    {
      title: 'Feeding Programs for Maximum Growth',
      content: 'Nutrition is crucial. Chicks need starter feed (0-8 weeks) with 20-22% protein, grower feed (8-18 weeks) with 16-18% protein, and layer feed for mature hens with calcium for strong eggshells.',
      icon: '🌾'
    },
    {
      title: 'Disease Prevention & Biosecurity',
      content: 'Prevention is better than cure. Maintain clean housing, provide fresh water, follow vaccination schedules, quarantine new birds, and limit visitor access to your farm.',
      icon: '🏥'
    },
    {
      title: 'Housing Requirements',
      content: 'Provide 2-4 square feet per bird. Ensure good ventilation without drafts. Use deep litter system or raised wire floors. Include nesting boxes for layers (1 box per 4-5 hens).',
      icon: '🏠'
    },
    {
      title: 'Water Management',
      content: 'Clean water is essential. Chickens drink 2-3 times more than they eat. Change water daily, clean waterers regularly, and ensure adequate access points.',
      icon: '💧'
    },
    {
      title: 'Record Keeping',
      content: 'Maintain records of feed consumption, mortality rates, egg production, vaccination dates, and expenses. Good records help identify problems early and improve profitability.',
      icon: '📊'
    }
  ];

  const faqs = [
    {
      q: 'How many chickens should I start with?',
      a: 'Beginners should start with 50-100 birds to learn the basics before scaling up.'
    },
    {
      q: 'What is the profit margin in poultry?',
      a: 'With good management, layers can give 20-30% profit margin, broilers 15-25%.'
    },
    {
      q: 'How long until layers start producing eggs?',
      a: 'Most layer breeds start laying at 18-22 weeks of age.'
    },
    {
      q: 'What is the best breed for beginners?',
      a: 'Kenbro and Kienyeji chickens are hardy and good for beginners in Kenya.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Learning Center</h1>
      <p className="text-gray-600 mb-12">
        Everything you need to know about successful poultry farming
      </p>

      {/* Articles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {articles.map((article, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">{article.icon}</div>
            <h3 className="text-xl font-semibold mb-3">{article.title}</h3>
            <p className="text-gray-600">{article.content}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b pb-4 last:border-b-0">
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-primary-500 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Expert Advice?</h2>
        <p className="mb-6">Schedule a farm visit and consult with our poultry experts</p>
        <a href="/farm-visit" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
          Schedule Consultation
        </a>
      </div>
    </div>
  );
}

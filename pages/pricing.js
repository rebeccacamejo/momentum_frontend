import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual coaches getting started",
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        "Up to 10 deliverables per month",
        "AI-powered content processing",
        "Basic brand customization",
        "PDF & Word exports",
        "Email support",
        "14-day free trial"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      description: "For growing coaching businesses",
      monthlyPrice: 79,
      annualPrice: 65,
      features: [
        "Up to 50 deliverables per month",
        "Advanced AI processing",
        "Full brand customization",
        "All export formats",
        "Priority support",
        "Analytics dashboard",
        "Team collaboration",
        "Custom templates"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      description: "For large consulting firms",
      monthlyPrice: 199,
      annualPrice: 165,
      features: [
        "Unlimited deliverables",
        "Custom AI training",
        "White-label solution",
        "API access",
        "Dedicated support",
        "Advanced analytics",
        "SSO integration",
        "Custom integrations"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing – Momentum | Professional Plans for Coaches & Consultants</title>
        <meta name="description" content="Choose the perfect plan for your coaching or consulting business. Start with a 14-day free trial." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />

      <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
        <div className="container-max">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your business. All plans include a 14-day free trial with no credit card required.
            </p>

            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg font-medium ${!isAnnual ? 'text-primary-600' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isAnnual ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg font-medium ${isAnnual ? 'text-primary-600' : 'text-gray-500'}`}>
                Annual
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`card p-8 relative ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                } hover:scale-105 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-primary-600">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                    {isAnnual && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed annually (${plan.annualPrice * 12})
                      </div>
                    )}
                  </div>

                  <Link
                    href={plan.cta === "Contact Sales" ? "/contact" : "/new"}
                    className={`btn-primary w-full inline-block text-center ${
                      plan.popular ? 'shadow-glow' : ''
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-12 gradient-text">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-3">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-3">What happens after the free trial?</h3>
                <p className="text-gray-600">After 14 days, you'll be charged for your selected plan. Cancel anytime before the trial ends.</p>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee on all annual plans.</p>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-3">Is my data secure?</h3>
                <p className="text-gray-600">Absolutely. We use enterprise-grade encryption and comply with GDPR and SOC 2 standards.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <div className="card p-12 bg-gradient-hero text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of coaches and consultants saving hours every week.
              </p>
              <Link href="/new" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
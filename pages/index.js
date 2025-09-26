import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Head>
        <title>Momentum – Transform Sessions into Professional Deliverables | AI-Powered Content</title>
        <meta name="description" content="Transform raw meeting notes and recordings into beautifully branded client deliverables in seconds. AI-powered processing for coaches and consultants." />
        <meta name="keywords" content="coaching, consulting, deliverables, AI processing, meeting notes, client reports" />
        <meta property="og:title" content="Momentum – Transform Sessions into Professional Deliverables" />
        <meta property="og:description" content="AI-powered platform that helps coaches and consultants create professional client deliverables instantly." />
        <meta property="og:image" content="/images/hero-placeholder.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float animation-delay-400"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float animation-delay-800"></div>
        </div>

        <div className="container-max relative z-10">
          <div className="text-center text-white">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Transform Sessions into
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Professional Deliverables
                </span>
              </h1>
            </div>

            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
                AI-powered platform that helps coaches and consultants turn raw meeting notes and recordings
                into beautifully branded client reports in seconds, not hours.
              </p>
            </div>

            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/new" className="btn-primary shadow-glow-lg">
                  Start Free Trial
                  <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="#how-it-works" className="btn-secondary bg-white/20 border-white/30 text-white hover:bg-white hover:text-primary-600">
                  See How It Works
                </Link>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-center space-x-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`mt-16 transition-all duration-1000 delay-800 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
            <div className="relative max-w-4xl mx-auto">
              <img
                src="/images/hero-placeholder.svg"
                alt="Momentum platform demonstration"
                className="w-full h-auto rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Powerful Features for Modern Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create professional deliverables that impress your clients and grow your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-feature rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Processing</h3>
              <p className="text-gray-600">
                Advanced AI analyzes your meeting notes and recordings to extract key insights and structure professional reports automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center group hover:scale-105 animation-delay-200">
              <div className="w-16 h-16 bg-gradient-feature rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 5l2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Brand Consistency</h3>
              <p className="text-gray-600">
                Automatically apply your brand colors, fonts, and styling to ensure every deliverable matches your professional identity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center group hover:scale-105 animation-delay-400">
              <div className="w-16 h-16 bg-gradient-feature rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate professional reports in seconds, not hours. Spend more time coaching and less time on administrative tasks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-8 text-center group hover:scale-105 animation-delay-600">
              <div className="w-16 h-16 bg-gradient-feature rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Assurance</h3>
              <p className="text-gray-600">
                Built-in quality checks ensure your deliverables are polished, professional, and ready to impress your clients.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-8 text-center group hover:scale-105 animation-delay-800">
              <div className="w-16 h-16 bg-gradient-feature rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Client-Friendly</h3>
              <p className="text-gray-600">
                Export in multiple formats (PDF, Word, HTML) that clients love, with responsive design for any device.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-8 text-center group hover:scale-105 animation-delay-1000">
              <div className="w-16 h-16 bg-gradient-feature rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
              <p className="text-gray-600">
                Enterprise-grade security ensures your client data stays private and confidential with end-to-end encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your meeting notes into professional deliverables.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:shadow-glow-lg transition-all duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-400 rounded-full animate-bounce-gentle"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Upload Your Content</h3>
              <p className="text-gray-600 text-lg">
                Upload your meeting notes, recordings, or any session content. We support multiple formats including audio, video, and text files.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group animation-delay-400">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:shadow-glow-lg transition-all duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-400 rounded-full animate-bounce-gentle animation-delay-200"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI Processing</h3>
              <p className="text-gray-600 text-lg">
                Our advanced AI analyzes your content, extracts key insights, and structures them into a professional format with your branding.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group animation-delay-800">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:shadow-glow-lg transition-all duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-400 rounded-full animate-bounce-gentle animation-delay-400"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Download & Share</h3>
              <p className="text-gray-600 text-lg">
                Download your polished deliverable in your preferred format and share it with clients. Professional results in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-hero">
        <div className="container-max text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Join thousands of coaches and consultants who save hours every week with professional deliverables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/new" className="bg-white text-primary-600 border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-out shadow-glow-lg inline-flex items-center">
              Start Your Free Trial
              <svg className="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/signin" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-max">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold">Momentum</span>
            </div>
            <p className="text-gray-400 mb-6">
              Transform your sessions into professional deliverables with AI-powered processing.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-gray-500 text-sm">
              © 2024 Momentum. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
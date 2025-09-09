import Link from 'next/link'
import { ArrowRight, Code, Sparkles, Zap, CheckCircle, Users, Shield, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
                      <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CompForge
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Component Generation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Generate React Components
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                with AI Magic
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Describe your component in natural language and watch AI generate 
              production-ready React components with TypeScript and Tailwind CSS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register" 
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Building Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">AI-Powered</div>
              <div className="text-gray-600">Component Generation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
              <div className="text-gray-600">Live Preview</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">TypeScript</div>
              <div className="text-gray-600">Ready Code</div>
            </div>
          </div>
        </div>
      </main>

      {/* Removed other sections; they now have dedicated pages */}

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose CompForge?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most advanced AI-powered component generator for modern web development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI models understand your requirements and generate 
                components that match your design intent perfectly.
              </p>
            </div>

            <div className="group p-8 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Production Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Get TypeScript components with proper types, Tailwind CSS styling, 
                and best practices built-in from the start.
              </p>
            </div>

            <div className="group p-8 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time preview, instant code generation, and seamless 
                export functionality for maximum productivity.
              </p>
            </div>

                         <div className="group p-8 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300">
               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Users className="h-6 w-6 text-white" />
               </div>
               <h3 className="text-xl font-semibold mb-4">Session Management</h3>
               <p className="text-gray-600 leading-relaxed">
                 Save and manage your component generation sessions, 
                 track your progress, and organize your work efficiently.
               </p>
             </div>

                         <div className="group p-8 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300">
               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Shield className="h-6 w-6 text-white" />
               </div>
               <h3 className="text-xl font-semibold mb-4">Secure Authentication</h3>
               <p className="text-gray-600 leading-relaxed">
                 Google OAuth integration with secure JWT tokens, 
                 protecting your data and ensuring safe access.
               </p>
             </div>

                         <div className="group p-8 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300">
               <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Clock className="h-6 w-6 text-white" />
               </div>
               <h3 className="text-xl font-semibold mb-4">Export & Download</h3>
               <p className="text-gray-600 leading-relaxed">
                 Export your generated components as ZIP files or copy code 
                 directly into your projects with one click.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get from idea to component in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Describe Your Component</h3>
              <p className="text-gray-600">
                Tell our AI what you want to build in natural language. 
                Be as detailed or simple as you like.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Generates Code</h3>
              <p className="text-gray-600">
                Our advanced AI creates production-ready React components 
                with TypeScript and Tailwind CSS.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Export & Use</h3>
              <p className="text-gray-600">
                Download your component or copy the code directly 
                into your project. Ready to use immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Development?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building faster with AI-powered component generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Building Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold">CompForge</span>
              </div>
              <p className="text-gray-600 mb-4">
                The future of component generation powered by AI.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-gray-900">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/help" className="hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
                <li><Link href="/status" className="hover:text-gray-900">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 CompForge. Built for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
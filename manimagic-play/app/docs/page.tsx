import Navbar from "../components/Navbar";
import Link from "next/link";
import { FaArrowLeft, FaBook, FaCode, FaPlay } from "react-icons/fa";

export default function DocsPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FaBook className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
              <p className="text-xl text-gray-600">
                Complete guide to using ManiMagic for creating beautiful animations
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Start</h3>
                <p className="text-gray-600 mb-4">
                  Get up and running with ManiMagic in just a few minutes
                </p>
                <Link 
                  href="/playground"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  <FaPlay className="w-4 h-4" />
                  Try Playground
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">API Reference</h3>
                <p className="text-gray-600 mb-4">
                  Detailed documentation of all available functions and classes
                </p>
                <a 
                  href="https://docs.manim.community/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  <FaCode className="w-4 h-4" />
                  Manim Docs
                </a>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h3>
              <p className="text-blue-700">
                We're working on comprehensive documentation including tutorials, examples, and best practices. 
                In the meantime, check out the <a href="https://docs.manim.community/" target="_blank" rel="noopener noreferrer" className="font-semibold underline">official Manim documentation</a> for learning the basics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

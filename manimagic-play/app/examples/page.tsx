import Navbar from "../components/Navbar";
import Link from "next/link";
import { FaArrowLeft, FaPlay, FaCode, FaImage, FaCalculator } from "react-icons/fa";

export default function ExamplesPage() {
  const examples = [
    {
      title: "Basic Shapes",
      description: "Learn the fundamentals with circles, squares, and triangles",
      icon: FaCode,
      difficulty: "Beginner",
      color: "green" as const
    },
    {
      title: "Mathematical Expressions",
      description: "Beautiful LaTeX equations and mathematical notation",
      icon: FaCalculator,
      difficulty: "Intermediate", 
      color: "blue" as const
    },
    {
      title: "SVG Animations",
      description: "Transform SVG graphics into stunning animations",
      icon: FaImage,
      difficulty: "Intermediate",
      color: "purple" as const
    },
    {
      title: "Plugin Showcase",
      description: "Advanced animations using manim plugins",
      icon: FaPlay,
      difficulty: "Advanced",
      color: "red" as const
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Examples Gallery</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore a collection of animation examples to inspire your creativity and learn new techniques
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
            {examples.map((example, index) => {
              const IconComponent = example.icon;
              const colorClasses = {
                green: "bg-green-100 text-green-600 border-green-200",
                blue: "bg-blue-100 text-blue-600 border-blue-200", 
                purple: "bg-purple-100 text-purple-600 border-purple-200",
                red: "bg-red-100 text-red-600 border-red-200"
              };
              
              return (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${colorClasses[example.color]}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {example.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {example.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          example.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          example.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {example.difficulty}
                        </span>
                        <Link
                          href="/playground"
                          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                        >
                          <FaPlay className="w-4 h-4" />
                          Try it
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              All examples are available in the playground with pre-written code. 
              Customize them or use them as inspiration for your own animations.
            </p>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <FaPlay className="w-5 h-5" />
              Open Playground
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

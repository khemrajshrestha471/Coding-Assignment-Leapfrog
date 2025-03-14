import React from "react";
import {
  Cloud,
  Lock,
  Zap,
  Users,
  Calendar,
  FileText,
  Tag,
  Code,
  Book,
  Briefcase,
} from "lucide-react";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <section className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Powerful Features of <span className="text-blue-600">NoteX</span>
        </h1>
        <p className="text-xl text-gray-600">
          Explore the tools and features that make NoteX the ultimate
          note-taking app for productivity and collaboration.
        </p>
      </section>

      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <Cloud className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cloud Sync
            </h3>
            <p className="text-gray-600">
              Access your notes from anywhere, on any device. Your data is
              always in sync.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <Lock className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your notes are encrypted and protected. Only you have access to
              your data.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <Users className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Collaboration
            </h3>
            <p className="text-gray-600">
              Share notes and collaborate in real-time with your team or
              friends.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <Calendar className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Reminders
            </h3>
            <p className="text-gray-600">
              Set reminders for important tasks and never miss a deadline again.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <FileText className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Templates
            </h3>
            <p className="text-gray-600">
              Use pre-built templates for notes, to-do lists, and more to save
              time.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <Zap className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Offline Access
            </h3>
            <p className="text-gray-600">
              Take notes even without an internet connection. Sync when you're
              back online.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <FileText className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Version History
              </h3>
              <p className="text-gray-600">
                Track changes and restore previous versions of your notes.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <Tag className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Custom Tags
              </h3>
              <p className="text-gray-600">
                Organize your notes with custom tags for easy searching and
                filtering.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <Code className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                API Access
              </h3>
              <p className="text-gray-600">
                Integrate NoteX with your favorite tools using our
                developer-friendly API.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <Book className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                For Students
              </h3>
              <p className="text-gray-600">
                Take lecture notes, organize study materials, and ace your exams
                with NoteX.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white mb-10">
              <Briefcase className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                For Professionals
              </h3>
              <p className="text-gray-600">
                Manage tasks, track projects, and stay productive at work.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <Users className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                For Teams
              </h3>
              <p className="text-gray-600">
                Collaborate seamlessly with shared notes and real-time updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;

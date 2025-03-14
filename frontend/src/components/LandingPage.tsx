"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle,
  Cloud,
  Lock,
  Users,
  Zap,
  Calendar,
  Bell,
  LayoutTemplate,
  Link,
  Mic,
  Code,
} from "lucide-react";

// Helper function to animate counting
const animateValue = (
  start: number,
  end: number,
  duration: number,
  setValue: (value: number) => void
) => {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    setValue(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

export default function Home() {
  const [happyUsers, setHappyUsers] = useState(0);
  const [notesCreated, setNotesCreated] = useState(0);
  const [uptimeReliability, setUptimeReliability] = useState(0);

  // Ref for the stats section
  const statsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger the counting animation when the stats section is in view
            animateValue(0, 100000, 2000, setHappyUsers); // 100K+ Happy Users
            animateValue(0, 1000000, 2000, setNotesCreated); // 1M+ Notes Created
            animateValue(0, 99.9, 2000, (value) =>
              setUptimeReliability(parseFloat(value.toFixed(1)))
            ); // 99.9% Uptime Reliability
            observer.disconnect(); // Stop observing after the animation starts
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (statsSectionRef.current) {
        observer.unobserve(statsSectionRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <section className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Organize Your Thoughts with
          <span className="text-blue-600"> NoteX</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern note-taking app designed for productivity and simplicity.
          Whether you're new or already part of our community, NoteX helps you
          capture ideas, organize tasks and execute them seamlessly.
        </p>
        <div className="flex justify-center space-x-8 mt-12">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-gray-700">100,000+ Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-gray-700">Instant Sync</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="text-gray-700">Daily Reminders</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            How <span className="text-blue-600">NoteX</span> Works?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Capture Ideas
              </h3>
              <p className="text-gray-600">
                Quickly jot down your thoughts, tasks and ideas in a clean and
                intuitive interface.
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Organize Effortlessly
              </h3>
              <p className="text-gray-600">
                Track categories, created and updated date to keep your notes
                structured and easy to find.
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sync Across Devices
              </h3>
              <p className="text-gray-600">
                Access your notes from your phone, tablet or computer—anytime,
                anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Boost Your Productivity
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            NoteX comes with powerful tools to help you stay organized and
            productive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <Bell className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reminders
              </h3>
              <p className="text-gray-600">
                Set reminders for important tasks and deadlines.
              </p>
            </div>
            <div className="p-6">
              <LayoutTemplate className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Templates
              </h3>
              <p className="text-gray-600">
                Use pre-built templates for notes, to-do lists and more.
              </p>
            </div>
            <div className="p-6">
              <Link className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integrations
              </h3>
              <p className="text-gray-600">
                Connect NoteX with your favorite tools like Google Calendar and
                Slack.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What's Coming Next
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Here’s a sneak peek at the features we’re working on.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calendar Integration
              </h3>
              <p className="text-gray-600">
                Sync your notes with your calendar for better task management.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <Mic className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Voice Notes
              </h3>
              <p className="text-gray-600">
                Record and transcribe voice notes directly in NoteX.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <Code className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                API Access
              </h3>
              <p className="text-gray-600">
                Build custom integrations with NoteX's API.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Is NoteX free to use?
              </h3>
              <p className="text-gray-600">
                Yes, NoteX offers a free plan with basic features. You can
                upgrade to a paid plan for advanced functionality.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I use NoteX offline?
              </h3>
              <p className="text-gray-600">
                Absolutely! NoteX works offline and your notes will sync once
                you're back online.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Yes, your data is encrypted and stored securely. We prioritize
                your privacy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I share notes with others?
              </h3>
              <p className="text-gray-600">
                Yes, NoteX allows you to share notes and collaborate in
                real-time with others.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trusted By</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="relative h-12">
              <Image
                src="/images/leapfrog.jpg"
                alt="Leapfrog"
                className="mx-auto"
                width={130}
                height={120}
              />
            </div>
            <div className="relative h-12">
              <Image
                src="/images/fusemachines.png"
                alt="Fusemachines"
                layout="fill"
                objectFit="contain"
                className="mx-auto"
              />
            </div>
            <div className="relative h-12">
              <Image
                src="/images/microsoft.png"
                alt="Microsoft"
                layout="fill"
                objectFit="contain"
                className="mx-auto"
              />
            </div>
            <div className="relative h-12">
              <Image
                src="/images/google.png"
                alt="Google"
                layout="fill"
                objectFit="contain"
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={statsSectionRef}
        className="container mx-auto px-6 py-5 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          <span className="text-blue-600">NoteX</span> by the Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-5xl font-bold text-blue-600">
              {happyUsers.toLocaleString()}+
            </div>
            <p className="text-gray-600">Happy Users</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-blue-600">
              {notesCreated.toLocaleString()}+
            </div>
            <p className="text-gray-600">Notes Created</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-blue-600">
              {uptimeReliability}%
            </div>
            <p className="text-gray-600">Uptime Reliability</p>
          </div>
        </div>
      </section>
    </div>
  );
}

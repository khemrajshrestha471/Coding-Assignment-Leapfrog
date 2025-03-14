import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <section className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Get in <span className="text-blue-600">Touch</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We'd love to hear from you! Whether you have a question, feedback, or
          just want to say hello, feel free to reach out.
        </p>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <form>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Our Office
                  </h3>
                  <p className="text-gray-600">
                    Charkhal Rd,
                    <br />
                    Kathmandu, 44605
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Email Us
                  </h3>
                  <p className="text-gray-600">
                    support@notex.com
                    <br />
                    feedback@notex.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Call Us
                  </h3>
                  <p className="text-gray-600">
                    +977 (01) 123-4567
                    <br />
                    Mon - Fri, 9am - 5pm NPT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Find Us on the Map
          </h2>
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d-122.39867768468162!3d37.78391397975773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807f0f1b1f9f%3A0x1a5f5f5f5f5f5f5f!2s123%20NoteX%20Street%2C%20San%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1633020000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

import { FiPhone, FiMail, FiMapPin, FiMessageSquare } from 'react-icons/fi';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-12">
        Get in touch with us for any inquiries or support
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <FiPhone className="text-primary-500 text-2xl mr-4 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-gray-600">+254 792 531 105</p>
                <p className="text-gray-600">+254 722 395 449</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMail className="text-primary-500 text-2xl mr-4 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600">kangangibonface2021@gmail.com</p>
                <p className="text-gray-600">kangangiboniface2021@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMapPin className="text-primary-500 text-2xl mr-4 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-gray-600">Eldoret, Kenya</p>
                <p className="text-gray-600">Open: Mon-Sat, 9:00 AM - 5:00 PM</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMessageSquare className="text-primary-500 text-2xl mr-4 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">WhatsApp</h3>
                <a 
                  href="https://wa.me/254792531105" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Business Hours</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="input-field" placeholder="Your name" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="input-field" placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" className="input-field" placeholder="254700123456" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input type="text" className="input-field" placeholder="How can we help?" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea 
                className="input-field" 
                rows="5" 
                placeholder="Your message..."
              />
            </div>

            <button type="submit" className="w-full btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Find Us</h2>
        <div className="rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1849.4845181050357!2d35.24872557892005!3d0.5598822999466695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178107da64e351cf%3A0xf416dc9a7ce6638d!2sTransformer%20Center!5e0!3m2!1sen!2ske!4v1762605149775!5m2!1sen!2ske" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
      </div>
    </div>
  );
}

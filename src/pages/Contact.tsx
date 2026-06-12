import React from 'react';
import { motion } from 'framer-motion';
import { IconMapPin, IconPhone, IconMail, IconClock } from '@tabler/icons-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            className="text-5xl font-heading font-bold text-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Get in Touch
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-primary mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Visit our showroom in Nadiad or reach out to us for any inquiries regarding our premium collections.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Contact Details */}
          <motion.div 
            className="lg:w-1/3 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-heading font-bold mb-6 text-dark">Contact Info</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mt-1">
                    <IconMapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-dark mb-1">Showroom Address</p>
                    <p className="text-gray-600 leading-relaxed">
                      N.H. No.8, Piplag Chokdi,<br/>
                      At. Piplag, Nadiad - 387 355,<br/>
                      Gujarat, INDIA
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mt-1">
                    <IconPhone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-dark mb-1">Phone Numbers</p>
                    <p className="text-gray-600">Office: +91 94084 61000</p>
                    <p className="text-gray-600">Vinod Shah: +91 99989 87547</p>
                    <p className="text-gray-600">Hitesh Shah: +91 99741 42777</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mt-1">
                    <IconMail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-dark mb-1">Email Address</p>
                    <p className="text-gray-600">nilkanth1marble@gmail.com</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mt-1">
                    <IconClock size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-dark mb-1">Working Hours</p>
                    <p className="text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Form and Map */}
          <motion.div 
            className="lg:w-2/3 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-heading font-bold mb-6 text-dark">Send us a Message</h3>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input required type="text" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-gray-50" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input required type="tel" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-gray-50" placeholder="Your Phone" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Interest (Optional)</label>
                  <input type="text" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-gray-50" placeholder="e.g. Italian Marble, Vitrified Tiles" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea required rows={4} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-gray-50" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn-primary w-full md:w-auto px-10 py-4 text-lg">Send Message</button>
              </form>
            </div>

            {/* Google Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-[300px] overflow-hidden shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14742.664426588265!2d72.8687!3d22.6953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e5b6b6c0e5ebf%3A0x6b093e0857313a1a!2sPiplag%2C%20Nadiad%2C%20Gujarat%20387355!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Nilkanth Marble Location"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

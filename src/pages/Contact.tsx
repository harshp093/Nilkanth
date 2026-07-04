import React from 'react';
import { Link } from 'react-router-dom';
import InquiryForm from '../components/inquiry/InquiryForm';

const PHONE1 = '+91 94084 61000';
const PHONE2 = '+91 99741 42777';
const PHONE3 = '+91 99989 87547';
const EMAIL = 'nilkanth1marble@gmail.com';
const WA_NUMBER = '919974142777';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Contact Us</span>
          </nav>
          <h1 className="text-3xl font-heading font-black text-gray-900">Contact Us</h1>
          <p className="text-gray-500 mt-1">Visit our showroom or reach us via WhatsApp, phone, or email</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Info Side */}
          <div>
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Nilkanth Marble! I would like to enquire about your products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-wa justify-center py-3.5 text-base"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Now
              </a>
              <a href={`tel:+919974142777`} className="flex-1 btn-primary justify-center py-3.5 text-base">
                📞 Call Now
              </a>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm mb-6">
              {/* Address */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C3A6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">Showroom Address</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    N.H. No.8, Piplag Chokdi,<br />
                    At. Piplag, Nadiad - 387 355<br />
                    Gujarat, INDIA
                  </p>
                  <a
                    href="https://maps.app.goo.gl/7KZeY4LQAkGFS1fT8?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-semibold mt-1.5 inline-flex items-center gap-1 hover:underline"
                  >
                    📍 Open in Google Maps →
                  </a>
                </div>
              </div>

              {/* Phones */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 12a19.79 19.79 0 01-3-8.58A2 2 0 012.5 1.5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.78-1.78a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1.5">Phone Numbers</p>
                  <div className="space-y-1">
                    <a href="tel:+919408461000" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                      <span className="text-xs text-gray-400 w-20">Main:</span>
                      {PHONE1}
                    </a>
                    <a href="tel:+919974142777" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                      <span className="text-xs text-gray-400 w-20">Hitesh:</span>
                      {PHONE2}
                    </a>
                    <a href="tel:+919998987547" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                      <span className="text-xs text-gray-400 w-20">Vinod:</span>
                      {PHONE3}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8962E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Email</p>
                  <a href={`mailto:${EMAIL}`} className="text-gray-500 text-sm hover:text-primary transition-colors">{EMAIL}</a>
                </div>
              </div>

              {/* Hours */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Business Hours</p>
                  <p className="text-gray-500 text-sm">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                  <p className="text-gray-400 text-xs mt-0.5">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.518510342!2d72.8568082!3d22.6717339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e5af9660e2805%3A0xc48dee0dbe0d45!2sNilkanth%20Marble%20%3A%20The%20Quality%20Forever!5e0!3m2!1sen!2sin!4v1783148002669!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nilkanth Marble Location"
              />
            </div>
          </div>

          {/* Inquiry Form Side */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Send General Inquiry</h2>
            <div className="section-divider mb-6" />
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <InquiryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

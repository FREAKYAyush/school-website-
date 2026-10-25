import React, { useState } from 'react';
import { SchoolInfo } from '../types.ts';
import { api } from '../services/api.ts';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Building, ExternalLink } from 'lucide-react';

interface ContactPageProps {
  schoolInfo: SchoolInfo | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ schoolInfo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Admission & School Inquiry');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg('Please enter your name and message.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please enter at least an email address or mobile phone number.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await api.sendContact({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim()
      });
      setSuccessMsg(res.message || 'Thank you! Your message has been sent to the school administration.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            Administrative Helpdesk & Campus Location
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Contact UHS Madhulata
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Have questions regarding admissions, scholarship documentation, transfer certificates, or student progress? Get in touch with our office.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Contact Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Official Address
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {schoolInfo?.name || 'UHS MADHULATA RANIGANJ ARARIA'}
              </h2>
            </div>

            {/* Address Details */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">
                    Madhulata, Bishanpur Panchayat, Raniganj, Araria
                  </p>
                  <p className="text-slate-600">Post Office - Madhulata</p>
                  <p className="text-slate-600">Police Station - Raniganj</p>
                  <p className="text-slate-600">
                    PIN Code - <span className="font-mono font-bold text-emerald-800">854334</span>
                  </p>
                  <p className="text-slate-600">Bihar, India</p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${schoolInfo?.phone || '7631729440'}`}
                className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call: {schoolInfo?.phone || '7631729440'}</span>
              </a>

              <a
                href={`mailto:${schoolInfo?.email || 'uhsmadhulata607@gmail.com'}`}
                className="flex items-center justify-center gap-2 p-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs truncate"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">Email Office</span>
              </a>
            </div>

            {/* Working Hours */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Working & Counter Hours</span>
                  <p>{schoolInfo?.workingHours || 'Monday - Saturday: 9:30 AM to 4:00 PM | Office: 10:00 AM to 4:30 PM'}</p>
                  <p className="text-slate-400 mt-0.5">Sunday & Gazetted Holidays Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map / Landmark Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-700" />
              <span>Location Landmark & Connectivity</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Located in Madhulata village within Bishanpur Gram Panchayat, approximately 12 km from Raniganj Block headquarters in Araria district. Accessible via Raniganj - Forbesganj rural link roads.
            </p>
            <div className="h-44 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center p-4 text-xs text-slate-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />
              <MapPin className="w-8 h-8 text-red-600 mb-1 animate-bounce" />
              <p className="font-bold text-slate-800">UHS Madhulata Campus</p>
              <p className="text-[11px] text-slate-500">Madhulata, Raniganj, Araria (PIN 854334)</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Madhulata Raniganj Araria Bihar 854334')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Online Inquiry Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Send an Inquiry to Administration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your message will be sent directly to the school administrative inbox.
              </p>
            </div>

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg p-4 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Inquiry Sent Successfully!</p>
                  <p className="mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-900 rounded-lg p-4 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                >
                  <option value="Admission & Enrollment">Admission & Enrollment Inquiry</option>
                  <option value="Scholarship Document Verification">Scholarship Document Verification</option>
                  <option value="BSEB Matric Examination & Admit Card">BSEB Matric Examination & Admit Card</option>
                  <option value="Transfer Certificate (SLC/CLC)">Transfer Certificate (SLC/CLC)</option>
                  <option value="Parent Teacher Interaction">Parent Teacher Interaction</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Message / Inquiry Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Please write your questions or comments clearly..."
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github } from 'lucide-react';

const Footer = ({ onTriggerComingSoon }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 font-sans border-t border-slate-800">
      {/* Upper Footer: Logo, Links, Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Bio */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                SISCP <span className="text-indigo-400 block text-[9px] font-medium tracking-widest uppercase">College Startup Cell</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 font-normal">
              Fostering innovation, accelerating venture creation, and offering college-wide support for student innovators to turn dreams into high-growth startup ventures.
            </p>
            <div className="flex space-x-3 pt-2">
              <button onClick={() => onTriggerComingSoon('Success Gallery')} className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-slate-400">
                <Linkedin className="h-4 w-4" />
              </button>
              <button onClick={() => onTriggerComingSoon('Success Gallery')} className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-slate-400">
                <Twitter className="h-4 w-4" />
              </button>
              <button onClick={() => onTriggerComingSoon('Success Gallery')} className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-slate-400">
                <Github className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <button onClick={() => onTriggerComingSoon('Success Gallery')} className="hover:text-indigo-400 transition-colors text-left">
                  Success Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onTriggerComingSoon('Notifications')} className="hover:text-indigo-400 transition-colors text-left">
                  Events & Announcements
                </button>
              </li>
              <li>
                <button onClick={() => onTriggerComingSoon('Admin Panel')} className="hover:text-indigo-400 transition-colors text-left">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Startup Modules */}
          <div>
            <h4 className="font-display text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Cell Actions
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onTriggerComingSoon('Startup Register')} className="hover:text-indigo-400 transition-colors text-left">
                  Register Startup
                </button>
              </li>
              <li>
                <button onClick={() => onTriggerComingSoon('Proposal Form')} className="hover:text-indigo-400 transition-colors text-left">
                  Submit Idea Proposal
                </button>
              </li>
              <li>
                <button onClick={() => onTriggerComingSoon('Incubation Apply')} className="hover:text-indigo-400 transition-colors text-left">
                  Apply for Incubation
                </button>
              </li>
              <li>
                <button onClick={() => onTriggerComingSoon('Mentor Assign')} className="hover:text-indigo-400 transition-colors text-left">
                  Request Mentor Meeting
                </button>
              </li>
              <li>
                <button onClick={() => onTriggerComingSoon('Progress Tracker')} className="hover:text-indigo-400 transition-colors text-left">
                  Milestone Progress Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-display text-white font-semibold text-sm uppercase tracking-wider mb-1">
              Contact Center
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-indigo-400 mt-1 shrink-0" />
                <span className="leading-relaxed">
                  Innovation Block, Phase-II,<br />
                  State University Campus,<br />
                  IND - 560012
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <a href="mailto:startupcell@college.edu" className="hover:text-white transition-colors">
                  startupcell@college.edu
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="hover:text-white transition-colors">
                  +91 (080) 4556-9900
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower Footer: Copyright */}
      <div className="bg-slate-950 border-t border-slate-800/40 py-6 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Student Innovation & Startup Cell Portal. All rights reserved.</p>
          <div className="flex space-x-4">
            <button onClick={() => onTriggerComingSoon('History')} className="hover:text-slate-350 transition-all">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onTriggerComingSoon('History')} className="hover:text-slate-350 transition-all">Terms of Use</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

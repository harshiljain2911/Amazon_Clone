import React from 'react';
import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    title: 'Get to Know Us',
    links: ['About Amazon', 'Careers', 'Press Releases', 'Amazon Science', 'Blog'],
  },
  {
    title: 'Connect with Us',
    links: ['Facebook', 'Twitter', 'Instagram', 'YouTube', 'LinkedIn'],
  },
  {
    title: 'Make Money with Us',
    links: [
      'Sell on Amazon',
      'Sell under Amazon Accelerator',
      'Amazon Associates',
      'Advertise Your Products',
      'Self-Publish with Us',
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      'Your Account',
      'Returns & Replacements',
      'Manage Content & Devices',
      'Amazon Assistant',
      'Help',
    ],
  },
];

const BOTTOM_LINKS = [
  'Conditions of Use & Sale',
  'Privacy Notice',
  'Interest-Based Ads Notice',
];

const Footer = () => (
  <footer className="mt-4">

    {/* ── Back to top ── */}
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="w-full bg-[#37475a] hover:bg-[#485769] text-white text-sm
                 font-normal py-3 text-center transition-colors duration-150"
    >
      Back to top
    </button>

    {/* ── Main columns ── */}
    <div className="bg-[#232f3e] text-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#dddddd] text-sm hover:text-white transition-colors hover:no-underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* ── Thin divider ── */}
    <div className="bg-[#3a4553] h-px" />

    {/* ── Bottom strip ── */}
    <div className="bg-[#131921] py-6">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-4">

        {/* Logo */}
        <div className="flex flex-col items-center">
          <span className="text-white font-bold text-xl tracking-tighter"
                style={{ fontFamily: 'Georgia, serif' }}>
            amazon
          </span>
          <span className="text-[#febd69] text-[10px] leading-none self-end -mt-1">.in</span>
        </div>

        {/* Bottom links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          {BOTTOM_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="text-[#dddddd] text-xs hover:text-white transition-colors hover:no-underline"
            >
              {l}
            </a>
          ))}
          <Link to="/orders" className="text-[#dddddd] text-xs hover:text-white transition-colors hover:no-underline">
            Your Orders
          </Link>
          <Link to="/wishlist" className="text-[#dddddd] text-xs hover:text-white transition-colors hover:no-underline">
            Wish List
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-[#aaaaaa] text-xs text-center">
          © 2026, Amazon.com, Inc. or its affiliates — Clone by{' '}
          <span className="text-white font-semibold">Harshil Jain</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

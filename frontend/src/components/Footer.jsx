import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, ShieldCheck, ExternalLink } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gov-gray text-gov-text border-t border-gov-border pt-10 pb-6 mt-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">🌾</span>
            <span className="font-bold font-heading text-lg text-gov-text">AgriQueue Digital Platform</span>
          </div>
          <p className="text-xs text-gov-muted leading-relaxed">
            An official initiative by the Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution, Government of India, to streamline grain procurement schedules and assure direct MSP payment distribution.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold font-heading text-gov-text uppercase tracking-wider mb-3">Toll-Free Support & Helpdesk</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-gov-red font-bold font-heading">
              <Phone className="w-4 h-4" />
              <span>National Farmer Helpline: 1800-180-1551</span>
            </div>
            <div className="flex items-center space-x-2 text-gov-text">
              <Mail className="w-4 h-4 text-gov-red" />
              <span>procurement-support@dca.gov.in</span>
            </div>
            <div className="flex items-center space-x-2 text-gov-text">
              <ShieldCheck className="w-4 h-4 text-gov-green" />
              <span>Direct Benefit Transfer (DBT) Verified</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold font-heading text-gov-text uppercase tracking-wider mb-3">Official Links</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a href="https://consumeraffairs.nic.in" target="_blank" rel="noreferrer" className="hover:text-gov-red flex items-center space-x-1">
                <span>Department of Consumer Affairs</span>
                <ExternalLink className="w-3 h-3 text-gov-muted" />
              </a>
            </li>
            <li>
              <a href="https://fci.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-red flex items-center space-x-1">
                <span>Food Corporation of India (FCI)</span>
                <ExternalLink className="w-3 h-3 text-gov-muted" />
              </a>
            </li>
            <li>
              <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-red flex items-center space-x-1">
                <span>PM-KISAN DBT Portal</span>
                <ExternalLink className="w-3 h-3 text-gov-muted" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-gov-border text-center text-xs text-gov-muted">
        © {new Date().getFullYear()} AgriQueue. Designed for Ministry of Consumer Affairs, Food & Public Distribution. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

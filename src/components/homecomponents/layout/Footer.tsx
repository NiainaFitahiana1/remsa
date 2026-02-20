import { Icon } from '../ui/Icon';

interface FooterLinkGroupProps {
  title: string;
  links: string[];
}

const FooterLinkGroup = ({ title, links }: FooterLinkGroupProps) => (
  <div>
    <h5 className="text-sm font-black uppercase tracking-widest mb-6">{title}</h5>
    <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-wider">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="hover:text-secondary-blue transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          <div className="flex flex-col gap-6">
            <a href="#" className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-sm">
                <Icon name="local_shipping" className="text-white text-xl" />
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter">
                DeliverFlow
              </span>
            </a>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              The definitive source for insights into the future of delivery, logistics, and global commerce technology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-blue hover:text-primary transition-colors">
                <Icon name="public" />
              </a>
              <a href="#" className="text-secondary-blue hover:text-primary transition-colors">
                <Icon name="alternate_email" />
              </a>
              <a href="#" className="text-secondary-blue hover:text-primary transition-colors">
                <Icon name="chat_bubble" />
              </a>
            </div>
          </div>

          <FooterLinkGroup
            title="Explore"
            links={['The Platform', 'Fleet Solutions', 'API Documentation', 'Case Studies']}
          />
          <FooterLinkGroup
            title="Company"
            links={['About Us', 'Careers', 'Press Kit', 'Contact']}
          />
          <FooterLinkGroup
            title="Legal"
            links={['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security']}
          />
        </div>

        <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2024 DeliverFlow Technologies Inc. All Rights Reserved.
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            System Status: <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Operational
          </p>
        </div>
      </div>
    </footer>
  );
};
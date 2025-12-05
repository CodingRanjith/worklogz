import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MetaTags = ({ 
  title = "Worklogz - Complete Business Management Platform | From Attendance to Everything Your Company Needs",
  description = "Worklogz: The all-in-one business management platform for companies of all sizes. Manage attendance, timesheets, payroll, projects, CRM, documents, and more. Trusted by 500+ companies worldwide. 99.2% accuracy rate. Start your free 14-day trial today!",
  image = "https://worklogz.com/og-image.png",
  keywords = "business management platform, workforce management, attendance tracking, timesheet software, payroll management, project management, CRM software, document management, employee management, time tracking, leave management, business software, cloud business management, worklogz, company management, business operations, team management, business automation",
  url = "https://worklogz.com"
}) => {
  const location = useLocation();
  const currentUrl = `${url}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('title', title);

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', 'website', 'property');

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:card', 'summary_large_image');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [title, description, image, keywords, currentUrl]);

  return null;
};

export default MetaTags;


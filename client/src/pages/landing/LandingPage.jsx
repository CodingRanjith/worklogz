import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import LandingHeader from './components/LandingHeader';
import LandingFooter from './components/LandingFooter';
import HeroSection from './sections/HeroSection';
import FeaturesShowcase from './sections/FeaturesShowcase';
import HowItWorks from './sections/HowItWorks';
import BenefitsSection from './sections/BenefitsSection';
import SolutionsByIndustry from './sections/SolutionsByIndustry';
import SocialProof from './sections/SocialProof';
import FeatureDeepDive from './sections/FeatureDeepDive';
import IntegrationsSection from './sections/IntegrationsSection';
import PricingPreview from './sections/PricingPreview';
import FAQSection from './sections/FAQSection';
import FinalCTA from './sections/FinalCTA';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
      <MetaTags
        title="Worklogz - Complete Business Management Platform | From Attendance to Everything Your Company Needs"
        description="Worklogz: The all-in-one business management platform for companies of all sizes. Manage attendance, timesheets, payroll, projects, CRM, documents, and more. Trusted by 500+ companies worldwide. 99.2% accuracy rate. Start your free 14-day trial today!"
        image="https://worklogz.com/og-image.png"
        keywords="business management platform, workforce management, attendance tracking, timesheet software, payroll management, project management, CRM software, document management, employee management, time tracking, leave management, business software, cloud business management, worklogz, company management, business operations, team management, business automation, techackode"
      />
      <div className="landing-page">
        <LandingHeader />
        
        <main className="landing-main">
          <HeroSection />
          <FeaturesShowcase />
          <HowItWorks />
          <BenefitsSection />
          <SolutionsByIndustry />
          <SocialProof />
          <FeatureDeepDive />
          <IntegrationsSection />
          <PricingPreview />
          <FAQSection />
          <FinalCTA />
        </main>

        <LandingFooter />
      </div>
    </>
  );
};

export default LandingPage;


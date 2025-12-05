import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  );
};

export default LandingPage;


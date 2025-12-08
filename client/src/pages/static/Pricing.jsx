import React, { useState } from 'react';
import { FiCheckCircle, FiX, FiAward, FiUsers, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LandingHeader from '../landing/components/LandingHeader';
import LandingFooter from '../landing/components/LandingFooter';
import MetaTags from '../../components/SEO/MetaTags';
import DemoRequestForm from '../../components/DemoRequestForm';
import './Pricing.css';

const Pricing = () => {
  const [demoFormOpen, setDemoFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [clientDetailsModal, setClientDetailsModal] = useState(false);

  // Worklogz Modules & Features - Based on Actual User & Admin Modules
  const features = [
    // Pricing & Employees
    { name: 'Number of Employees', freeTrial: 'Limited', essential: 'Unlimited', growth: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Cost Per Additional Employee', freeTrial: 'Not Applicable', essential: '₹35 / month', growth: '₹65 / month', enterprise: '₹105 / month' },
    
    // ========== USER MODULES ==========
    { name: '--- USER MODULES ---', freeTrial: '', essential: '', growth: '', enterprise: '' },
    { name: 'User Profile Management', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Attendance Management (Camera + Location)', freeTrial: 'Limited', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Community Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Task Manager (Personal & Team)', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Salary Management (Daily Earnings)', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Leave Management', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Performance Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Workspace Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Application Integration/Management', freeTrial: 'X Not included', essential: 'X Not included', growth: 'Limited', enterprise: '✓ Included' },
    { name: 'People Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Team Management (User Side)', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Document Center Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Helpdesk (User Portal)', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Notification Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Mail Integration', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'AI Copilot Assistant', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Assessment Management', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Goals & Achievements', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Calendar View', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Skill Development', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    
    // ========== ADMIN MODULES ==========
    { name: '--- ADMIN MODULES ---', freeTrial: '', essential: '', growth: '', enterprise: '' },
    { name: 'Admin Dashboard', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Analytics Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Monthly Reports Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'User Management', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'User Cards', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Employee Schedules', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'User Pending Approvals', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Team Management (Admin)', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Admin Task Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Helpdesk Solver', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Company Overall Worklogz Management', freeTrial: 'X Not included', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Company Department Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Project Workspace Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'CRM Management (Course/Internship/IT Projects)', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'HR Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Admin Leave Management', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Payroll Management', freeTrial: 'Limited', essential: '✓ Included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Plan Management', freeTrial: 'X Not included', essential: 'X Not included', growth: 'Limited', enterprise: '✓ Included' },
    { name: 'Admin Access Control Management', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Document Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Company Settings Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Expense Management', freeTrial: 'X Not included', essential: 'X Not included', growth: 'Limited', enterprise: '✓ Included' },
    { name: 'Admin Performance Management', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Admin Assessment Management', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Late Arrival Reports', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Attendance Reports', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    
    // ========== ENTERPRISE FEATURES ==========
    { name: '--- ENTERPRISE FEATURES ---', freeTrial: '', essential: '', growth: '', enterprise: '' },
    { name: 'Group Company Support', freeTrial: 'X Not included', essential: 'Add-on', growth: 'Add-on', enterprise: '✓ Included' },
    { name: 'White Label Solution', freeTrial: 'X Not included', essential: 'Add-on', growth: 'Add-on', enterprise: '✓ Included' },
    { name: 'Custom Integrations', freeTrial: 'X Not included', essential: 'X Not included', growth: 'Add-on', enterprise: '✓ Included' },
    { name: 'Dedicated Account Manager', freeTrial: 'X Not included', essential: 'X Not included', growth: 'X Not included', enterprise: '✓ Included' },
    { name: 'Priority Support (24/7)', freeTrial: 'Limited', essential: 'Limited', growth: '✓ Included', enterprise: '✓ Included' },
    { name: 'Excel Import & Export', freeTrial: 'X Not included', essential: 'X Not included', growth: '✓ Included', enterprise: '✓ Included' },
    
    // ========== ADD-ON MODULES ==========
    { name: '--- ADD-ON MODULES ---', freeTrial: '', essential: '', growth: '', enterprise: '' },
    { name: 'GeoMark+ (Location Tracking)', freeTrial: 'X Not included', essential: 'X Not included', growth: 'X Not included', enterprise: 'Add-on' },
    { name: 'Visage (Facial Recognition)', freeTrial: 'X Not included', essential: 'Add-on', growth: 'Add-on', enterprise: 'Add-on' },
    { name: 'Recruit (Recruitment System)', freeTrial: 'X Not included', essential: 'Add-on', growth: 'Add-on', enterprise: 'Add-on' },
  ];

  const renderFeatureStatus = (status) => {
    if (status === '✓ Included') {
      return <span className="feature-status included"><FiCheckCircle className="w-4 h-4" /> Included</span>;
    }
    if (status === 'X Not included') {
      return <span className="feature-status not-included"><FiX className="w-4 h-4" /> Not included</span>;
    }
    if (status === 'Limited') {
      return <span className="feature-status limited">Limited</span>;
    }
    if (status === 'Add-on') {
      return <span className="feature-status addon">Add-on</span>;
    }
    return <span className="feature-status text">{status}</span>;
  };

  return (
    <>
      <MetaTags
        title="Pricing Plans - Worklogz | Modules and Features Comparison"
        description="Compare Worklogz pricing plans: Free Trial, Essential (₹3,495/month), Growth (₹5,495/month), and Enterprise (₹7,495/month). All plans include 25 employees free. See detailed feature comparison."
        keywords="worklogz pricing, essential plan, growth plan, enterprise plan, HR software pricing, workforce management pricing"
      />
      <div className="pricing-page">
        <LandingHeader />

        <div className="pricing-container">
          {/* Hero Section */}
          <div className="pricing-hero">
            <h1>
              Modules and <span style={{ color: '#3F3F7F' }}>Features</span>
            </h1>
            <p>
              Compare our pricing plans and choose the perfect fit for your organization
            </p>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#e8e8f0', 
              color: '#3F3F7F', 
              padding: '0.5rem 1rem', 
              borderRadius: '9999px', 
              fontSize: '0.875rem', 
              fontWeight: '600' 
            }}>
              <FiAward style={{ width: '16px', height: '16px' }} />
              All plans include 25 Employees (Free)
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pricing-tabs">
            <button
              onClick={() => setActiveTab('plans')}
              className={`pricing-tab ${activeTab === 'plans' ? 'active' : ''}`}
            style={activeTab === 'plans' ? { color: '#3F3F7F', borderBottomColor: '#3F3F7F' } : {}}
            >
              Plans
            </button>
            <button
              onClick={() => setActiveTab('addon')}
              className={`pricing-tab ${activeTab === 'addon' ? 'active' : ''}`}
            style={activeTab === 'addon' ? { color: '#3F3F7F', borderBottomColor: '#3F3F7F' } : {}}
            >
              Add-On
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`pricing-tab ${activeTab === 'comparison' ? 'active' : ''}`}
            style={activeTab === 'comparison' ? { color: '#3F3F7F', borderBottomColor: '#3F3F7F' } : {}}
            >
              Price comparison
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`pricing-tab ${activeTab === 'faqs' ? 'active' : ''}`}
            style={activeTab === 'faqs' ? { color: '#3F3F7F', borderBottomColor: '#3F3F7F' } : {}}
            >
              FAQs
            </button>
          </div>

          {/* Features Comparison Table with Pricing in Header */}
          {activeTab === 'plans' && (
            <div className="pricing-table-wrapper">
              <div className="pricing-table-scroll">
                <table className="pricing-table">
                  <thead>
                    <tr>
                      <th className="table-feature-column">Modules and Features</th>
                      <th>
                        <div className="plan-header-content">
                          <h3 className="plan-name-header">Free Trial</h3>
                          <div className="plan-price-header">₹0</div>
                          <div className="plan-period-header">/ month</div>
                          <div className="plan-employees-header">Includes 25 Employees (Free)</div>
                          <button
                            onClick={() => {
                              setSelectedPlan('Free Trial');
                              setClientDetailsModal(true);
                            }}
                            className="plan-button-header"
                          >
                            Start Free Trial
                          </button>
                        </div>
                      </th>
                      <th>
                        <div className="plan-header-content">
                          <h3 className="plan-name-header">Essential</h3>
                          <div className="plan-price-header">₹3,495</div>
                          <div className="plan-period-header">/ month</div>
                          <div className="plan-employees-header">Includes 25 Employees (Free)</div>
                          <button
                            onClick={() => {
                              setSelectedPlan('Essential');
                              setClientDetailsModal(true);
                            }}
                            className="plan-button-header"
                          >
                            Start Free Trial
                          </button>
                        </div>
                      </th>
                      <th>
                        <div className="plan-header-content popular-header">
                          <div className="popular-badge-table">Popular</div>
                          <h3 className="plan-name-header">Growth</h3>
                          <div className="plan-price-header">₹5,495</div>
                          <div className="plan-period-header">/ month</div>
                          <div className="plan-employees-header">Includes 25 Employees (Free)</div>
                          <button
                            onClick={() => {
                              setSelectedPlan('Growth');
                              setClientDetailsModal(true);
                            }}
                            className="plan-button-header"
                          >
                            Start Free Trial
                          </button>
                        </div>
                      </th>
                      <th>
                        <div className="plan-header-content">
                          <h3 className="plan-name-header">Enterprise</h3>
                          <div className="plan-price-header">₹7,495</div>
                          <div className="plan-period-header">/ month</div>
                          <div className="plan-employees-header">Includes 25 Employees (Free)</div>
                          <button
                            onClick={() => {
                              setSelectedPlan('Enterprise');
                              setClientDetailsModal(true);
                            }}
                            className="plan-button-header"
                          >
                            Start Free Trial
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                    <tbody>
                    {features.map((feature, index) => {
                      // Handle section headers
                      if (feature.name.startsWith('---')) {
                        return (
                          <tr key={index} className="section-header-row">
                            <td colSpan="5" className="section-header-cell">
                              <strong>{feature.name.replace(/---/g, '').trim()}</strong>
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={index}>
                          <td>{feature.name}</td>
                          <td>{renderFeatureStatus(feature.freeTrial)}</td>
                          <td>{renderFeatureStatus(feature.essential)}</td>
                          <td>{renderFeatureStatus(feature.growth)}</td>
                          <td>{renderFeatureStatus(feature.enterprise)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add-On Section */}
          {activeTab === 'addon' && (
            <div className="addon-section">
              <h2 className="section-title">Add-On Modules</h2>
              <div className="addon-grid">
                <div className="addon-card">
                  <h3>GeoMark+</h3>
                  <p>Advanced location tracking and geofencing for attendance management.</p>
                  <span className="addon-badge">Available as Add-on</span>
                </div>
                <div className="addon-card">
                  <h3>Visage</h3>
                  <p>Facial recognition and biometric attendance system.</p>
                  <span className="addon-badge">Available as Add-on</span>
                </div>
                <div className="addon-card">
                  <h3>Recruit</h3>
                  <p>Complete recruitment and applicant tracking system.</p>
                  <span className="addon-badge">Available as Add-on</span>
                </div>
              </div>
            </div>
          )}

          {/* Price Comparison */}
          {activeTab === 'comparison' && (
            <div className="comparison-section">
              <h2 className="section-title">Price Comparison with Competitors</h2>
              <p className="comparison-intro">
                Compare Worklogz pricing with other leading HR software solutions in India. All prices are approximate and may vary based on features and requirements.
              </p>
              
              {/* Worklogz Plans */}
              <div className="comparison-subsection">
                <h3 className="comparison-subtitle">Worklogz Plans</h3>
                <div className="pricing-table-scroll">
                  <table className="pricing-table">
                    <thead>
                      <tr>
                        <th>Plan</th>
                        <th>Monthly Price</th>
                        <th>Employees Included</th>
                        <th>Additional Employee Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Free Trial</strong></td>
                        <td>₹0</td>
                        <td>25</td>
                        <td>Not Applicable</td>
                      </tr>
                      <tr>
                        <td><strong>Essential</strong></td>
                        <td><strong>₹3,495</strong></td>
                        <td>25</td>
                        <td>₹35 / month</td>
                      </tr>
                      <tr>
                        <td><strong>Growth</strong></td>
                        <td><strong>₹5,495</strong></td>
                        <td>25</td>
                        <td>₹65 / month</td>
                      </tr>
                      <tr>
                        <td><strong>Enterprise</strong></td>
                        <td><strong>₹7,495</strong></td>
                        <td>25</td>
                        <td>₹105 / month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Competitor Comparison */}
              <div className="comparison-subsection">
                <h3 className="comparison-subtitle">Worklogz vs Competitors</h3>
                <div className="pricing-table-scroll">
                  <table className="pricing-table competitor-table">
                    <thead>
                      <tr>
                        <th>Features / Software</th>
                        <th className="worklogz-highlight">Worklogz</th>
                        <th>Zoho People</th>
                        <th>GreytHR</th>
                        <th>Keka HR</th>
                        <th>BambooHR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Starting Price (25 employees)</strong></td>
                        <td className="worklogz-highlight-cell"><strong>₹3,495/month</strong></td>
                        <td>₹6,000 - ₹8,000/month</td>
                        <td>₹4,000 - ₹6,000/month</td>
                        <td>₹4,999 - ₹6,999/month</td>
                        <td>$7 - $10/employee/month</td>
                      </tr>
                      <tr>
                        <td><strong>Free Trial</strong></td>
                        <td className="worklogz-highlight-cell">✓ 25 Employees Free</td>
                        <td>15 days limited</td>
                        <td>30 days limited</td>
                        <td>Limited trial</td>
                        <td>7 days trial</td>
                      </tr>
                      <tr>
                        <td><strong>Core HR Management</strong></td>
                        <td className="worklogz-highlight-cell">✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                      </tr>
                      <tr>
                        <td><strong>Payroll Management</strong></td>
                        <td className="worklogz-highlight-cell">✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>Add-on required</td>
                      </tr>
                      <tr>
                        <td><strong>Attendance Management</strong></td>
                        <td className="worklogz-highlight-cell">✓ Camera + Location</td>
                        <td>✓ Basic</td>
                        <td>✓ Basic</td>
                        <td>✓ Included</td>
                        <td>Limited</td>
                      </tr>
                      <tr>
                        <td><strong>Leave Management</strong></td>
                        <td className="worklogz-highlight-cell">✓ Advanced</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                      </tr>
                      <tr>
                        <td><strong>Task & Project Management</strong></td>
                        <td className="worklogz-highlight-cell">✓ Included</td>
                        <td>Limited</td>
                        <td>X Not included</td>
                        <td>Limited</td>
                        <td>Limited</td>
                      </tr>
                      <tr>
                        <td><strong>AI Copilot Assistant</strong></td>
                        <td className="worklogz-highlight-cell">✓ Included</td>
                        <td>X Not included</td>
                        <td>X Not included</td>
                        <td>X Not included</td>
                        <td>X Not included</td>
                      </tr>
                      <tr>
                        <td><strong>Employee Self-Service Portal</strong></td>
                        <td className="worklogz-highlight-cell">✓ Web + Mobile</td>
                        <td>✓ Web + Mobile</td>
                        <td>✓ Web + Mobile</td>
                        <td>✓ Web + Mobile</td>
                        <td>✓ Web + Mobile</td>
                      </tr>
                      <tr>
                        <td><strong>Document Management</strong></td>
                        <td className="worklogz-highlight-cell">✓ Advanced</td>
                        <td>✓ Basic</td>
                        <td>✓ Basic</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                      </tr>
                      <tr>
                        <td><strong>Analytics & Reporting</strong></td>
                        <td className="worklogz-highlight-cell">✓ Advanced</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                        <td>✓ Included</td>
                      </tr>
                      <tr>
                        <td><strong>Custom Integrations</strong></td>
                        <td className="worklogz-highlight-cell">✓ API Access</td>
                        <td>✓ Available</td>
                        <td>Limited</td>
                        <td>✓ Available</td>
                        <td>✓ Available</td>
                      </tr>
                      <tr>
                        <td><strong>White Label Solution</strong></td>
                        <td className="worklogz-highlight-cell">✓ Available</td>
                        <td>X Not included</td>
                        <td>X Not included</td>
                        <td>X Not included</td>
                        <td>X Not included</td>
                      </tr>
                      <tr>
                        <td><strong>Customer Support</strong></td>
                        <td className="worklogz-highlight-cell">24/7 Priority</td>
                        <td>Business hours</td>
                        <td>Business hours</td>
                        <td>Business hours</td>
                        <td>Business hours</td>
                      </tr>
                      <tr>
                        <td><strong>Setup & Onboarding</strong></td>
                        <td className="worklogz-highlight-cell">✓ Free Support</td>
                        <td>Paid onboarding</td>
                        <td>Paid onboarding</td>
                        <td>Paid onboarding</td>
                        <td>Paid onboarding</td>
                      </tr>
                      <tr>
                        <td><strong>Best For</strong></td>
                        <td className="worklogz-highlight-cell">All businesses (25+ employees free)</td>
                        <td>Mid to large enterprises</td>
                        <td>Indian businesses</td>
                        <td>Growing companies</td>
                        <td>US-based companies</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Advantages */}
              <div className="comparison-advantages">
                <h3 className="comparison-subtitle">Why Choose Worklogz?</h3>
                <div className="advantages-grid">
                  <div className="advantage-card">
                    <div className="advantage-icon">💰</div>
                    <h4>Best Value</h4>
                    <p>Starting at ₹3,495/month with 25 employees included free. Most cost-effective solution in the market.</p>
                  </div>
                  <div className="advantage-card">
                    <div className="advantage-icon">🚀</div>
                    <h4>More Features</h4>
                    <p>AI Copilot, Task Management, Advanced Attendance with Camera, and more included in base plans.</p>
                  </div>
                  <div className="advantage-card">
                    <div className="advantage-icon">🇮🇳</div>
                    <h4>Made for India</h4>
                    <p>Compliant with Indian labor laws, statutory requirements, and local payroll regulations.</p>
                  </div>
                  <div className="advantage-card">
                    <div className="advantage-icon">⚡</div>
                    <h4>Easy Setup</h4>
                    <p>Free onboarding and 24/7 support. Get started in minutes, not weeks.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQs */}
          {activeTab === 'faqs' && (
            <div className="faq-section">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="faq-list">
                <div className="faq-item">
                  <h3>What's included in the base price?</h3>
                  <p>All plans include 25 employees free. You only pay extra for employees beyond 25 at the per-employee rate specified for each plan.</p>
                </div>
                <div className="faq-item">
                  <h3>Can I change plans later?</h3>
                  <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.</p>
                </div>
                <div className="faq-item">
                  <h3>What's the difference between Limited and Full features?</h3>
                  <p>Limited features provide basic functionality with some restrictions. Full features include all advanced capabilities without limitations.</p>
                </div>
                <div className="faq-item">
                  <h3>How do Add-ons work?</h3>
                  <p>Add-ons are optional modules that can be added to any plan for an additional monthly fee. Contact our sales team for add-on pricing.</p>
                </div>
                <div className="faq-item">
                  <h3>Is there a free trial?</h3>
                  <p>Yes, all paid plans include a free trial period. No credit card required to start.</p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="pricing-cta-section">
            <h2>Ready to Get Started?</h2>
            <p>
              Choose the perfect plan for your organization or contact us for custom solutions.
            </p>
            <div className="pricing-cta-buttons">
              <button
                onClick={() => setDemoFormOpen(true)}
                className="pricing-cta-button primary"
              >
                Request Demo
              </button>
              <Link
                to="/register"
                className="pricing-cta-button secondary"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

        <LandingFooter />
        <DemoRequestForm isOpen={demoFormOpen} onClose={() => setDemoFormOpen(false)} />
        
        {/* Client Details Modal */}
        <ClientDetailsModal 
          isOpen={clientDetailsModal} 
          onClose={() => {
            setClientDetailsModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      </div>
    </>
  );
};

// Client Details Modal Component
const ClientDetailsModal = ({ isOpen, onClose, plan }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    numberOfEmployees: '',
    industry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would typically send the data to your backend
    // For now, just show success and close
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Thank you! We'll contact you soon about the ${plan} plan.`);
      onClose();
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        numberOfEmployees: '',
        industry: '',
        message: ''
      });
    }, 1500);
  };

  if (!isOpen) return null;

  const planDetails = {
    'Free Trial': { price: '₹0', employees: '25', color: '#3F3F7F' },
    'Essential': { price: '₹3,495', employees: '25', color: '#3F3F7F' },
    'Growth': { price: '₹5,495', employees: '25', color: '#3F3F7F' },
    'Enterprise': { price: '₹7,495', employees: '25', color: '#3F3F7F' }
  };

  const currentPlan = planDetails[plan] || planDetails['Free Trial'];

  return (
    <div className="client-modal-overlay" onClick={onClose}>
      <div className="client-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="client-modal-header" style={{ background: `linear-gradient(135deg, ${currentPlan.color} 0%, #7c3aed 100%)` }}>
          <div>
            <h2 className="client-modal-title">Get Started with {plan}</h2>
            <p className="client-modal-subtitle">Fill in your details to start your free trial</p>
          </div>
          <button className="client-modal-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="client-modal-content">
          {/* Plan Summary */}
          <div className="plan-summary-card" style={{ borderColor: currentPlan.color }}>
            <div className="plan-summary-header" style={{ background: `${currentPlan.color}15` }}>
              <h3 style={{ color: currentPlan.color }}>{plan} Plan</h3>
              <div className="plan-summary-price" style={{ color: currentPlan.color }}>
                {currentPlan.price}<span className="plan-summary-period">/month</span>
              </div>
            </div>
            <div className="plan-summary-details">
              <div className="plan-summary-item">
                <span className="plan-summary-label">Free Employees:</span>
                <span className="plan-summary-value">{currentPlan.employees}</span>
              </div>
              <div className="plan-summary-item">
                <span className="plan-summary-label">Additional Cost:</span>
                <span className="plan-summary-value">
                  {plan === 'Free Trial' ? 'Not Applicable' : 
                   plan === 'Essential' ? '₹35/employee/month' :
                   plan === 'Growth' ? '₹65/employee/month' :
                   '₹105/employee/month'}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="client-modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your company name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person <span className="required">*</span></label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@company.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numberOfEmployees">Number of Employees</label>
                <input
                  type="number"
                  id="numberOfEmployees"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">Select Industry</option>
                  <option value="IT & Software">IT & Software</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Requirements</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your specific needs or requirements..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="form-button-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="form-button-submit"
                style={{ background: currentPlan.color }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Start Free Trial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

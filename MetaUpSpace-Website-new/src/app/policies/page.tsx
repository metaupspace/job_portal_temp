'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] w-full text-white">
      
      {/* Header */}
      <div className="bg-[#0A0A0A] border-b pt-20 border-blue-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-400/80 hover:text-blue-300 transition-colors duration-200 mb-8 text-sm font-medium tracking-wide uppercase"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 mb-6">
            All Policies of MetaUpSpace LLP
          </h1>
          <p className="text-gray-400 text-lg flex items-center gap-2">
            Last updated: December 11, 2025
          </p>
          
          {/* Quick Navigation with Updated Links */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="#privacy-policy" className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/20 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms-and-conditions" className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/20 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#terms-of-service" className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/20 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* ================= SECTION A CONTAINER ================= */}
        <div className="scroll-mt-24">
          <div className="mb-12 border-b border-blue-500/20 pb-4">
             <h2 className="text-3xl font-bold text-blue-100 mb-2">Section A: Core Corporate Policies</h2>
             <p className="text-blue-400/80">These policies apply uniformly to the parent entity, MetaUpSpace LLP, regardless of whether the client is purchasing services or software.</p>
          </div>

          <div className="space-y-12">
            {/* 1. Privacy Policy - UPDATED ID */}
            <section id="privacy-policy" className="group scroll-mt-24">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">1</span>
                Privacy Policy (MetaUpSpace LLP)
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300 space-y-6">
                <p className="text-gray-300 italic mb-4">
                  This policy details the company&apos;s commitment to data protection, explicitly addressing the requirements of GDPR and CCPA/CPRA, particularly concerning B2B data.
                </p>
                {/* ... content for privacy policy ... */}
                 <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">I. Introduction & Scope</h4>
                   <p className="text-gray-300 leading-relaxed">
                     This Privacy Policy describes how MetaUpSpace LLP (the &quot;Company&quot;) collects, uses, and protects the personal information of our clients, prospective clients, business contacts, website visitors, and users of the MetaUpSpace Labs Platform. We are committed to complying with global data protection laws, including the GDPR and CCPA/CPRA.
                   </p>
                </div>
                 <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">II. Data Processing Roles</h4>
                   <p className="text-gray-300 leading-relaxed">
                     We operate in two capacities regarding personal data:
                   </p>
                   <ul className="list-disc pl-5 text-gray-300 space-y-2">
                     <li><strong className="text-white">Data Controller:</strong> We are the Controller when we determine the purposes and means of processing data for our own business operations (e.g., billing, managing customer relationships, internal security, marketing contact lists).</li>
                     <li><strong className="text-white">Data Processor:</strong> We are the Processor when a client uses the MetaUpSpace Labs Platform to store, host, or process its own data (Client Data). In this scenario, the Client remains the Controller, and our duties are strictly governed by a separate Data Processing Addendum (DPA), which outlines our obligation to process data only upon the Client&apos;s written instructions.</li>
                   </ul>
                </div>
                 <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">III. Information We Collect</h4>
                   <p className="text-gray-300 leading-relaxed">
                     We collect both information provided directly by business contacts (such as names, job titles, organization names, email addresses, and billing details) and automatically collected data (such as IP addresses, device information, and usage data via cookies).
                   </p>
                </div>
                 <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">IV. Purpose and Legal Basis</h4>
                   <p className="text-gray-300 leading-relaxed">
                     We process personal data to perform contracts (service delivery and billing), for our legitimate interests (security, fraud prevention, and customer relationship management), and to comply with legal obligations.
                   </p>
                </div>
                 <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">V. Your Data Rights</h4>
                   <p className="text-gray-300 leading-relaxed">
                     You have specific rights regarding your data, including the right to access, rectify, or request the erasure of your personal information (&quot;Right to be Forgotten&quot;). You also have the right to object to certain processing activities, such as direct marketing. Please submit requests to our dedicated legal contact channel listed in the Contact Us policy.
                   </p>
                </div>
                 <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">VI. Data Security</h4>
                   <p className="text-gray-300 leading-relaxed">
                     MetaUpSpace LLP implements appropriate technical and organizational measures to protect your personal information. Access to sensitive data is strictly limited to employees with a &quot;need to know,&quot; and all relevant personnel are bound by confidentiality and security agreements. However, no transmission method over the internet can be guaranteed as 100% secure.
                   </p>
                </div>
              </div>
            </section>

            {/* 2. Contact Us */}
            <section className="group">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">2</span>
                Contact Us / Legal Information
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#0A0A0A] p-4 rounded-lg border border-blue-500/10">
                    <h4 className="text-blue-400 font-semibold mb-1 text-sm uppercase tracking-wider">Legal Entity</h4>
                    <p className="text-white">MetaUpSpace LLP</p>
                  </div>
                  <div className="bg-[#0A0A0A] p-4 rounded-lg border border-blue-500/10">
                    <h4 className="text-blue-400 font-semibold mb-1 text-sm uppercase tracking-wider">Registered Address</h4>
                    <p className="text-gray-300 text-sm">Room no; 9/2/2 ,Loft 1 Lal bahadur shastri nagar wadala east, Mumbai - 400037</p>
                  </div>
                  <div className="bg-[#0A0A0A] p-4 rounded-lg border border-blue-500/10">
                    <h4 className="text-blue-400 font-semibold mb-1 text-sm uppercase tracking-wider">General Inquiries</h4>
                    <Link href="mailto:bd@MetaUpSpace.com" className="text-white hover:text-blue-400 transition-colors">bd@metaupspace.com</Link>
                  </div>
                  <div className="bg-[#0A0A0A] p-4 rounded-lg border border-blue-500/10">
                    <h4 className="text-blue-400 font-semibold mb-1 text-sm uppercase tracking-wider">Technical Support</h4>
                    <Link href="mailto:support@metaupspace.com" className="text-white hover:text-blue-400 transition-colors">support@metaupspace.com</Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>


        {/* ================= SECTION B CONTAINER ================= */}
        <div className="scroll-mt-24">
          <div className="mb-12 border-b border-blue-500/20 pb-4">
             <h2 className="text-3xl font-bold text-blue-100 mb-2">Section B: Professional Services Policies</h2>
             <p className="text-blue-400/80">MetaUpSpace LLP</p>
          </div>

          <div className="space-y-12">
            {/* 1. Terms and Conditions - UPDATED ID */}
            <section id="terms-and-conditions" className="group scroll-mt-24">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">1</span>
                Terms and Conditions (Professional Services)
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300 space-y-6">
                {/* ... content for T&C ... */}
                 <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">1. Governing Documents</h4>
                   <p className="text-gray-300 leading-relaxed">
                     These Master Professional Services Terms and Conditions (the &quot;Agreement&quot;) form the basis for all services provided by MetaUpSpace LLP. The specific scope, timeline, deliverables, and fees for any engagement will be set forth in a separate, executed Statement of Work (SOW). In case of conflict, the SOW will prevail over this Agreement.
                   </p>
                </div>
                <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">2. Scope of Services</h4>
                   <p className="text-gray-300 leading-relaxed">
                     We provide highly skilled professional services, including consulting, custom development, and analysis. The Client acknowledges that the timely and successful performance of services depends on the Client&apos;s prompt provision of necessary facilities, personnel, access to IT resources, and proprietary business information.
                   </p>
                </div>
                <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">3. Intellectual Property (IP) Ownership</h4>
                   <ul className="list-disc pl-5 text-gray-300 space-y-2">
                     <li><strong className="text-white">MetaUpSpace Retained IP:</strong> We retain all intellectual property rights to our pre-existing background IP, methodologies, general tools, and reusable software components used to create the deliverables.</li>
                     <li><strong className="text-white">Client Deliverable IP (Work-for-Hire):</strong> Upon full and final payment of all fees due, the specific, customized deliverables created solely for the Client under the SOW shall be considered Work-for-Hire. We grant the Client a perpetual, non-exclusive license to use our retained background IP solely to utilize the final deliverables.</li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h4 className="text-blue-400 font-medium">4. Liability Limitation</h4>
                   <p className="text-gray-300 leading-relaxed">
                     Our aggregate liability for all claims arising under this Agreement is strictly capped at the total amount paid by the Client to MetaUpSpace LLP in the twelve (12) months preceding the event giving rise to the claim. We are not liable for any indirect, incidental, punitive, or consequential damages, including loss of data or loss of profit.
                   </p>
                </div>
              </div>
            </section>
            
            {/* ... other sections in B ... */}
             <section className="group">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">2</span>
                Cancellation and Refund Policy
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300 space-y-6">
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">1. Nature of Charges</h4>
                   <p className="text-gray-300 leading-relaxed">
                     Fees for Professional Services are based on dedicated labor and expertise. Once labor or time has been performed (whether fixed-fee or Time-and-Materials), that service is considered rendered and the associated payment is non-refundable.
                   </p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">2. Refund Calculation</h4>
                   <p className="text-gray-300 leading-relaxed">
                     Any approved refund will be calculated on a prorated basis, reflecting the value of the unfulfilled or deficient portion of the services, minus any non-refundable expenses already incurred by MetaUpSpace LLP in connection with that project.
                   </p>
                 </div>
              </div>
            </section>
             <section className="group">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">3</span>
                Service Delivery and Acceptance Terms
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300 space-y-6">
                 <ul className="list-disc pl-5 text-gray-300 space-y-4">
                   <li>
                     <strong className="text-white block mb-1">1. Delivery Method</strong>
                     All Professional Services deliverables (e.g., reports, custom code, documentation) are intangible digital goods and will be delivered exclusively via secure, electronic means, such as a private client portal, secure download link, or direct email attachment. Terms related to physical shipping or logistics are explicitly excluded.
                   </li>
                   <li>
                     <strong className="text-white block mb-1">2. Proof of Fulfillment</strong>
                     Delivery is deemed complete on the date and time the deliverable is made available to the Client, as documented by our system logs (e.g., date of upload to the client portal or transmission of the delivery notice).
                   </li>
                   <li>
                     <strong className="text-white block mb-1">3. Client Acceptance and Remediation</strong>
                     Deliverables are subject to the formal acceptance procedure outlined in the SOW. If a confirmed defect is identified during the warranty period, MetaUpSpace LLP&apos;s sole obligation is limited to providing necessary fixes or corrections (remediation) as defined in the SOW.
                   </li>
                 </ul>
              </div>
            </section>
          </div>
        </div>


        {/* ================= SECTION C CONTAINER ================= */}
        <div className="scroll-mt-24">
          <div className="mb-12 border-b border-blue-500/20 pb-4">
             <h2 className="text-3xl font-bold text-blue-100 mb-2">Section C: SaaS Product Policies</h2>
             <p className="text-blue-400/80">MetaUpSpace Labs</p>
          </div>

          <div className="space-y-12">
            {/* 1. Terms of Service - UPDATED ID */}
            <section id="terms-of-service" className="group scroll-mt-24">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">1</span>
                Terms of Service (SaaS Subscription)
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300 space-y-6">
                {/* ... content for ToS ... */}
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">1. Licensing Grant</h4>
                   <p className="text-gray-300 leading-relaxed">
                     MetaUpSpace LLP grants the Client a limited, non-exclusive, non-transferable subscription license to access and use the MetaUpSpace Labs Platform for the agreed Subscription Term. The software is licensed, not sold, and the Client&apos;s right of use is limited to the number of User Subscription Licenses (User SLs) purchased.
                   </p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">2. IP Retention</h4>
                   <p className="text-gray-300 leading-relaxed">
                     MetaUpSpace LLP retains all rights, title, and interest in and to the MetaUpSpace Labs Platform, including all underlying software, code, features, and improvements. The Client receives only a right to use the Platform, and no intellectual property ownership is assigned.
                   </p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">3. Fees and Automatic Renewal</h4>
                   <p className="text-gray-300 leading-relaxed">
                     The Client agrees to pay the recurring subscription fees specified in the Order Form. All subscriptions are subject to automatic renewal at the end of the Subscription Term at the then-current rates, unless the Client cancels prior to the renewal date. The Client authorizes recurring payment processing for renewal.
                   </p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">4. Warranty and Service Levels</h4>
                   <p className="text-gray-300 leading-relaxed">
                     The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We warrant that the Platform will perform substantially in accordance with its published documentation. The Client&apos;s sole remedy for any service deficiency or breach of performance is defined by the specific Service Level Agreement (SLA), which may provide for service credits but not monetary refunds.
                   </p>
                 </div>
              </div>
            </section>
            
            {/* ... other sections in C ... */}
             <section className="group">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">2</span>
                Cancellation and Refund Policy (SaaS)
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300 space-y-6">
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">1. Non-Refundable Digital Goods</h4>
                   <p className="text-gray-300 leading-relaxed">
                     SaaS subscriptions are classified as digital products with instant fulfillment. Because access is granted immediately and utilization cannot be reversed, all payments for the current, active Subscription Term are strictly final and non-refundable.
                   </p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">2. Cancellation Procedure</h4>
                   <p className="text-gray-300 leading-relaxed">
                     Cancellation requests, typically initiated through the client&apos;s account settings, only prevent future automatic renewal and subsequent billing. The Client retains access to the Platform until the end of the pre-paid term, and no monetary refund will be issued for the unused portion of the term.
                   </p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-blue-400 font-medium">3. Excluded Fees</h4>
                   <p className="text-gray-300 leading-relaxed">
                     Non-recurring charges such as setup fees, custom implementation costs, or professional integration services are non-refundable.
                   </p>
                 </div>
              </div>
            </section>
             <section className="group">
              <h3 className="text-xl font-semibold text-blue-200 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">3</span>
                Digital Fulfillment and Licensing Terms
              </h3>
              <div className="bg-[#111111] border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-colors duration-300 space-y-6">
                 <ul className="list-disc pl-5 text-gray-300 space-y-4">
                   <li>
                     <strong className="text-white block mb-1">1. Nature of Product and Delivery</strong>
                     MetaUpSpace Labs provides intangible software licenses. Delivery is achieved exclusively through instantaneous electronic provisioning, which includes granting access credentials, providing a license key, or enabling account access via email upon payment confirmation.
                   </li>
                   <li>
                     <strong className="text-white block mb-1">2. Proof of Fulfillment</strong>
                     The system record showing the activation of the subscription, the provision of access credentials, or the transmission of the license key serves as definitive proof of fulfillment of the digital good.
                   </li>
                   <li>
                     <strong className="text-white block mb-1">3. No Exchange/Return</strong>
                     Since the product is licensed software, the concepts of &quot;exchange&quot; or &quot;return&quot; do not apply. Remedies for service quality issues are governed by the Service Level Agreement (SLA) and are limited to fixes, patches, or service credits.
                   </li>
                 </ul>
              </div>
            </section>
          </div>
        </div>

      </div>

  
    </div>
  );
}

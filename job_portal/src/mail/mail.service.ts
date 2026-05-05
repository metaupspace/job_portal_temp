import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ApplicationStatus } from '../common/enums/application-status.enum';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private fromAddress: string;
  private adminEmail: string;

  constructor(private readonly configService: ConfigService) {
    const user = configService.get<string>('mail.user');
    this.fromAddress = `"MetaUpSpace Careers" <${user}>`;
    this.adminEmail = configService.getOrThrow<string>('admin.email');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: configService.get<string>('mail.pass'),
      },
    });
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${(error as Error).message}`,
      );
    }
  }

  async sendApplicationConfirmationToCandidate(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
  ): Promise<void> {
    const html = `
      <h2>Application Received!</h2>
      <p>Hi ${this.escapeHtml(candidateName)},</p>
      <p>We've received your application for <strong>${this.escapeHtml(jobTitle)}</strong> at MetaUpSpace.</p>
      <p>Our team will review your profile and get back to you if it aligns with our requirements.</p>
      <p>Thank you for considering MetaUpSpace for the next step in your journey!</p>
      <br><p>Team MetaUpSpace</p>
    `;
    await this.send(candidateEmail, `Application Received — ${jobTitle}`, html);
  }

  async sendNewApplicationAlertToAdmin(
    candidateName: string,
    candidateEmail: string,
    jobTitle: string,
  ): Promise<void> {
    const html = `
      <h2>New Application Received</h2>
      <p>A new application has been submitted for <strong>${this.escapeHtml(jobTitle)}</strong>.</p>
      <p><strong>Candidate:</strong> ${this.escapeHtml(candidateName)}</p>
      <p><strong>Email:</strong> ${this.escapeHtml(candidateEmail)}</p>
      <p>Log in to the admin panel to review the application.</p>
    `;
    await this.send(
      this.adminEmail,
      `New Application — ${this.escapeHtml(jobTitle)} from ${this.escapeHtml(candidateName)}`,
      html,
    );
  }

  async sendStatusUpdate(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    status: ApplicationStatus,
  ): Promise<void> {
    const templates: Partial<
      Record<ApplicationStatus, { subject: string; html: string }>
    > = {
      [ApplicationStatus.REVIEWED]: {
        subject: 'Your Application is Under Review',
        html: `<h2>Application Update</h2><p>Hi ${this.escapeHtml(candidateName)},</p><p>Your application for <strong>${this.escapeHtml(jobTitle)}</strong> is currently under review. We'll update you soon.</p><p>Team MetaUpSpace</p>`,
      },
      [ApplicationStatus.SHORTLISTED]: {
        subject: `You've Been Shortlisted — ${jobTitle}`,
        html: `<h2>Great News!</h2><p>Hi ${this.escapeHtml(candidateName)},</p><p>You've been shortlisted for <strong>${this.escapeHtml(jobTitle)}</strong> at MetaUpSpace! Our team will be in touch with the next steps shortly.</p><p>Team MetaUpSpace</p>`,
      },
      [ApplicationStatus.REJECTED]: {
        subject: 'Application Update — MetaUpSpace',
        html: `<h2>Application Update</h2><p>Hi ${this.escapeHtml(candidateName)},</p><p>Thank you for applying for <strong>${this.escapeHtml(jobTitle)}</strong>. After careful consideration, we've decided to move forward with other candidates at this time. We appreciate your interest and encourage you to apply for future openings.</p><p>Team MetaUpSpace</p>`,
      },
      [ApplicationStatus.HIRED]: {
        subject: `Congratulations — Next Steps for ${jobTitle}`,
        html: `<h2>Congratulations!</h2><p>Hi ${this.escapeHtml(candidateName)},</p><p>We're thrilled to inform you that you've been selected for <strong>${this.escapeHtml(jobTitle)}</strong> at MetaUpSpace! Our HR team will reach out shortly with the offer details and onboarding next steps.</p><p>Team MetaUpSpace</p>`,
      },
    };

    const template = templates[status];
    if (!template) return;
    await this.send(candidateEmail, template.subject, template.html);
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const html = `
      <h2>Your Login Code</h2>
      <p>Your one-time login code for MetaUpSpace is:</p>
      <h1 style="letter-spacing: 8px; font-family: monospace;">${otp}</h1>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <br><p>Team MetaUpSpace</p>
    `;
    await this.send(email, 'Your MetaUpSpace Login Code', html);
  }

  async sendDashboardNudge(
    email: string,
    fullName: string,
    jobTitle: string,
  ): Promise<void> {
    const html = `
      <h2>Track Your Application</h2>
      <p>Hi ${this.escapeHtml(fullName)},</p>
      <p>Your application for <strong>${this.escapeHtml(jobTitle)}</strong> has been received.</p>
      <p>You can track the status of all your applications by logging into your dashboard with your email address.</p>
      <br><p>Team MetaUpSpace</p>
    `;
    await this.send(email, 'Track Your Application — MetaUpSpace', html);
  }
}

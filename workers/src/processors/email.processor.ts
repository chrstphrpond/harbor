import { Job } from 'bullmq';

interface EmailJobData {
  tenantId: string;
  recipients: string[];
  subject: string;
  templateId: string;
  templateData: any;
}

export async function sendEmailJob(job: Job<EmailJobData>) {
  const { tenantId, recipients, subject, templateId, templateData } = job.data;

  console.log(`Sending email to ${recipients.length} recipients for tenant ${tenantId}`);
  console.log(`Subject: ${subject}`);
  console.log(`Template: ${templateId}`);

  try {
    // TODO: Implement actual email sending via provider (Resend, SendGrid, Mailgun)
    // For now, just log the email details

    console.log('Email data:', {
      to: recipients,
      subject,
      templateId,
      templateData,
    });

    // Example integration with Resend (commented):
    // const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY);
    // await resend.emails.send({
    //   from: process.env.EMAIL_FROM,
    //   to: recipients,
    //   subject,
    //   html: renderTemplate(templateId, templateData),
    // });

    console.log(`Email sent successfully to ${recipients.join(', ')}`);
  } catch (error) {
    console.error(`Error sending email:`, error);
    throw error;
  }
}

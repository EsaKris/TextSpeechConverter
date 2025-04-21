import { MailService } from '@sendgrid/mail';
import { User } from '@shared/schema';

// Check if SendGrid API key is set
const apiKey = process.env.SENDGRID_API_KEY;
const mailService = new MailService();

if (apiKey) {
  mailService.setApiKey(apiKey);
  console.log('SendGrid API key is configured');
} else {
  console.warn('SendGrid API key is not set. Email functionality will be disabled.');
}

// Email templates
const templates = {
  welcome: (user: User, _: any = undefined) => ({
    subject: 'Welcome to VoiceDoc!',
    text: `Hi ${user.username},\n\nWelcome to VoiceDoc! We're excited to have you on board.\n\nYou now have unlimited access to our text-to-speech conversion tools. Get started by uploading your first document or text.\n\nBest regards,\nThe VoiceDoc Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to VoiceDoc!</h2>
        <p>Hi ${user.username},</p>
        <p>Welcome to VoiceDoc! We're excited to have you on board.</p>
        <p>You now have unlimited access to our text-to-speech conversion tools. Get started by uploading your first document or text.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.APP_URL || 'https://voicedoc.app'}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Converting</a>
        </div>
        <p>Best regards,<br>The VoiceDoc Team</p>
      </div>
    `
  }),
  
  conversionComplete: (user: User, conversionId: number = 0) => ({
    subject: 'Your Text-to-Speech Conversion is Complete',
    text: `Hi ${user.username},\n\nYour text-to-speech conversion is complete and ready for download. You can access it from your conversion history.\n\nBest regards,\nThe VoiceDoc Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Conversion Complete!</h2>
        <p>Hi ${user.username},</p>
        <p>Your text-to-speech conversion is complete and ready for download.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.APP_URL || 'https://voicedoc.app'}/history" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Conversion</a>
        </div>
        <p>Best regards,<br>The VoiceDoc Team</p>
      </div>
    `
  })
};

/**
 * Send an email to a user
 */
export async function sendEmail(
  user: User, 
  templateName: keyof typeof templates, 
  additionalData: any = {}
): Promise<boolean> {
  // If API key is not set or user has no email, return false
  if (!apiKey || !user.email) {
    return false;
  }
  
  try {
    // Get the template and generate the email content
    const templateFn = templates[templateName];
    const emailContent = templateFn(user, additionalData.conversionId);
    
    // Send the email
    await mailService.send({
      to: user.email,
      from: process.env.EMAIL_FROM || 'noreply@voicedoc.app',
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });
    
    console.log(`Email sent to ${user.email} using template: ${templateName}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}
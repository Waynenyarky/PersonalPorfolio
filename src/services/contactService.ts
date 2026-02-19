import { CONTACT_EMAIL } from '../constants/contact';

export interface ContactFormData {
    full_name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
  }
  
  export interface Status {
    type: 'success' | 'error' | '';
    message: string;
  }
  
  export const sendContactMessage = async (
    formData: ContactFormData
  ): Promise<Status> => {
    if (!formData.full_name || !formData.email || !formData.subject || !formData.message) {
      return { type: 'error', message: 'Please fill in all fields' };
    }

    const currentTime = new Date().toLocaleString();
    const recipientEmail = CONTACT_EMAIL;

    // Try EmailJS first
    try {
      // Get EmailJS configuration from environment variables (must be set in .env)
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const userId = import.meta.env.VITE_EMAILJS_USER_ID;

      // Validate that all EmailJS variables are set
      if (!serviceId || !templateId || !userId) {
        console.warn('EmailJS configuration incomplete. Missing:', {
          serviceId: !serviceId,
          templateId: !templateId,
          userId: !userId,
        });
        throw new Error('EmailJS configuration missing - falling back to Web3Forms');
      }

      if (import.meta.env.DEV) {
        console.log('Using EmailJS Template ID:', templateId);
      }

      // Prepare template parameters - these should match your EmailJS template variables
      const templateParams = {
        to_email: recipientEmail,
        to_name: 'John Wayne Enrique',
        from_name: formData.full_name,
        from_email: formData.email,
        reply_to: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.phone || 'Not provided',
        time: currentTime,
        // Additional common EmailJS parameters
        user_name: formData.full_name,
        user_email: formData.email,
        full_name: formData.full_name,
        email: formData.email,
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId, // Using VITE_EMAILJS_TEMPLATE_ID from .env
          user_id: userId,
          template_params: templateParams,
        }),
      });

      if (response.ok) {
        // Email sent successfully via EmailJS
        await response.json();
        return {
          type: 'success',
          message: "Message sent successfully! We'll get back to you soon.",
        };
      }

      // EmailJS failed - check if it's a 412 (Gmail connection expired)
      const errorText = await response.text();
      if (import.meta.env.DEV) {
        console.warn('EmailJS failed, falling back to Web3Forms:', { status: response.status, error: errorText });
      }

      if (response.status === 412) {
        // Fall through to Web3Forms fallback below
      } else {
        throw new Error(`EmailJS API error: ${response.status}`);
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.warn('EmailJS error, falling back to Web3Forms:', error);
      }
      // Fall through to Web3Forms fallback below
    }

    // Fallback to Web3Forms if EmailJS fails
    try {
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      
      if (!web3formsKey) {
        return {
          type: 'error',
          message: CONTACT_EMAIL ? `Email service not configured. Please contact us directly at ${CONTACT_EMAIL}` : 'Email service not configured. Please use the contact form or try again later.',
        };
      }

      // Format the email message as HTML
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${formData.full_name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Submitted:</strong> ${currentTime}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #555;">${formData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888;">
            <p>This message was sent from your portfolio contact form.</p>
            <p>You can reply directly to: ${formData.email}</p>
          </div>
        </div>
      `;

      const web3formsPayload = {
        access_key: web3formsKey,
        subject: `Contact Form: ${formData.subject}`,
        from_name: formData.full_name,
        email: formData.email,
        message: emailHtml,
        to: recipientEmail,
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(web3formsPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (import.meta.env.DEV) {
          console.error('Web3Forms Error:', { status: response.status, error: errorData });
        }
        throw new Error(`Web3Forms API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          type: 'success',
          message: "Message sent successfully! We'll get back to you soon.",
        };
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Both EmailJS and Web3Forms failed:', error);
      }
      return {
        type: 'error',
        message: CONTACT_EMAIL ? `Failed to send message. Please try emailing us directly at ${CONTACT_EMAIL}` : 'Failed to send message. Please try again later.',
      };
    }
  };
  
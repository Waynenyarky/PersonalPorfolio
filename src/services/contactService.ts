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
  
    try {
      const currentTime = new Date().toLocaleString(); // auto detect system time
  
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_m7ykss8',
          template_id: 'template_fshd90d',
          user_id: 'v1xoUuWEvGXh6S5GO',
          template_params: {
            to_email: 'joma.enrique.up@phinmaed.com',
            full_name: formData.full_name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            phone: formData.phone ?? '',
            reply_to: formData.email,
            time: currentTime,
          },
        }),
      });
  
      if (response.ok) {
        return {
          type: 'success',
          message: "Message sent successfully! We'll get back to you soon.",
        };
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      return {
        type: 'error',
        message: 'Failed to send message. Please try emailing us directly at support@mycrewmanager.com',
      };
    }
  };
  
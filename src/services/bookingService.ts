export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectDescription: string;
  timeline: string;
  budget?: string;
  preferredContact: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalNotes?: string;
}

export interface Status {
  type: 'success' | 'error' | '';
  message: string;
  emailSent?: boolean;
  serverError?: boolean;
}

export const submitBooking = async (
  formData: BookingFormData
): Promise<Status> => {
  if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.projectDescription || !formData.timeline || !formData.preferredContact) {
    return { type: 'error', message: 'Please fill in all required fields' };
  }

  try {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${apiBase}/api/bookings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || '',
        project_type: formData.projectType,
        project_description: formData.projectDescription,
        timeline: formData.timeline,
        budget: formData.budget || '',
        preferred_contact: formData.preferredContact,
        preferred_date: formData.preferredDate || null,
        preferred_time: formData.preferredTime || null,
        additional_notes: formData.additionalNotes || '',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        type: 'success',
        message: "Booking submitted successfully! We'll contact you soon to discuss your project.",
        emailSent: data.email_sent !== false,
      };
    } else {
      // Server responded but with an error status
      const errorData = await response.json().catch(() => ({}));
      return {
        type: 'error',
        message: errorData.detail || 'Unable to submit booking. Please try again later.',
        serverError: false,
      };
    }
  } catch (error: any) {
    // Check if it's a network/server error (no response from server)
    const isNetworkError = 
      error?.message?.toLowerCase().includes('failed to fetch') ||
      error?.message?.toLowerCase().includes('networkerror') ||
      error?.message?.toLowerCase().includes('network error') ||
      error?.message?.toLowerCase().includes('load failed') ||
      error?.name === 'TypeError' ||
      error?.name === 'NetworkError' ||
      error?.code === 'ERR_NETWORK' ||
      error?.code === 'ECONNABORTED';
    
    if (isNetworkError) {
      return {
        type: 'error',
        message: 'Service not available right now. Please try again later.',
        serverError: true,
      };
    }
    
    // For other errors, show user-friendly message
    return {
      type: 'error',
      message: 'Unable to submit booking at this time. Please try again later or contact us directly at joma.enrique.up@phinmaed.com',
      serverError: false,
    };
  }
};


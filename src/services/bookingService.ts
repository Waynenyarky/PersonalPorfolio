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
      return {
        type: 'success',
        message: "Booking submitted successfully! We'll contact you soon to discuss your project.",
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to submit booking');
    }
  } catch (error: any) {
    return {
      type: 'error',
      message: error?.message || 'Failed to submit booking. Please try emailing us directly at joma.enrique.up@phinmaed.com',
    };
  }
};


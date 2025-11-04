import os
import logging
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Review, Booking
from .serializers import ReviewSerializer, BookingSerializer
import resend
from django.utils import timezone
from .permissions import IsAdminApiKey

logger = logging.getLogger('reviews')


class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        review = serializer.save()
        api_key = os.getenv('RESEND_API_KEY')
        if not api_key:
            logger.warning(f'Resend API key not configured. Review {review.id} created but email not sent.')
            return
        
        try:
            resend.api_key = api_key
            from_sender = os.getenv('RESEND_FROM', 'Portfolio Reviews <noreply@resend.dev>')
            subject = f'New Client Review - Rating: {review.rating}/5'
            text = (
                f'New review submitted\n\n'
                f'Name: {review.name}\n'
                f'Role: {review.role}\n'
                f'Company: {review.company}\n'
                f'Email: {review.email or "N/A"}\n'
                f'Rating: {review.rating}/5\n\n'
                f'Review:\n{review.review}'
            )
            timestamp = (review.created_at or timezone.now()).strftime('%Y%m%d%H%M%S')

            html = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background-color:#e8e8e8; font-family:'Segoe UI', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e8e8; padding:50px 0;">
            <tr>
            <td align="center">
                
                <!-- Main Email Container -->
                <table width="650" cellpadding="0" cellspacing="0" style="background-color:#ffffff; box-shadow:0 4px 24px rgba(0,0,0,0.12); border:1px solid #d0d0d0;">
                
                <!-- Executive Header -->
                <tr>
                    <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="padding:36px 50px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="vertical-align:middle;">
                                <div style="border-left:5px solid #ff6600; padding-left:18px;">
                                    <h1 style="margin:0; padding:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.4px; line-height:1.2;">PORTFOLIO REVIEWS</h1>
                                    <p style="margin:6px 0 0 0; padding:0; color:#808080; font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;">Enterprise Management Platform</p>
                                </div>
                                </td>
                                <td align="right" style="vertical-align:middle;">
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                    <td style="background-color:#ff6600; padding:10px 22px; border-radius:2px;">
                                        <span style="color:#ffffff; font-size:10px; font-weight:800; letter-spacing:1.2px;">PRIORITY</span>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                
                <!-- Status Bar -->
                <tr>
                    <td style="background-color:#ff6600; padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="padding:16px 50px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="vertical-align:middle;">
                                <span style="display:inline-block; width:10px; height:10px; background-color:#ffffff; border-radius:50%; margin-right:14px; vertical-align:middle;"></span>
                                <span style="color:#ffffff; font-size:13px; font-weight:700; vertical-align:middle; letter-spacing:0.3px;">NEW CLIENT REVIEW SUBMISSION</span>
                                </td>
                                <td align="right" style="vertical-align:middle;">
                                 <span style="color:#ffffff; font-size:11px; font-weight:600; letter-spacing:0.5px; opacity:0.95;">REF #REV-{timestamp}</span>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                    <td style="padding:48px 50px;">
                    
                    <!-- Document Header -->
                    <div style="margin-bottom:40px; padding-bottom:24px; border-bottom:2px solid #000000;">
                        <h2 style="margin:0 0 10px 0; padding:0; color:#000000; font-size:28px; font-weight:700; line-height:1.2; letter-spacing:-0.6px;">Client Review Documentation</h2>
                        <p style="margin:0; padding:0; color:#666666; font-size:13px; line-height:1.5; font-weight:500;">
                        Official notification of new client feedback submission via portfolio platform.
                        </p>
                    </div>
                    
                    <!-- Client Profile Section -->
                    <div style="margin-bottom:36px;">
                        <div style="background-color:#000000; padding:16px 28px; margin-bottom:2px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                            <td>
                                <h3 style="margin:0; padding:0; color:#ffffff; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase;">Section I — Client Profile</h3>
                            </td>
                            <td align="right">
                                <span style="color:#ff6600; font-size:10px; font-weight:700; letter-spacing:1px;">VERIFIED</span>
                            </td>
                            </tr>
                        </table>
                        </div>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #000000;">
                        <tr>
                            <td colspan="3" style="padding:0; background-color:#fafafa; border-bottom:1px solid #e0e0e0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="padding:22px 28px; width:220px; background-color:#f5f5f5; border-right:2px solid #000000; vertical-align:top;">
                                    <span style="color:#000000; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:8px;">Legal Name</span>
                                    <span style="color:#1a1a1a; font-size:16px; font-weight:600; line-height:1.3; display:block;">{review.name}</span>
                                </td>
                                <td style="padding:22px 28px; background-color:#ffffff; vertical-align:top;">
                                    <span style="color:#000000; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:8px;">Professional Designation</span>
                                    <span style="color:#1a1a1a; font-size:16px; font-weight:600; line-height:1.3; display:block;">{review.role}</span>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding:0; background-color:#fafafa; border-bottom:1px solid #e0e0e0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="padding:22px 28px; width:220px; background-color:#f5f5f5; border-right:2px solid #000000; vertical-align:top;">
                                    <span style="color:#000000; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:8px;">Organization</span>
                                    <span style="color:#1a1a1a; font-size:16px; font-weight:600; line-height:1.3; display:block;">{review.company}</span>
                                </td>
                                <td style="padding:22px 28px; background-color:#ffffff; vertical-align:top;">
                                    <span style="color:#000000; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:8px;">Contact Information</span>
                                    <span style="color:#1a1a1a; font-size:16px; font-weight:600; line-height:1.3; display:block;">{review.email or 'Not Disclosed'}</span>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:22px 28px; background-color:#f5f5f5; border-right:2px solid #000000; vertical-align:middle;">
                            <span style="color:#000000; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Performance Rating</span>
                            </td>
                            <td style="padding:22px 28px; background-color:#ffffff; vertical-align:middle;">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="background-color:#000000; padding:14px 26px; border-radius:3px; border:3px solid #ff6600;">
                                    <span style="color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.5px;">{review.rating}</span>
                                    <span style="color:#ff6600; font-size:16px; font-weight:600;"> / 5.0</span>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </div>
                    
                    <!-- Review Content Section -->
                    <div style="margin-bottom:0;">
                        <div style="background-color:#000000; padding:16px 28px; margin-bottom:2px;">
                        <h3 style="margin:0; padding:0; color:#ffffff; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase;">Section II — Client Testimonial</h3>
                        </div>
                        
                        <div style="border:2px solid #000000; background-color:#ffffff; position:relative;">
                        <div style="position:absolute; left:0; top:0; bottom:0; width:6px; background-color:#ff6600;"></div>
                        <div style="padding:36px 36px 36px 48px;">
                            <p style="margin:0; padding:0; color:#1a1a1a; font-size:15px; line-height:1.9; white-space:pre-wrap; font-weight:400; text-align:justify;">{review.review}</p>
                        </div>
                        </div>
                    </div>
                    
                    </td>
                </tr>
                
                <!-- Document Footer -->
                <tr>
                    <td style="background-color:#000000; padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="padding:36px 50px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding-bottom:20px; border-bottom:1px solid #2a2a2a;">
                                <p style="margin:0 0 8px 0; padding:0; color:#b3b3b3; font-size:12px; line-height:1.7; font-weight:400;">
                                    This document constitutes an automated notification generated by the Portfolio Reviews Enterprise Management Platform. This communication channel is system-monitored and does not accept replies.
                                </p>
                                <p style="margin:0; padding:0; color:#808080; font-size:11px; line-height:1.6; font-weight:400; font-style:italic;">
                                    All content herein is confidential and proprietary. Unauthorized disclosure, distribution, or reproduction is strictly prohibited.
                                </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top:24px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                    <td style="vertical-align:middle;">
                                        <span style="color:#666666; font-size:11px; font-weight:600; letter-spacing:0.5px;">© 2025 Portfolio Reviews System</span>
                                    </td>
                                    <td align="right" style="vertical-align:middle;">
                                        <span style="color:#666666; font-size:10px; font-weight:600; letter-spacing:0.8px;">CONFIDENTIAL & PROPRIETARY</span>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                
                </table>
                
                <!-- Legal Disclaimer -->
                <table width="650" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:28px 30px; text-align:center; background-color:#f5f5f5; border:1px solid #d0d0d0; border-top:none;">
                    <p style="margin:0; color:#808080; font-size:10px; line-height:1.6; font-weight:500;">
                        This electronic transmission contains privileged and confidential information intended exclusively for the designated recipient(s).<br>
                        Unauthorized interception, review, use, disclosure, or distribution is strictly prohibited and may be unlawful.
                    </p>
                    </td>
                </tr>
                </table>
                
            </td>
            </tr>
        </table>
        </body>
        </html>
        """

            resend.Emails.send({
                'from': from_sender,
                'to': 'joma.enrique.up@phinmaed.com',
                'subject': subject,
                'text': text,
                'html': html,
            })
            logger.info(f'Email notification sent successfully for review {review.id} (REF #REV-{timestamp})')
        
        except resend.exceptions.ResendError as e:
            logger.error(
                f'Resend API error for review {review.id}: {str(e)}. '
                f'Review was saved successfully but email notification failed.',
                exc_info=True
            )
        except (ConnectionError, TimeoutError) as e:
            logger.error(
                f'Network error sending email for review {review.id}: {str(e)}. '
                f'Review was saved successfully but email notification failed.',
                exc_info=True
            )
        except Exception as e:
            logger.error(
                f'Unexpected error sending email for review {review.id}: {str(e)}. '
                f'Review was saved successfully but email notification failed.',
                exc_info=True
            )


class ReviewDestroyView(generics.DestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminApiKey]


class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        booking = serializer.save()
        api_key = os.getenv('RESEND_API_KEY')
        if not api_key:
            logger.warning(f'Resend API key not configured. Booking {booking.id} created but email not sent.')
            return
        
        try:
            resend.api_key = api_key
            from_sender = os.getenv('RESEND_FROM', 'Portfolio Bookings <noreply@resend.dev>')
            subject = f'New Client Booking: {booking.project_type}'
            timestamp = (booking.created_at or timezone.now()).strftime('%Y%m%d%H%M%S')
            
            # Format date and time for display
            preferred_date_str = booking.preferred_date.strftime('%B %d, %Y') if booking.preferred_date else 'Not specified'
            preferred_time_str = booking.preferred_time.strftime('%I:%M %p') if booking.preferred_time else 'Not specified'
            
            # Map project types and timelines to readable format
            project_type_map = {
                'web-app': 'Web Application',
                'mobile-app': 'Mobile Application',
                'e-commerce': 'E-Commerce Platform',
                'landing-page': 'Landing Page',
                'api-development': 'API Development',
                'database-design': 'Database Design',
                'ui-ux-design': 'UI/UX Design',
                'full-stack': 'Full-Stack Development',
                'maintenance': 'Maintenance & Support',
                'consulting': 'Consulting',
                'other': 'Other'
            }
            
            timeline_map = {
                'asap': 'ASAP / Urgent',
                '1-month': '1 Month',
                '2-3-months': '2-3 Months',
                '3-6-months': '3-6 Months',
                '6-months-plus': '6+ Months',
                'flexible': 'Flexible'
            }
            
            budget_map = {
                'under-1k': 'Under $1,000',
                '1k-5k': '$1,000 - $5,000',
                '5k-10k': '$5,000 - $10,000',
                '10k-25k': '$10,000 - $25,000',
                '25k-50k': '$25,000 - $50,000',
                '50k-plus': '$50,000+',
                'discuss': 'Prefer to discuss'
            }
            
            contact_map = {
                'email': 'Email',
                'phone': 'Phone Call',
                'video': 'Video Call',
                'meeting': 'In-Person Meeting'
            }
            
            project_type_display = project_type_map.get(booking.project_type, booking.project_type)
            timeline_display = timeline_map.get(booking.timeline, booking.timeline)
            budget_display = budget_map.get(booking.budget, booking.budget) if booking.budget else 'Not specified'
            contact_display = contact_map.get(booking.preferred_contact, booking.preferred_contact)

            html = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:'Segoe UI', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:50px 0;">
            <tr>
            <td align="center">
                
                <!-- Main Email Container -->
                <table width="650" cellpadding="0" cellspacing="0" style="background-color:#ffffff; box-shadow:0 2px 16px rgba(0,0,0,0.08); border:1px solid #e0e0e0;">
                
                <!-- Executive Header -->
                <tr>
                    <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="padding:40px 50px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="vertical-align:middle;">
                                <div style="border-left:4px solid #ff6b35; padding-left:20px;">
                                    <h1 style="margin:0; padding:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.5px; line-height:1.2;">CLIENT BOOKING</h1>
                                    <p style="margin:8px 0 0 0; padding:0; color:#999999; font-size:11px; font-weight:600; letter-spacing:1.8px; text-transform:uppercase;">Consultation Request</p>
                                </div>
                                </td>
                                <td align="right" style="vertical-align:middle;">
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                    <td style="background-color:#ff6b35; padding:12px 24px; border-radius:4px;">
                                        <span style="color:#ffffff; font-size:11px; font-weight:800; letter-spacing:1.5px;">NEW</span>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                
                <!-- Status Bar -->
                <tr>
                    <td style="background-color:#ff6b35; padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="padding:18px 50px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="vertical-align:middle;">
                                <span style="display:inline-block; width:10px; height:10px; background-color:#ffffff; border-radius:50%; margin-right:14px; vertical-align:middle;"></span>
                                <span style="color:#ffffff; font-size:13px; font-weight:700; vertical-align:middle; letter-spacing:0.5px;">NEW CLIENT BOOKING REQUEST</span>
                                </td>
                                <td align="right" style="vertical-align:middle;">
                                <span style="color:#ffffff; font-size:11px; font-weight:600; letter-spacing:0.8px; opacity:0.95;">REF #BK-{timestamp}</span>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                    <td style="padding:50px 50px;">
                    
                    <!-- Document Header -->
                    <div style="margin-bottom:40px; padding-bottom:24px; border-bottom:3px solid #000000;">
                        <h2 style="margin:0 0 12px 0; padding:0; color:#000000; font-size:30px; font-weight:700; line-height:1.2; letter-spacing:-0.8px;">Client Booking Documentation</h2>
                        <p style="margin:0; padding:0; color:#666666; font-size:14px; line-height:1.6; font-weight:500;">
                        Official notification of new client booking request via portfolio platform.
                        </p>
                    </div>
                    
                    <!-- Client Information Section -->
                    <div style="margin-bottom:40px;">
                        <div style="background-color:#000000; padding:18px 28px; margin-bottom:0;">
                        <h3 style="margin:0; padding:0; color:#ffffff; font-size:11px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase;">Section I — Client Information</h3>
                        </div>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #000000; border-top:none;">
                        <tr>
                            <td colspan="2" style="padding:0; background-color:#fafafa; border-bottom:1px solid #e5e5e5;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="padding:24px 28px; width:220px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:top;">
                                    <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; display:block; margin-bottom:10px;">Full Name</span>
                                    <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{booking.name}</span>
                                </td>
                                <td style="padding:24px 28px; background-color:#ffffff; vertical-align:top;">
                                    <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; display:block; margin-bottom:10px;">Contact Email</span>
                                    <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{booking.email}</span>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding:0; background-color:#fafafa;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="padding:24px 28px; width:220px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:top;">
                                    <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; display:block; margin-bottom:10px;">Phone Number</span>
                                    <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{booking.phone}</span>
                                </td>
                                <td style="padding:24px 28px; background-color:#ffffff; vertical-align:top;">
                                    <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; display:block; margin-bottom:10px;">Company</span>
                                    <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{booking.company or 'Not specified'}</span>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </div>
                    
                    <!-- Project Details Section -->
                    <div style="margin-bottom:40px;">
                        <div style="background-color:#000000; padding:18px 28px; margin-bottom:0;">
                        <h3 style="margin:0; padding:0; color:#ffffff; font-size:11px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase;">Section II — Project Details</h3>
                        </div>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #000000; border-top:none;">
                        <tr>
                            <td style="padding:24px 28px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:middle; width:220px;">
                            <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px;">Project Type</span>
                            </td>
                            <td style="padding:24px 28px; background-color:#ffffff; vertical-align:middle;">
                            <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{project_type_display}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 28px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px;">Timeline</span>
                            </td>
                            <td style="padding:24px 28px; background-color:#ffffff; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{timeline_display}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 28px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px;">Budget Range</span>
                            </td>
                            <td style="padding:24px 28px; background-color:#ffffff; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{budget_display}</span>
                            </td>
                        </tr>
                        </table>
                    </div>
                    
                    <!-- Project Description Section -->
                    <div style="margin-bottom:40px;">
                        <div style="background-color:#000000; padding:18px 28px; margin-bottom:0;">
                        <h3 style="margin:0; padding:0; color:#ffffff; font-size:11px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase;">Section III — Project Description</h3>
                        </div>
                        
                        <div style="border:2px solid #000000; border-top:none; background-color:#ffffff; position:relative;">
                        <div style="position:absolute; left:0; top:0; bottom:0; width:5px; background-color:#ff6b35;"></div>
                        <div style="padding:32px 32px 32px 42px;">
                            <p style="margin:0; padding:0; color:#1a1a1a; font-size:15px; line-height:1.8; white-space:pre-wrap; font-weight:400; text-align:justify;">{booking.project_description}</p>
                        </div>
                        </div>
                    </div>
                    
                    <!-- Contact Preferences Section -->
                    <div style="margin-bottom:0;">
                        <div style="background-color:#000000; padding:18px 28px; margin-bottom:0;">
                        <h3 style="margin:0; padding:0; color:#ffffff; font-size:11px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase;">Section IV — Contact Preferences</h3>
                        </div>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #000000; border-top:none;">
                        <tr>
                            <td style="padding:24px 28px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:middle; width:220px;">
                            <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px;">Preferred Contact</span>
                            </td>
                            <td style="padding:24px 28px; background-color:#ffffff; vertical-align:middle;">
                            <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{contact_display}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 28px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px;">Preferred Date</span>
                            </td>
                            <td style="padding:24px 28px; background-color:#ffffff; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{preferred_date_str}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 28px; background-color:#f9f9f9; border-right:2px solid #e5e5e5; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#000000; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px;">Preferred Time</span>
                            </td>
                            <td style="padding:24px 28px; background-color:#ffffff; vertical-align:middle; border-top:1px solid #e5e5e5;">
                            <span style="color:#1a1a1a; font-size:17px; font-weight:600; line-height:1.4; display:block;">{preferred_time_str}</span>
                            </td>
                        </tr>
                        </table>
                    </div>
                    
                    {booking.additional_notes and f'''
                    <!-- Additional Notes Section -->
                    <div style="margin-top:40px;">
                        <div style="background-color:#000000; padding:18px 28px; margin-bottom:0;">
                        <h3 style="margin:0; padding:0; color:#ffffff; font-size:11px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase;">Section V — Additional Notes</h3>
                        </div>
                        
                        <div style="border:2px solid #000000; border-top:none; background-color:#ffffff; position:relative;">
                        <div style="position:absolute; left:0; top:0; bottom:0; width:5px; background-color:#ff6b35;"></div>
                        <div style="padding:32px 32px 32px 42px;">
                            <p style="margin:0; padding:0; color:#1a1a1a; font-size:15px; line-height:1.8; white-space:pre-wrap; font-weight:400; text-align:justify;">{booking.additional_notes}</p>
                        </div>
                        </div>
                    </div>
                    ''' or ''}
                    
                    </td>
                </tr>
                
                <!-- Document Footer -->
                <tr>
                    <td style="background-color:#000000; padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="padding:40px 50px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding-bottom:24px; border-bottom:1px solid #333333;">
                                <p style="margin:0 0 10px 0; padding:0; color:#b3b3b3; font-size:12px; line-height:1.7; font-weight:400;">
                                    This document constitutes an automated notification generated by the Portfolio Bookings Management Platform. This communication channel is system-monitored and does not accept replies.
                                </p>
                                <p style="margin:0; padding:0; color:#808080; font-size:11px; line-height:1.6; font-weight:400; font-style:italic;">
                                    All content herein is confidential and proprietary. Unauthorized disclosure, distribution, or reproduction is strictly prohibited.
                                </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top:24px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                    <td style="vertical-align:middle;">
                                        <span style="color:#999999; font-size:11px; font-weight:600; letter-spacing:0.5px;">© 2025 Portfolio Bookings System</span>
                                    </td>
                                    <td align="right" style="vertical-align:middle;">
                                        <span style="display:inline-block; padding:6px 14px; background-color:#ff6b35; border-radius:3px;">
                                            <span style="color:#ffffff; font-size:9px; font-weight:700; letter-spacing:1px;">CONFIDENTIAL</span>
                                        </span>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                
                </table>
                
            </td>
            </tr>
        </table>
        </body>
        </html>
        """

            text = f"""New Client Booking Request

Name: {booking.name}
Email: {booking.email}
Phone: {booking.phone}
Company: {booking.company or 'Not specified'}

Project Type: {project_type_display}
Timeline: {timeline_display}
Budget: {budget_display}

Project Description:
{booking.project_description}

Preferred Contact: {contact_display}
Preferred Date: {preferred_date_str}
Preferred Time: {preferred_time_str}

{booking.additional_notes and f'Additional Notes:\n{booking.additional_notes}' or ''}
        """

            resend.Emails.send({
                'from': from_sender,
                'to': 'joma.enrique.up@phinmaed.com',
                'subject': subject,
                'text': text,
                'html': html,
            })
            logger.info(f'Email notification sent successfully for booking {booking.id} (REF #BK-{timestamp})')
        
        except resend.exceptions.ResendError as e:
            logger.error(
                f'Resend API error for booking {booking.id}: {str(e)}. '
                f'Booking was saved successfully but email notification failed.',
                exc_info=True
            )
        except (ConnectionError, TimeoutError) as e:
            logger.error(
                f'Network error sending email for booking {booking.id}: {str(e)}. '
                f'Booking was saved successfully but email notification failed.',
                exc_info=True
            )
        except Exception as e:
            logger.error(
                f'Unexpected error sending email for booking {booking.id}: {str(e)}. '
                f'Booking was saved successfully but email notification failed.',
                exc_info=True
            )


class BookingDestroyView(generics.DestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAdminApiKey]


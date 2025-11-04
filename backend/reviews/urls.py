from django.urls import path
from .views import ReviewListCreateView, ReviewDestroyView, BookingListCreateView, BookingDestroyView

urlpatterns = [
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('reviews/<int:pk>/', ReviewDestroyView.as_view(), name='review-destroy'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', BookingDestroyView.as_view(), name='booking-destroy'),
]


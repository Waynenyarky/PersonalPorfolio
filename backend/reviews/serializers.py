from rest_framework import serializers
from .models import Review, Booking


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'created_at', 'name', 'role', 'company', 'email', 'rating', 'review']

    def validate_rating(self, value: int):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return value


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id', 'created_at', 'name', 'email', 'phone', 'company',
            'project_type', 'project_description', 'timeline', 'budget',
            'preferred_contact', 'preferred_date', 'preferred_time', 'additional_notes'
        ]


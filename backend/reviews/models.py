from django.db import models


class Review(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    rating = models.PositiveSmallIntegerField()
    review = models.TextField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.name} ({self.rating}/5)"


class Booking(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=200, blank=True, null=True)
    project_type = models.CharField(max_length=100)
    project_description = models.TextField()
    timeline = models.CharField(max_length=50)
    budget = models.CharField(max_length=50, blank=True, null=True)
    preferred_contact = models.CharField(max_length=50)
    preferred_date = models.DateField(blank=True, null=True)
    preferred_time = models.TimeField(blank=True, null=True)
    additional_notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.name} - {self.project_type}"


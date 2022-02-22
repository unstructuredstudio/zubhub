from rest_framework.pagination import PageNumberPagination


class NotificationNumberPagination(PageNumberPagination):
    page_size = 15

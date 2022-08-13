from rest_framework.pagination import PageNumberPagination


class ActivitylogNumberPagination(PageNumberPagination):
    page_size = 10
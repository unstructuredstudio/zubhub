from rest_framework.pagination import PageNumberPagination


class CreatorNumberPagination(PageNumberPagination):
    page_size = 20

class CreatorGroupNumberPagination(PageNumberPagination):
    page_size = 20

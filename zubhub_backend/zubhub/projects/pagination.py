from rest_framework.pagination import PageNumberPagination


class ProjectNumberPagination(PageNumberPagination):
    page_size = 6

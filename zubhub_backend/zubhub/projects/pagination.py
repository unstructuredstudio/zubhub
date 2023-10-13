from rest_framework.pagination import PageNumberPagination


class ProjectNumberPagination(PageNumberPagination):
    page_size = 18
    page_size_query_param = 'page_size'
    page_query_param = 'page'
    max_page_size = 50

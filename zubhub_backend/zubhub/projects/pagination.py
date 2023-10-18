from rest_framework.pagination import PageNumberPagination


class ProjectNumberPagination(PageNumberPagination):
    page_size = 18
    # page_size_query_param = 'page_size' #Uncommenting these can customise the page size  
    # page_query_param = 'page'           #i.e no of projects displayed per page
    # max_page_size = 50

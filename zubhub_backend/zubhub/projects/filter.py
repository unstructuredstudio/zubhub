from rest_framework import filters

class ProjectCategoryFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        category_id = request.query_params.get('category_id', None)

        if category_id:
            # Filter Projects based on the 'category_id' query parameter
            queryset = queryset.filter(category=category_id)

        return queryset

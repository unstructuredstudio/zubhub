from django.urls import path

from .views import (
    AddCommentAPIView,
    CategoryListAPIView,
    DeleteCommentAPIView,
    ProjectAutocompleteAPIView,
    ProjectCreateAPIView,
    ProjectDeleteAPIView,
    ProjectDetailsAPIView,
    ProjectListAPIView,
    ProjectRecommendAPIView,
    ProjectSearchAPIView,
    ProjectTagAutocompleteAPIView,
    ProjectTagSearchAPIView,
    ProjectUpdateAPIView,
    SavedProjectsAPIView,
    StaffPickDetailsAPIView,
    StaffPickListAPIView,
    ToggleLikeAPIView,
    ToggleSaveAPIView,
    UnpublishCommentAPIView,
)

app_name = "projects"

urlpatterns = [
    path("", ProjectListAPIView.as_view(), name="list_projects"),
    path(
        "tags/autocomplete/",
        ProjectTagAutocompleteAPIView.as_view(),
        name="autocomplete_tags",
    ),
    path("tags/search/", ProjectTagSearchAPIView.as_view(), name="search_tags"),
    path(
        "autocomplete/",
        ProjectAutocompleteAPIView.as_view(),
        name="autocomplete_projects",
    ),
    path("search/", ProjectSearchAPIView.as_view(), name="search_projects"),
    path("create/", ProjectCreateAPIView.as_view(), name="create_project"),
    path("<uuid:pk>/update/", ProjectUpdateAPIView.as_view(), name="update_project"),
    path("<uuid:pk>/delete/", ProjectDeleteAPIView.as_view(), name="delete_project"),
    path("saved/", SavedProjectsAPIView.as_view(), name="saved_projects"),
    path("<uuid:pk>/toggle-like/", ToggleLikeAPIView.as_view(), name="toggle_like"),
    path("<uuid:pk>/toggle-save/", ToggleSaveAPIView.as_view(), name="toggle_save"),
    path("<uuid:pk>/add-comment/", AddCommentAPIView.as_view(), name="add_comment"),
    path(
        "<int:pk>/unpublish-comment/",
        UnpublishCommentAPIView.as_view(),
        name="unpublish_comment",
    ),
    path(
        "<int:pk>/delete-comment/",
        DeleteCommentAPIView.as_view(),
        name="delete_comment",
    ),
    path("<uuid:pk>/", ProjectDetailsAPIView.as_view(), name="detail_project"),
    path(
        "<uuid:pk>/recommend/",
        ProjectRecommendAPIView.as_view(),
        name="recommend_projects",
    ),
    path("categories/", CategoryListAPIView.as_view(), name="category"),
    path("staff-picks/", StaffPickListAPIView.as_view(), name="staff_picks"),
    path(
        "staff-picks/<uuid:pk>/",
        StaffPickDetailsAPIView.as_view(),
        name="staff_pick_details",
    ),
]

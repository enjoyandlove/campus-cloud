from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.web_app),

    url(r'^login$', views.app_login),

    url(r'^clubs/excel$', views.import_clubs),

    url(r'^events/excel$', views.import_events),

    url(r'^services/excel$', views.import_services),

    url(r'^announcements/import$', views.import_lists),

    url(r'^calendars/items/import$', views.import_events),

]

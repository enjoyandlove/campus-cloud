from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.web_app),

    url(r'^login$', views.app_login),

    url(r'^clubs/excel$', views.clubs_invite),

    url(r'^events/excel$', views.import_excel_event),

    url(r'^services/excel$', views.import_excel_service),
]

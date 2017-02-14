from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.web_app),
    url(r'^login$', views.app_login),
]

from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.web_app),

    url(r'^login$', views.app_login),

    url(r'^clubs/excel$', views.import_clubs),

    url(r'^events/excel$', views.import_events),

    url(r'^services/excel$', views.import_services),

    url(r'^service_providers/excel$', views.import_service_providers),

    url(r'^qr_codes/excel$', views.import_qr_codes),

    url(r'^locations/excel$', views.import_locations),

    url(r'^cases/excel$', views.import_cases),
    
    url(r'^announcements/import$', views.import_lists),

    url(r'^calendars/items/import$', views.import_events),

]

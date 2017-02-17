from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$',views.index, name='index'),
    url(r'^newpost$', views.newpost, name='newpost'),
    url(r'^newcomment$', views.newcomment, name='newcomment')

]
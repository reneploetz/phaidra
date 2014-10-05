from django.conf.urls import patterns, include, url
from django.shortcuts import redirect

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from tastypie.api import Api
#from api.api import TextbookResource, UnitResource, LessonResource, SlideResource, UserResource, CreateUserResource,  SubmissionResource
from api.api import UserResource, CreateUserResource, SubmissionResource
from api.api import WordResource, SentenceResource, DocumentResource, LemmaResource
from api.user import UserSentenceResource, UserDocumentResource
from api.api import VisualizationResource

v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(CreateUserResource())
#v1_api.register(TextbookResource())
#v1_api.register(UnitResource())
#v1_api.register(LessonResource())
#v1_api.register(SlideResource())

v1_api.register(WordResource())
v1_api.register(SentenceResource())
v1_api.register(DocumentResource())
v1_api.register(LemmaResource())

v1_api.register(SubmissionResource())
v1_api.register(VisualizationResource())

v1_api.register(UserDocumentResource())
v1_api.register(UserSentenceResource())

js_info_dict = {
	'packages': ('phaidra',)
}

urlpatterns = patterns('',

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

	url(r'api/', include(v1_api.urls)),

	# Website URLS
	url(r'^home/', 'web.views.home'),
	url(r'^lessons/', 'web.views.lessons'),
	url(r'^create/', 'web.views.create'),
	url(r'^grammar/', 'web.views.grammar'),
	url(r'^module/', 'web.views.module'),
	url(r'^reader/', 'web.views.reader'),
	url(r'^profile/', 'web.views.profile'),
	url(r'^login/', 'web.views.login'),
	url(r'^aboutus/', 'web.views.aboutus'),
	url(r'^data/', 'web.views.data'),

	# JS Localization
	url(r'^templates/(?P<path>\w+)', 'web.views.static'),
	url(r'^jsi8n/$', 'django.views.i18n.javascript_catalog', js_info_dict),

    # front-end logout with javascript disabled does not use the tastypie api logout, but the one of django 
    url(r'^logout/', 'django.contrib.auth.views.logout', {'next_page': '/home'}),
	url(r'^$', 'web.views.index')
)

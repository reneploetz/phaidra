import os
import json
import hashlib

from django.http import HttpResponse
from django.template import RequestContext, loader

def index(request):
	template = loader.get_template('index.html')

	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def home(request): 
	template = loader.get_template('home.html')

	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def lessons(request):
	template = loader.get_template('lessons.html')

	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def create(request):
	template = loader.get_template('create.html')

	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def login(request):
	template = loader.get_template('login.html')

	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def grammar(request):
	template = loader.get_template('grammar.html')
	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def reader(request):
	template = loader.get_template('reader.html')
	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def profile(request):
	template = loader.get_template('profile.html')
	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def aboutus(request):
	template = loader.get_template('aboutus.html')
	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

def module(request):
	template = loader.get_template('module.html')
	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))
def module(request):
	template = loader.get_template('module.html')
	context = RequestContext(request, {
		'email_hash': hashlib.md5(request.user.email).hexdigest() if request.user.is_authenticated() else ''
	})

	return HttpResponse(template.render(context))

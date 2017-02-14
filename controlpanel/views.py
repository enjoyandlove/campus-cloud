from django.shortcuts import render
from django.shortcuts import render_to_response

'''
Shell to serve angular app,
all logic is then worked on the API
'''
def web_app(request):
    return render_to_response("index.html")

'''
Control Panel Login Page
'''
def app_login(request):
    return render_to_response("controlpanel/login.html")


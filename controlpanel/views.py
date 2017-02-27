from openpyxl import load_workbook
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import datetime

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

'''
Parse Excel Mass Invite
'''
@csrf_exempt
def event_invite(request):
    input_excel = request.FILES['file']

    wb = load_workbook(filename = input_excel)

    ws = wb.get_active_sheet()

    event_dict = []

    for row in ws.rows:
        event_info = []
        for col in row:
            if col.value is not None:
                event_info.append(col.value)
        if len(event_info):
            event_dict.append(event_info)

    events = event_dict[1:]
    column_titles = event_dict[:1]

    column_titles = [title.lower() for title in column_titles[0]]

    event_dict = []

    for i in events:
        # all fields are required
        if len(i) is not len(column_titles):
            return JsonResponse({ "error": "All fields are required" }, safe=False, status=500)

        # check date format (2/26/2009 3:00 PM)
        # try:
        #     datetime.datetime.strptime(i[2], '%m/%d/%Y %I:%M %p')
        #     datetime.datetime.strptime(i[3], '%m/%d/%Y %I:%M %p')
        #     i[2].strftime('%m/%d/%Y %I:%M %p')
        #     i[3].strftime('%m/%d/%Y %I:%M %p')
        # except ValueError:
        #     return JsonResponse({ "error": "Incorrect data format" }, safe=False, status=500)
        event_dict.append(dict(zip(column_titles, i)))

    return JsonResponse(json.dumps(event_dict), safe=False)



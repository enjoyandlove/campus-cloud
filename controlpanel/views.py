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

        # end date is not greater than start date
        if i[3] < i[2]:
          return JsonResponse({ "error": "Start date can not be greater than end date" }, safe=False, status=500)

        # start date is not in the past
        if i[2] < datetime.datetime.now():
          return JsonResponse({ "error": "Start date can not be in the past" }, safe=False, status=500)

        # check date time format (2017-05-12 09:00:00)
        try:
          datetime.datetime.strptime(str(i[2]), "%Y-%m-%d %H:%M:%S")
          datetime.datetime.strptime(str(i[3]), "%Y-%m-%d %H:%M:%S")
        except ValueError:
          return JsonResponse({ "error": "Invalid date format" }, safe=False, status=500)

        i[2] = str(i[2])
        i[3] = str(i[3])

        event_dict.append(dict(zip(column_titles, i)))

    return JsonResponse(json.dumps(event_dict), safe=False)



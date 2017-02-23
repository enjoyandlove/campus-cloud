from openpyxl import load_workbook
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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

    for item in range(1,7):
        if not ws.cell(row=1, column=item).value:
            ws.cell(row=1, column=item).value = "some text"

    cols = ws.columns

    for i in cols:
        print(i)

    # col_title    = cols[1]            #event title
    # col_desc     = cols[2]            #event description
    # col_start    = cols[3]            #event start
    # col_end      = cols[4]            #event end
    # col_location = cols[5]            #event location
    # col_room     = cols[6]            #event room
    print(cols)
    # print(request.body)
    return JsonResponse({'foo': 'bar'})


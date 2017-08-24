import io
import csv
import json
import datetime

from django.shortcuts import render_to_response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect

from controlpanel.utils.csv_parser import CSVParser

DECODE_ERROR = 'Unable to parse data in file'


def handle_404(request):
  return HttpResponseRedirect("/")

'''
Shell to serve angular app
'''
def web_app(request):
    return render_to_response("index.html")


'''
Control Panel Login Page
'''
def app_login(request):
    return render_to_response("controlpanel/login.html")


'''
Parse Mass Event Invite
'''
@csrf_exempt
def import_events(request):
    print('ehh')
    csv_file = request.FILES['file']
    csv_as_string = ''

    for index, row in enumerate(csv_file):
        try:
            csv_as_string += row.decode('utf-8')
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)


    io_string = io.StringIO(csv_as_string)

    parser = CSVParser(io_string)

    try:
        parsed_data = parser.all_fields_required('title', 'start_date', 'end_date')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]},
                                safe=False, status=400)


    for item in parsed_data:
        date_columns = ['start_date', 'end_date']

        for column in date_columns:
            if parser.validate_date_format(item[column]) is not None:
                return JsonResponse({"error": '%s not in valid format' % column},
                                    safe=False, status=400)


        if parser.date_not_in_past(item['start_date']) is False:
            return JsonResponse({"error": 'Start date can not be in the past'},
                                safe=False, status=400)


        if parser.future_dates_is_greater_than_past(item['end_date'],
                                                    item['start_date']) is False:
            return JsonResponse({"error": 'Start date can not be greater than end date'},
                                safe=False, status=400)


    return JsonResponse(json.dumps(parsed_data), safe=False)


'''
Parse Mass Announcements Import
'''
@csrf_exempt
def import_lists(request):
    csv_file = request.FILES['file']

    csv_as_string = ''

    for index, row in enumerate(csv_file):
        try:
            csv_as_string += row.decode('utf-8')
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)


    io_string = io.StringIO(csv_as_string)

    parser = CSVParser(io_string)

    try:
        parsed_data = parser.all_fields_required('email')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]},
                                safe=False, status=400)

    return JsonResponse(parsed_data, safe=False)


'''
Parse Clubs Mass Upload
'''
@csrf_exempt
def import_clubs(request):
    csv_file = request.FILES['file']

    csv_as_string = ''

    for index, row in enumerate(csv_file):
        try:
            csv_as_string += row.decode('utf-8')
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)


    io_string = io.StringIO(csv_as_string)

    parser = CSVParser(io_string)

    try:
        parsed_data = parser.all_fields_required('name')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]},
                                safe=False, status=400)

    return JsonResponse(json.dumps(parsed_data), safe=False)


'''
Parse Services Mass Upload
'''
@csrf_exempt
def import_services(request):
    csv_file = request.FILES['file']

    csv_as_string = ''

    for index, row in enumerate(csv_file):
        try:
            csv_as_string += row.decode('utf-8')
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)


    io_string = io.StringIO(csv_as_string)

    parser = CSVParser(io_string)

    try:
        parsed_data = parser.all_fields_required('service_name')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]},
                                safe=False, status=400)

    return JsonResponse(json.dumps(parsed_data), safe=False)

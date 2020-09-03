import io
import csv
import json
import datetime

from bs4 import UnicodeDammit
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect

from controlpanel.utils.encoding import is_ascii
from controlpanel.utils.csv_parser import CSVParser

DECODE_ERROR = 'Unable to parse data in file'


def handle_404(request):
  return HttpResponseRedirect("/")

'''
Shell to serve angular app
'''
def web_app(request):
    return render(request, "index.html")


'''
Control Panel Login Page
'''
def app_login(request):
    return render(request, "controlpanel/login.html")


'''
Parse Mass Event Invite
'''
@csrf_exempt
def import_events(request):
    time_zone = request.POST['tz']
    csv_file = request.FILES['file']
    column_names = ['Title', 'Description', 'Start_Date', 'End_Date', 'Location', 'Room']

    csv_as_string = []
    for index, row in enumerate(csv_file):
        if index == 0:
            file_columns = [col for col in UnicodeDammit(row).unicode_markup.strip('\r\n').split(',')]

            if column_names != file_columns:
                return JsonResponse({"error": "Wrong Column Names"}, safe=False, status=400)
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)

    parser = CSVParser(csv_as_string)

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

            item[column] = parser.date_str_to_formated_date(item[column])


        if parser.date_not_in_past(item['start_date'], time_zone) is False:
            error = '{} Start date can not be in the past'.format(item['title'])

            return JsonResponse({"error": error}, safe=False, status=400)


        if parser.future_dates_is_greater_than_past(item['end_date'],
                                                    item['start_date'], time_zone) is False:
            error = '{} Start date can not be greater than end date'.format(item['title'])
            return JsonResponse({"error": error}, safe=False, status=400)

    return JsonResponse(json.dumps(parsed_data), safe=False)


'''
Parse Mass Announcements Import
'''
@csrf_exempt
def import_lists(request):
    csv_file = request.FILES['file']

    csv_as_string = []

    for index, row in enumerate(csv_file):
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)


    parser = CSVParser(csv_as_string)

    try:
        parsed_data = parser.all_fields_required('email', data_len=10000)
        user_emails = [k["email"] for k in parsed_data]
        for idx, user_email in enumerate(user_emails):
            if not is_ascii(user_email) or len(user_email.split()) > 1:
                raise KeyError("Invalid email on line {}".format(idx + 1))
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
    column_names = ['Club Name', 'Description', 'Email', 'Phone Number', 'Website']

    csv_as_string = []

    for index, row in enumerate(csv_file):
        if index == 0:
            file_columns = [col for col in UnicodeDammit(row).unicode_markup.strip('\r\n').split(',')]

        if column_names != file_columns:
            return JsonResponse({"error": "Wrong Column Names"}, safe=False, status=400)
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)

    parser = CSVParser(csv_as_string)

    try:
        parsed_data = parser.all_fields_required('club_name')
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

    csv_as_string = []

    for index, row in enumerate(csv_file):
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)

    parser = CSVParser(csv_as_string)

    try:
        parsed_data = parser.all_fields_required('service_name')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]},
                                safe=False, status=400)

    return JsonResponse(json.dumps(parsed_data), safe=False)

'''
Parse Service Providers Mass Upload
'''
@csrf_exempt
def import_service_providers(request):
    csv_file = request.FILES['file']

    csv_as_string = []

    for index, row in enumerate(csv_file):
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)

    parser = CSVParser(csv_as_string)

    try:
        parsed_data = parser.all_fields_required('provider_name', 'email')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]}, safe=False, status=400)

    for item in parsed_data:
        if 'has_checkout' in item:
            item['has_checkout'] = item['has_checkout'].lower() == 'true'

    return JsonResponse(json.dumps(parsed_data), safe=False)

'''
Parse QR Codes Mass Upload
'''
@csrf_exempt
def import_qr_codes(request):
    csv_file = request.FILES['file']

    csv_as_string = []

    for index, row in enumerate(csv_file):
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)

    parser = CSVParser(csv_as_string)

    try:
        parsed_data = parser.all_fields_required('name', data_len=1000)
    except KeyError as e:
        return JsonResponse({"error": e.args[0]}, safe=False, status=400)

    for item in parsed_data:
        item['provider_name'] = item.pop('name')
        if 'has_checkout' in item:
            item['has_checkout'] = item['has_checkout'].lower() == 'true'

    return JsonResponse(json.dumps(parsed_data), safe=False)

'''
Parse Locations Mass Upload
'''
@csrf_exempt
def import_locations(request):
    csv_file = request.FILES['file']

    csv_as_string = []

    for index, row in enumerate(csv_file):
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)

    parser = CSVParser(csv_as_string)
    try:
        parsed_data = parser.all_fields_required('location_name', 'category', 'latitude', 'longitude')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]}, safe=False, status=400)

    for item in parsed_data:
        item['name'] = item.pop('location_name')

    return JsonResponse(json.dumps(parsed_data), safe=False)

'''
Parse Cases Mass Upload
'''
@csrf_exempt
def import_cases(request):
    csv_file = request.FILES['file']

    csv_as_string = []

    for index, row in enumerate(csv_file):
        try:
            csv_as_string.append(UnicodeDammit(row).unicode_markup)
        except UnicodeError as e:
            return JsonResponse({"error": DECODE_ERROR + '. At line {}'.format(index + 1)}, safe=False, status=400)

    parser = CSVParser(csv_as_string)
    try:
        parsed_data = parser.all_fields_required('identifier', 'case_status', 'first_name', 'last_name')
    except KeyError as e:
        return JsonResponse({"error": e.args[0]}, safe=False, status=400)

    for item in parsed_data:
        item['extern_user_id'] = item.pop('identifier')
        item['firstname'] = item.pop('first_name')
        item['lastname'] = item.pop('last_name')

    return JsonResponse(json.dumps(parsed_data), safe=False)


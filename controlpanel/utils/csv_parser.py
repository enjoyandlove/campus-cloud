import csv
import pytz
import datetime
from operator import itemgetter
from dateutil.parser import parse

class CSVParser:
    def __init__(self, csv_file):
        self.csv_file = csv_file

    def all_fields_required(self, *args, **kwargs):
        data = []
        column_titles = None
        reader = csv.reader(self.csv_file)

        # get column titles
        for index, row in enumerate(reader):
            if index == 0:
                column_titles = row
                continue

            data.append(row)

        column_titles = [title.lower().replace(" ", "_") for title in column_titles]


        if not data:
            raise KeyError('File is Empty')

        data_len = kwargs.get('data_len', 100)
        if len(data) > data_len:
            raise KeyError('File exceeds number of allowed rows')

        # zip data with columns
        result = []

        for index, item in enumerate(data):
            entry = dict(zip(column_titles, item))
            required_missing = set(args).difference(entry.keys())
            error = [k for k,v in entry.items() if k in args and v == '']

            if error:
                raise KeyError(('Line {}, is missing {}').format(index + 1, error[0]))
            if required_missing:
                raise KeyError(('Line {}, is missing {}').format(index + 1, required_missing))

            result.append(entry)

        return result


    def validate_date_format(self, date_input):
        error = None

        try:
            parse(date_input)
        except ValueError:
            error = "%s is not a valid date format" % date_input

        return error

    def date_str_to_formated_date(self, date_input, format="%Y-%m-%d %H:%M:%S"):
        return parse(date_input).strftime(format)

    def date_not_in_past(self, date_value, tz):
        date_value = pytz.timezone(tz).localize(parse(date_value))

        return date_value > datetime.datetime.now(pytz.timezone(tz))


    def future_dates_is_greater_than_past(self, future_date, past_date, tz):
        past_date = pytz.timezone(tz).localize(parse(past_date))
        future_date = pytz.timezone(tz).localize(parse(future_date))
        
        return future_date > past_date

        



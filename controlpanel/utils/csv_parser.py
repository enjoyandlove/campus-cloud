import csv
import datetime
from operator import itemgetter
from dateutil.parser import parse

class CPParseError(KeyError):
    pass

class CSVParser:
    def __init__(self, csv_file):
        self.csv_file = csv_file


    def all_fields_required(self, *args):
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

        if len(data) > 100:
            raise KeyError('File exceeds number of allowed rows')

        # zip data with columns
        result = []

        for index, item in enumerate(data):
            entry = dict(zip(column_titles, item))

            if args:
                mandatory_values = itemgetter(*args)(entry)

                if '' in mandatory_values:
                    for mandatory_field in args:
                        if entry[mandatory_field] == '':
                            raise KeyError(('Line {}, is missing {}').format(index + 1, mandatory_field))

            result.append(entry)

        return result


    def validate_date_format(self, date_input):
        error = None

        try:
            parse(date_input)
        except ValueError:
            error = "%s is not a valid date format" % date_input

        return error


    def date_not_in_past(self, date_value):
        date_value = parse(date_value)
        return date_value > datetime.datetime.now()


    def future_dates_is_greater_than_past(self, past_date, future_date):
        past_date = parse(past_date)
        future_date = parse(future_date)
        return past_date > future_date



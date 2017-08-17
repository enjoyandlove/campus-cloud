import csv
import datetime
from dateutil.parser import parse


class CSVParser:
    def __init__(self, csv_file):
        self.csv_file = csv_file


    def all_fields_required(self):
        data = []
        column_titles = None
        reader = csv.reader(self.csv_file)

        for index, row in enumerate(reader):
            if index == 0:
                column_titles = row
                continue

            if not row[0]:
                continue

            data.append(row)

        for index, title in enumerate(column_titles):
            if column_titles[index] is None:
                raise KeyError("All fields are required")

            column_titles[index] = column_titles[index].lower(
                ).replace(" ", "_")


        if not data:
            raise KeyError('File is Empty')

        if len(data) > 100:
            raise KeyError('File exceeds number of allowed rows')

        # zip data with columns
        result = []
        for item in data:
            for i in item:
                if not i:
                    raise KeyError('All fields are required')
            result.append(dict(zip(column_titles, item)))

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



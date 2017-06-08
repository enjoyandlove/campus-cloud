import csv

class CSVParser:
    def __init__(self, csv_file):
        self.csv_file = csv_file

    def parse(self):
        reader = csv.reader(self.csv_file)
        data = []
        column_titles = None

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

            column_titles[index] = column_titles[index].lower().replace(" ", "_")

        # zip data with columns
        result = []
        for item in data:
            result.append(dict(zip(column_titles, item)))

        return result

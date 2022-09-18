import json
import shutil

with open('trans.txt') as f:
    data = f.readlines()
    data = list(filter(len, [i.strip() for i in data]))

title, titletrans = data[:2]
date, datetrans = data[2:4]
text, trans = data[4::2], data[5::2]

assert len(text) == len(trans)

data_json = dict(
    title=title,
    titletrans=titletrans,
    date=date,
    datetrans=datetrans,
    text=text,
    trans=trans
)

with open('content.js', 'w') as f:
    f.write('const content = {}'.format(
        json.dumps(data_json)
    ))
import json
import shutil

with open('trans.txt') as f:
    data = f.readlines()
    data = list(filter(len, [i.strip() for i in data]))

title, titletrans = data[:2]
author = data[2]
date, datetrans = data[3:5]
text, trans = data[5::2], data[6::2]

assert len(text) == len(trans)

data_json = dict(
    title=title,
    titletrans=titletrans,
    author=author,
    date=date,
    datetrans=datetrans,
    text=text,
    trans=trans
)

with open('content.js', 'w') as f:
    f.write('const content = {}'.format(
        json.dumps(data_json)
    ))
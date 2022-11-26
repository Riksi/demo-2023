import json
import os




def parse(data):
    # Has form
    # Title:
    # title_src | title_tar
    # Author:
    # author_src | translator(s)
    # Date:
    # date_src | date_tar
    # Source:
    # source_src | source_tar
    # Text:
    # text_src | text_tar
    # Parse data
    separator = ' | '
    assert data[0] == 'Title:'
    title, titletrans = data[1].split(separator)
    assert data[2] == 'Author:'
    author, translator = data[3].split(separator)
    assert data[4] == 'Date:'
    date, datetrans = data[5].split(separator)
    assert data[6] == 'Source:',  data[6]
    source, sourcetrans = data[7].split(separator)
    assert data[8] == 'Text:'
    splits = [i.split(separator) for i in data[9:]]
    assert all(len(i) == 2 for i in splits), [i for i in splits if len(i) != 2]
    text, trans = zip(*splits)
    return dict(
        title=title,
        titletrans=titletrans,
        author=author,
        translator=translator,
        date=date,
        datetrans=datetrans,
        text=text,
        trans=trans,
        source=source,
        sourcetrans=sourcetrans,
    )

if __name__ == '__main__':
    files = os.listdir('data')
    data_json = {}
    for f in files:
        fname = f.split('.')[0]
        with open(os.path.join('data', f), 'r') as f:
            data = f.read().split('\n')
            data = list(filter(len, [i.strip() for i in data]))
            data_json[fname] = parse(data)

    with open('content.js', 'w') as f:
        f.write('const data = {}'.format(
            json.dumps(data_json)
        ))
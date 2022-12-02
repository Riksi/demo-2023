import glob
import json
import os

def get_text(text_file):
    with open(text_file) as f:
        text = f.read().splitlines()
    
    text = filter(len, map(str.strip, text))
    text_en, text_tar = zip(*map(lambda x: x.split("|"), text))
    return text_en, text_tar


def make_dataset():
    # Step 1: 
    # Read data/metadata.json
    # This has list of dicts of the form
    # {"title": "The Need to Read", "author": "Paul Graham", "date": "November 2022", "name": "read", "lang": "en", "url": "http://www.paulgraham.com/read.html"}

    with open(os.path.join("data", "metadata.json")) as f:
        metadata = json.load(f)

    # Step 2:
    # For each language make a dict of the dicts

    name2data = {}
    for m in metadata:
        if m["name"] not in name2data:
            name2data[m["name"]] = {}
        name2data[m["name"]][m["lang"]] = m

    # Step 3:
    # - Load <name>-en-<tar>[-part-<part>]*.txt files from data
    # - Group if there are multiple parts
    # - Load each file, split into lines then split each using '|' as separator
    # - Strip whitespace from each line
    # - Added mapped en to name2data[name][tar] and mapped tar to name2data[name]["en"]

    for name in name2data:
        for tar in name2data[name]:
            if tar == "en":
                continue
            files = glob.glob(os.path.join("data", name + "-en-" + tar + "*.txt"))
            if len(files) > 1:
                files = sorted(files, key=lambda x: int(x.split("-")[-1].split(".")[0]))
            text_en, text_tar = zip(*map(get_text, files))
            text_en = sum(text_en, ())
            text_tar = sum(text_tar, ())
            name2data[name]["en"][tar] = list(text_en)
            name2data[name][tar]["en"] = list(text_tar)

    return name2data
            


if __name__ == "__main__":
    name2data = make_dataset()
    with open("content.js", 'w') as f:
        f.write("const data = " + json.dumps(name2data, indent=4))
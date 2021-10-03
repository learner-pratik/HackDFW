#import key_config as keys
#https://github.com/aniketwattamwar/AWS-Flask/tree/master/send_to_s3
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request
import boto3
import pymongo
from pymongo import MongoClient
import VideoSplit as vs
import numpy as np
import pandas as pd

app = Flask(__name__)
client = pymongo.MongoClient(
    "mongodb+srv://AnirudhT94:Devika@cluster0.unlyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client["AmazonEducationHack"]
reel_collection = db["Reel"]
print(reel_collection)
reels = []
reel_collection.find()
print(reels)
S3_datafram = pd.DataFrame(pd.read_excel("ReelsData.xlsx"))
print(S3_datafram.head())
s3 = boto3.client('s3',
                  aws_access_key_id="AKIA3T5ONG3LCVYX7E24",
                  aws_secret_access_key="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",
                  aws_session_token="keys.AWS_SESSION_TOKEN"
                  )

BUCKET_NAME = 'hackershrine'

likes = 0
dislikes = 0

@app.route('/')
def home():
    print(likes)
    print(dislikes)
    return render_template("file_upload_to_s3.html")


@app.route('/reels')
def reels():
    return render_template("reels.html", likes=likes, dislikes=dislikes)


@app.route('/likes_dislikes', methods = ['POST'])
def get_post_javascript_data():
    jsdata = request.get_data()
    print(jsdata)
    return jsdata


@app.route('/upload', methods=['post'])
def upload():
    if request.method == 'POST':
        img = request.files['file']
        print(img)
        type(img)
        if img:
            filename = secure_filename(img.filename)
            img.save(filename)
            SplitVideos = vs.SpitVideoFunc(filename)
            print(SplitVideos)
            for filename in SplitVideos:
                s3.upload_file(
                    Bucket=BUCKET_NAME,
                    Filename=filename,
                    Key=filename
                )   
            url = ""
            topic = "Artificial Integence"
            categories = ["#supervisedLearning","#nlp"]
            comment = ["This is a good content","I understood it clearly"]
            likes = 25
            dislikes = 5
            push_ddict = {"Likes": likes, "Dislikes": dislikes, "comment": comment,
                          "URL": url, "topic": topic, "topoc": topic, "Tag": categories, "URL": url}
            S3_datafram.append(push_ddict)

            msg = "Upload Done ! "

    return render_template("file_upload_to_s3.html", msg=msg)


if __name__ == "__main__":
    app.run(debug=True)


    

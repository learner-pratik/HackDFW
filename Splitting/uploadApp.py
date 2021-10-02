#import key_config as keys
#https://github.com/aniketwattamwar/AWS-Flask/tree/master/send_to_s3
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request
import boto3
import VideoSplit as vs
app = Flask(__name__)

s3 = boto3.client('s3',
                  aws_access_key_id="keys.ACCESS_KEY_ID",
                  aws_secret_access_key="keys.ACCESS_SECRET_KEY",
                  aws_session_token="keys.AWS_SESSION_TOKEN"
                  )

BUCKET_NAME = 'hackershrine'


@app.route('/')
def home():
    return render_template("file_upload_to_s3.html")


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
            
            
            msg = "Upload Done ! "

    return render_template("file_upload_to_s3.html", msg=msg)


if __name__ == "__main__":

    app.run(debug=True)

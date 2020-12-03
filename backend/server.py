# flask
from flask import Flask, jsonify, make_response
from flask_cors import CORS

# components
from components import SenpyAPI
from components import SpotifyAPI
from components.oauth import SpotifyAuth

# operating system
import os

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = os.urandom(24)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# sanity check route

# login
@app.route('/', methods=['GET'])
def Login():
  response = make_response(
    jsonify({'status': 'success'}),
    201,
  )
  return response

# authentication route
@app.route('/login', methods=['GET'])
def Auth():
  res = SpotifyAuth.login()
  return res

@app.route('/callback', methods=['GET'])
def Callback():
  frontend_redirect = SpotifyAuth.callback()
  return frontend_redirect

# home route
@app.route('/home', methods=['GET'])
def Home():

  # get back valence and arousal values
  valence, arousal, _ = SenpyAPI.getEmotion("I'm sad")

  # make a response
  response = make_response(
    jsonify({
      'valence': valence, 
      'arousal': arousal,
    }),
    200,
  )

  # set headers option
  response.headers['Content-Type'] = 'application/json'
  return response

if __name__ == '__main__':
  app.run(debug=True)
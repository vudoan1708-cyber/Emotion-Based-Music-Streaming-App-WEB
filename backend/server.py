# Flask
from flask import Flask, jsonify, make_response
from flask_cors import CORS

# components
from components import SenpyAPI
from components import SpotifyAPI
from components import IBM_NLU
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
# login to Spotify
@app.route('/', methods=['GET'])
def WakeUp():
  response = make_response(
    jsonify({
      'status': 'success',
    }),
    201,
  )
  return response


'''
IBM WATSON
'''
###########################
# NATURAL LANGUAGE UNDERSTANDING
###########################


'''
SPOTIFY
'''
###########################
# AUTHENTICATION CODE FLOW
###########################
# authentication route
@app.route('/login', methods=['GET'])
def Auth():
  res = SpotifyAuth.login()
  return res

@app.route('/callback', methods=['GET'])
def Callback():
  frontend_redirect = SpotifyAuth.callback()
  return frontend_redirect

###########################
# FETCHING ENDPOINTS
###########################
@app.route('/searchspotify', methods=['GET'])
def SearchSpotifySongs():
  return 'Great'


'''
SENPY
'''
###########################
###########################
# user emotion route
@app.route('/userscore', methods=['GET'])
def UserEmotionScore():

  # get back valence and arousal values
  valence, arousal, _ = SenpyAPI.getEmotion("I'm happy")

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
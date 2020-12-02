# flask
from flask import Flask, jsonify, make_response
from flask_cors import CORS

# components
from components import SenpyAPI
from components import SpotifyAPI
from components.oauth import SpotifyAuth

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# sanity check route
@app.route('/', methods=['GET'])
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
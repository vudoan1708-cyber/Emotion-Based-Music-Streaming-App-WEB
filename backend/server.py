# Flask
from flask import (
  Flask, 
  jsonify, 
  make_response, 
  request,
  render_template
)
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit

# components
from components import SpotifyAPI
from components.oauth import SpotifyAuth

# logic
from components.logic import Client

# operating system
import os

PYTHON_ENV = os.getenv('PYTHON_ENV')

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = os.urandom(24)

# instantiate the socket
socketio = SocketIO(app, cors_allowed_origins='*')

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# sanity check route
# login to Spotify
@app.route('/', methods=['GET'])
def WakeUp():

  # if the server is not running in production
  if PYTHON_ENV != 'production':
    response = make_response(
      jsonify({
        'status': 'success',
        'host': request.host,
      }),
      201,
    )
    return response

  # otherwise
  else:

    # render static files
    # return render_template('index.html')
    pass


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
SOCKETIO
'''
history = []
clients = []

@socketio.on('connect')
def Init():
  print('New Connection')

  # add new client id to client array
  clients.append(request.sid)

  # find the new connected client in the array
  getClientID = Client.findNewConnection(clients, request.sid)

  # if the client ids match
  if getClientID:

    # send the historical data to everyone
    emit('click', history)

# Handling click event
@socketio.on('click')
def HandlingUserLocation(data):
  print('Receiving ' + str(data))

  # append new element to history array 
  # for broadcasting old info to new connections
  history.append(data)

  # send the message back out to all clients except one that's not connecting
  emit('click', data, broadcast=True)

if __name__ == '__main__':
  socketio.run(app, debug=True)

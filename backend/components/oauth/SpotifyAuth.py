# query string
import querystring

# requests
import requests

# random
import random

# Flask
from flask import (
  request, 
  make_response, 
  redirect,
  session,
  jsonify,
  abort
)

# handling URLs
from urllib.parse import urlencode

# dotenv
from dotenv import load_dotenv

# operating system
import os

# load the dotenv variables
load_dotenv()

# get variables
CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
FRONTEND_URI = os.getenv('FRONTEND_URI')
STATE_KEY = os.getenv('STATE_KEY')

# variables of URLs for authorisation code flow for Spotify
AUTH_URL = 'https://accounts.spotify.com/authorize?'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
ME_URL = 'https://api.spotify.com/v1/me'

def generateRandomString(length):
  text = ''
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for _ in range(length):
    text += possible[random.randint(0, len(possible) - 1)]
  return text

# LOGIN
def login():

  # generate random string for unique state
  state = generateRandomString(16)

  # scope for authentication
  scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state playlist-modify-public playlist-modify-private streaming'

  # create a list of payload
  payload = {
    'response_type': 'code',
    'client_id': CLIENT_ID,
    'scope': scope,
    'redirect_uri': REDIRECT_URI,
    'state': state,
  }

  # make a response with redirecting to the authentication URL, alongside the created payload which is encoded
  res = make_response(redirect(f'{AUTH_URL}{urlencode(payload)}'))

  # set cookie when redirecting with stateKey is the name of the cookie, and state is the value
  res.set_cookie(STATE_KEY, state)

  return res

def callback():

  # error = request.args.get('error')
  code = request.args.get('code')
  # state = request.args.get('state')
  # stored_state = request.cookies.get(STATE_KEY)
  # print(f'State {state} Stored State {stored_state}')

  # # Check state
  # if state is None and state != stored_state:
  #   # app.logger.error('Error message: %s', repr(error))
  #   # app.logger.error('State mismatch: %s != %s', stored_state, state)
  #   abort(400)

  # else:

  # Request tokens with code we obtained
  payload = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI,
  }

  # `auth=(CLIENT_ID, SECRET)` basically wraps an 'Authorization'
  # header with value:
  # b'Basic ' + b64encode((CLIENT_ID + ':' + SECRET).encode())
  res = requests.post(TOKEN_URL, auth=(CLIENT_ID, CLIENT_SECRET), data=payload)
  res_data = res.json()

  if res_data.get('error') and res.status_code != 200:
    # app.logger.error(
    #     'Failed to receive token: %s',
    #     res_data.get('error', 'No error information received.'),
    # )
    abort(res.status_code)

  else:

    # Load tokens into session
    session['tokens'] = {
      'access_token': res_data.get('access_token'),
      'refresh_token': res_data.get('refresh_token'),
    }

    # set headers
    headers = {'Authorization': f"Bearer {session['tokens'].get('access_token')}"}
    res = requests.get(ME_URL, headers=headers)
    res_data = res.json()

    return redirect(f"{FRONTEND_URI}?access_token={session['tokens'].get('access_token')}")

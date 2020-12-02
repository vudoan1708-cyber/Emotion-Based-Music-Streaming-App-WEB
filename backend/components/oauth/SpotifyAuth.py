# query string
import querystring

# random
import random

# redirect from Flask
from flask import redirect

# dotenv
from dotenv import load_dotenv

# operating system
import os

# load the dotenv variables
load_dotenv()

# get variables
client_id = os.getenv('SPOTIFY_CLIENT_ID')
client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.getenv('REDIRECT_URI')

# a state key for cookie
stateKey = 'spotify_auth_state'

def generateRandomString(length):
  text = ''
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for _ in range(length):
    text += possible[random.randint(0, len(possible) - 1)]
  return text

def login():
  state = generateRandomString(16)
  # res.cookie(stateKey, state)
  
  scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state playlist-modify-public playlist-modify-private streaming'
  redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify_obj({
      'response_type': 'code',
      'client_id': client_id,
      'scope': scope,
      'redirect_uri': redirect_uri,
      'state': state
    })
  )
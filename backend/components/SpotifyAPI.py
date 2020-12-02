# random
import random

# request
import requests as req

# oauth from Spotify API
# from oauth import SpotifyAuth

def getRandomCharacter():
    
  # a list of characters that can be chosen
  char = 'abcdefghijklmnopqrstuvwxyz'

  # get random character from the string
  randomChar = char[random.randint(0, len(char) - 1)]

  return randomChar

def searchSong():

  # try to parse the URL
  try:

    BASE_URL = 'https://api.spotify.com/v1/search?'

    #search limit
    lim = 10

    # random character
    randomChar = getRandomCharacter()

    # market
    MARKET = 'from_token'

    # query params
    QUERY = f'{randomChar}&type=track&market={MARKET}&limit=${lim}'

    # get the url
    FETCH_URL = f'{BASE_URL}q={QUERY}'

    print(FETCH_URL)
  
  except Exception as e:
    return f'An Error Occured: {e}.'
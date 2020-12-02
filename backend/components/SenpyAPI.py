# request
import requests as req

endpoint = 'http://senpy.gsi.upm.es/api/?algo=emotion-anew&i='

def getEmotion(text):

  # try to parse the URL
  try:

    # get the response
    response = req.get(endpoint + text)

    # turn it to a json format
    json = response.json()
    
    # hold data with variables
    entries = json['entries'][0]
    hasEmotions = entries['onyx:hasEmotionSet'][0]['onyx:hasEmotion'][0]

    valence = hasEmotions['emoml:pad-dimensions_pleasure']
    arousal = hasEmotions['emoml:pad-dimensions_arousal']
    dominance = hasEmotions['emoml:pad-dimensions_dominance']

    return valence, arousal, dominance
  
  except Exception as e:
    return f'An Error Occured: {e}.'

# IBM Watson
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, EmotionOptions, SentimentOptions

# dotenv
from dotenv import load_dotenv

# operating system
import os

# json
import json

# load the dotenv variables
load_dotenv()

IBM_API_KEY = os.getenv('IBM_API_KEY')
IBM_SERVICE_URL = os.getenv('IBM_SERVICE_URL')

# authenticate IBM Watson API
authenticator = IAMAuthenticator(IBM_API_KEY)

# use natural language understanding service
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2020-08-01',
    authenticator=authenticator
)

# set the service URL
natural_language_understanding.set_service_url(IBM_SERVICE_URL)

def analyseTextEmotion():

  # analyse a body of text
  # with features of emotion analysis
  response = natural_language_understanding.analyze(
      text="I love this library",
      features=Features(sentiment=EmotionOptions()),
      language="en").get_result()

  # turn it to a json format
  print(json.dumps(response, indent=2))
  return json.dumps(response, indent=2)

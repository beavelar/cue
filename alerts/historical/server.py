import logging
import requests
from flask import Flask, request
from environment.environment import environment

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

env = environment()
app = Flask(__name__)

#########################################################################################################

@app.route('/', methods = ['POST'])
def ingest():
	logger.info('Received POST request')
	data = request.form
	response = requests.post(f'http://{env.db_store_hostname}:{env.db_store_port}/write_historical', data=data)
	return response.text, response.status_code

#########################################################################################################

if __name__ == '__main__':
	app.run(host=env.historical_server_hostname, port=env.historical_server_port)
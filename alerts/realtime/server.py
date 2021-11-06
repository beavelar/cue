import logging
from flask import Flask, request
from environment.environment import environment

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

#########################################################################################################

@app.route('/', methods = ['POST'])
def ingest():
	data = request.form
	logger.info(data)
	return 'Hello World!'

#########################################################################################################

if __name__ == '__main__':
	env = environment()
	app.run(host=env.realtime_server_hostname, port=env.realtime_server_port)
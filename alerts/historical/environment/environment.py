import os
import logging
from dotenv import load_dotenv

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

class environment:
	'''
	environment
	----------

	This class will contain the environment variables for the historical alerts service:

	- historical_alerts_dir

	- historical_server_hostname

	- historical_server_port
	'''
	def __init__(self) -> None:
		'''
		__init__
		----------

		Creates a environment object
		
		If an exception is raised retrieving environment variables, all

		elements of the environment class will be set to an empty string
		'''
		logger.info('Retrieving environment variables')
		try:
			load_dotenv()
			self.historical_alerts_dir = os.getenv('HISTORICAL_ALERTS_DIRECTORY', '')
			self.historical_server_hostname = os.getenv('HISTORICAL_SERVER_HOSTNAME', '')
			self.historical_server_port = os.getenv('HISTORICAL_SERVER_PORT', '')
		except Exception as ex:
			logger.critical('Failed to retrieve environment variables. Please verify environment variable exists')
			logger.critical(str(ex))
			self.historical_alerts_dir = ''
			self.historical_server_hostname = ''
			self.historical_server_port = ''
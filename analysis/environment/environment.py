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

	This class will contain the environment variables for the scraper:

	- historical_file

	- parsed_file

	- options_file
	'''
	def __init__(self):
		'''
		__init__
		----------

		Creates a environment object. If an exception is raised retrieving environment variables, all

		elements of the environment class will be set to an empty string
		'''
		logger.info('Retrieving environment variables')
		try:
			load_dotenv()
			self.historical_dir = os.getenv('HISTORICAL_DATA_DIR', '')
			self.parsed_file = os.getenv('PARSED_DATA_FILE', '')
			self.options_file = os.getenv('OPTIONS_RECAP_FILE', '')
		except Exception as ex:
			logger.critical('Failed to retrieve environment variables. Please verify environment variable exists')
			logger.critical(str(ex))
			self.historical_dir = ''
			self.parsed_file = ''
			self.options_file = ''
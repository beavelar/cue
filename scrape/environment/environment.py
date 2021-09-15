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

	- input_file

	- output_file

	- data_directory
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
			self.input_file = os.getenv('INPUT_FILE', '')
			self.output_file = os.getenv('INPUT_FILE', '')
			self.data_directory = os.getenv('DATA_DIRECTORY', '')
		except Exception as ex:
			logger.critical('Failed to retrieve environment variables. Please verify environment variable exists')
			logger.critical(str(ex))
			self.input_file = ''
			self.output_file = ''
			self.data_directory = ''
import logging
from pathlib import Path

#########################################################################################################
# Logger definition

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def create_directory(directory: str) -> None:
	'''
	create_directory
	----------

	This function will create the desired directory, creating any missing parent directories

	If the directory already exists, nothing will occur
	'''
	try:
		Path(f'{directory}').mkdir(parents=True, exist_ok=True)
	except Exception as ex:
		logger.warning(f'Exception caught creating {directory}')
		logger.warning(ex)

#########################################################################################################

def create_directories(directories: list) -> None:
	'''
	create_directories
	----------

	This function will loop through the list of directories, creating each desired directory
	'''
	for directory in directories:
		create_directory(directory)
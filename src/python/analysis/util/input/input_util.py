import logging
from os import path

#########################################################################################################
# Logger definition

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def prompt_for_input(prompt: str, valid_choices: list=[]) -> str:
	'''
	prompt_for_input
	----------

	Prompts the user to provide input and select from a provided list of valid choices

	If the input provided from the user is not in valid_choices, the user will be prompted again
	'''
	valid_input = False
	while not valid_input:
		input_prompt = input(prompt)
		if len(valid_choices) != 0 and not input_prompt.lower() in valid_choices:
			logger.warning(f'Invalid input provided: {input_prompt}')
			logger.warning('Please provide a valid input')
		else:
			valid_input = True
	return input_prompt

#########################################################################################################

def prompt_for_file(prompt: str) -> str:
	'''
	prompt_for_file
	----------
	
	Prompts the user to provide input, providing a valid file path\n

	If the input provided from the user is not a valid file path, the user will be prompted again
	'''
	file_prompt = None
	valid_file = False
	while not valid_file:
		file_prompt = input(prompt)
		valid_file = path.exists(file_prompt)
		if not valid_file:
			logger.warning('Unable to find file, please provide a valid path\n')
	return file_prompt
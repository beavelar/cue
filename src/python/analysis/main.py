import logging
import pandas as pd
from data.report import report
from util.rate.rate_util import rate_excel
from environment.environment import environment
from util.input.input_util import prompt_for_input

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def main(parsed_file, recap_file):
	valid_choices = ['a', 'analyze', 'r', 'rate']
	choice_prompt = 'Parse, analyze or rate historical data? (P/A/R): '
	row_choice_prompt = 'Which row to start on?: '

	graph_parse_prompt = prompt_for_input(choice_prompt, valid_choices)
	output_historical_xlsx = pd.ExcelFile(parsed_file)
	output_historical_df = pd.read_excel(output_historical_xlsx, 'Historical Alerts')

	# Analyzing historical report and creating call and put report containing the results
	if graph_parse_prompt.lower() == valid_choices[0] or graph_parse_prompt.lower() == valid_choices[1]:
		logger.info('User selected to analyze parsed data')
		# output_dir = os.path.dirname(os.path.normpath(parsed_file))
		# ouput_call_report = f'{output_dir}\\Call Report.xlsx'
		# ouput_put_report = f'{output_dir}\\Put Report.xlsx'
		call_report = None
		put_report = None
		call_df = output_historical_df.loc[output_historical_df['Option Type'] == 'call']
		put_df = output_historical_df.loc[output_historical_df['Option Type'] == 'put']

		try:
			call_report = report(call_df)
		except TypeError as ex:
			logger.warning('TypeError exception caught creating call report')
			logger.warning(ex)
		try:
			put_report = report(put_df)
		except TypeError as ex:
			logger.warning('TypeError exception caught creating put report')
			logger.warning(ex)
	# Rates Unusual Whales alerts and color codes the cells indicating if BAD, OKAY, GOOD, or BEST
	elif graph_parse_prompt.lower() == valid_choices[2] or graph_parse_prompt.lower() == valid_choices[3]:
		logger.info('User selected to rate parsed data')
		#########################################################################################################
		call_report = None
		put_report = None
		call_df = output_historical_df.loc[output_historical_df['Option Type'] == 'call']
		put_df = output_historical_df.loc[output_historical_df['Option Type'] == 'put']

		try:
			call_report = report(call_df)
		except TypeError as ex:
			logger.warning('TypeError exception caught creating call report')
			logger.warning(ex)
		try:
			put_report = report(put_df)
		except TypeError as ex:
			logger.warning('TypeError exception caught creating put report')
			logger.warning(ex)
		#########################################################################################################
		if call_report != None and put_report != None:
			row_prompt = int(prompt_for_input(row_choice_prompt))
			rate_excel(recap_file, call_report, put_report, row_prompt)
		else:
			report_failed = 'call' if call_report == None else 'put'
			logger.warning(f'Unable to rate data, {report_failed} came back as None')

if __name__ == "__main__":
	env = environment()
	if env.parsed_file != '' and env.options_file != '':
		main(env.parsed_file, env.options_file)
	else:
		logger.critical(f'Environment variables are not properly defined')
		logger.critical(f'Exiting..')
import os
import logging
import pandas as pd
from dotenv import load_dotenv
from data.report import report
from util.rate.rate_util import rate_excel
from util.input.input_util import prompt_for_input
from util.dataframe.dataframe_util import append_dataframe
from util.excel.excel_util import save_df_to_excel, create_excel_chart

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

try:
	load_dotenv()
	HISTORICAL_DATA_FILE = os.getenv('HISTORICAL_DATA_FILE')
	PARSED_DATA_FILE = os.getenv('PARSED_DATA_FILE')
	OPTIONS_RECAP_FILE = os.getenv('OPTIONS_RECAP_FILE')
except Exception as ex:
	logger.critical('Failed to retrieve environment variables. Please verify environment variable exists')
	logger.critical(str(ex))
	exit(1)

#########################################################################################################

def main():	
	output_historical_df = None
	valid_choices = ['p', 'parse', 'g', 'graph', 'a', 'analyze', 'r', 'rate']
	choice_prompt = 'Parse, graph, analyze or rate historical data? (P/G/A/R): '
	row_choice_prompt = 'Which row to start on?: '

	graph_parse_prompt = prompt_for_input(choice_prompt, valid_choices)
	output_historical_xlsx = pd.ExcelFile(PARSED_DATA_FILE)
	output_historical_df = pd.read_excel(output_historical_xlsx, 'Historical Alerts')

	# Parsing Unusual Whales historical data
	if graph_parse_prompt.lower() == valid_choices[0] or graph_parse_prompt.lower() == valid_choices[1]:
		uw_historical_df = pd.read_excel(HISTORICAL_DATA_FILE)
		appended_df = append_dataframe(uw_historical_df, output_historical_df)
		save_df_to_excel(appended_df, PARSED_DATA_FILE)
	# Graphing parsed data
	elif graph_parse_prompt.lower() == valid_choices[2] or graph_parse_prompt.lower() == valid_choices[3]:
		num_of_elems = output_historical_df.Ticker.size
		create_excel_chart(PARSED_DATA_FILE, 'Days to Exp.', 'P/L', 7, 22, 'X2', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Diff %', 'P/L', 10, 22, 'X17', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Vol/OI', 'P/L', 13, 22, 'X32', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Implied Volatility', 'P/L', 14, 22, 'X47', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Delta', 'P/L', 15, 22, 'X62', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Gamma', 'P/L', 16, 22, 'X77', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Vega', 'P/L', 17, 22, 'X92', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Theta', 'P/L', 18, 22, 'X107', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Rho', 'P/L', 19, 22, 'X122', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Alert Ask', 'P/L', 20, 22, 'X137', num_of_elems)
		create_excel_chart(PARSED_DATA_FILE, 'Time Passed', 'P/L', 23, 22, 'X152', num_of_elems)
	# Analyzing historical report and creating call and put report containing the results
	elif graph_parse_prompt.lower() == valid_choices[4] or graph_parse_prompt.lower() == valid_choices[5]:
		# output_dir = os.path.dirname(os.path.normpath(PARSED_DATA_FILE))
		# ouput_call_report = f'{output_dir}\\Call Report.xlsx'
		# ouput_put_report = f'{output_dir}\\Put Report.xlsx'
		call_df = output_historical_df.loc[output_historical_df['Option Type'] == 'call']
		put_df = output_historical_df.loc[output_historical_df['Option Type'] == 'put']

		call_report = report(call_df)
		put_report = report(put_df)
	# Rates Unusual Whales alerts and color codes the cells indicating if BAD, OKAY, GOOD, or BEST
	elif graph_parse_prompt.lower() == valid_choices[6] or graph_parse_prompt.lower() == valid_choices[7]:
		#########################################################################################################
		call_df = output_historical_df.loc[output_historical_df['Option Type'] == 'call']
		put_df = output_historical_df.loc[output_historical_df['Option Type'] == 'put']

		call_report = report(call_df)
		put_report = report(put_df)
		#########################################################################################################
		row_prompt = int(prompt_for_input(row_choice_prompt))
		rate_excel(OPTIONS_RECAP_FILE, call_report, put_report, row_prompt)

if __name__ == "__main__":
	main()
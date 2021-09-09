import os
import logging
import pandas as pd
from data.report import report
from util.rate.rate_util import rate_excel
from util.dataframe.dataframe_util import append_dataframe
from util.input.input_util import prompt_for_input, prompt_for_file
from util.excel.excel_util import save_df_to_excel, create_excel_chart

# Laptop
# C:\Users\brian\Desktop\Stonks\Documents\Unusual Whales\Historical Alerts\2021\2021-06.xlsx
# C:\Users\brian\Desktop\Stonks\Documents\Unusual Whales\Historical Alerts\2021\2021 Historical Alerts.xlsx
# C:\Users\brian\Desktop\Stonks\Documents\Unusual Whales\Options Recap\Options Recap (Detailed).xlsx

# Computer
# D:\Projects\Programming\Cue\docs\historical-data\2021\2021-06.xlsx
# D:\Projects\Programming\Cue\docs\historical-data\2021\2021 Historical Alerts.xlsx
# D:\Projects\Programming\Cue\docs\options-recap\Options Recap (Detailed).xlsx

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def main():	
	output_historical_df = None
	valid_choices = ['p', 'parse', 'g', 'graph', 'a', 'analyze', 'r', 'rate']
	row_valid_choices = ['0', '1', '2', '3', 'etc.']
	choice_prompt = 'Parse, graph, analyze or rate historical data? (P/G/A/R): '
	row_choice_prompt = 'Which row to start on?: '
	output_file_prompt = 'Please provide the output Historical Alerts file: '
	input_file_prompt = 'Please provide the output Unusual Whales Historical Alerts file or directory: '
	alert_file_prompt = 'Please provide the Unusual Whales alerts file: '

	graph_parse_prompt = prompt_for_input(choice_prompt, valid_choices)
	output_file = prompt_for_file(output_file_prompt)
	output_historical_xlsx = pd.ExcelFile(output_file)
	output_historical_df = pd.read_excel(output_historical_xlsx, 'Historical Alerts')

	# Parsing Unusual Whales historical data
	if graph_parse_prompt.lower() == valid_choices[0] or graph_parse_prompt.lower() == valid_choices[1]:
		input_file = prompt_for_file(input_file_prompt)
		uw_historical_df = pd.read_excel(input_file)
		appended_df = append_dataframe(uw_historical_df, output_historical_df)
		save_df_to_excel(appended_df, output_file)
	# Graphing parsed data
	elif graph_parse_prompt.lower() == valid_choices[2] or graph_parse_prompt.lower() == valid_choices[3]:
		num_of_elems = output_historical_df.Ticker.size
		create_excel_chart(output_file, 'Days to Exp.', 'P/L', 7, 22, 'X2', num_of_elems)
		create_excel_chart(output_file, 'Diff %', 'P/L', 10, 22, 'X17', num_of_elems)
		create_excel_chart(output_file, 'Vol/OI', 'P/L', 13, 22, 'X32', num_of_elems)
		create_excel_chart(output_file, 'Implied Volatility', 'P/L', 14, 22, 'X47', num_of_elems)
		create_excel_chart(output_file, 'Delta', 'P/L', 15, 22, 'X62', num_of_elems)
		create_excel_chart(output_file, 'Gamma', 'P/L', 16, 22, 'X77', num_of_elems)
		create_excel_chart(output_file, 'Vega', 'P/L', 17, 22, 'X92', num_of_elems)
		create_excel_chart(output_file, 'Theta', 'P/L', 18, 22, 'X107', num_of_elems)
		create_excel_chart(output_file, 'Rho', 'P/L', 19, 22, 'X122', num_of_elems)
		create_excel_chart(output_file, 'Alert Ask', 'P/L', 20, 22, 'X137', num_of_elems)
		create_excel_chart(output_file, 'Time Passed', 'P/L', 23, 22, 'X152', num_of_elems)
	# Analyzing historical report and creating call and put report containing the results
	elif graph_parse_prompt.lower() == valid_choices[4] or graph_parse_prompt.lower() == valid_choices[5]:
		# output_dir = os.path.dirname(os.path.normpath(output_file))
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
		alerts_file = prompt_for_file(alert_file_prompt)
		row_prompt = int(prompt_for_input(row_choice_prompt, row_valid_choices))
		rate_excel(alerts_file, call_report, put_report, row_prompt)

if __name__ == "__main__":
	main()
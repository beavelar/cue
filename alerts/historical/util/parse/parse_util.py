import os
import logging
import numpy as np
import pandas as pd
from util.excel.excel_util import create_excel_chart
from util.excel.excel_util import save_df_to_excel, create_excel_chart
from util.dataframe.dataframe_util import parse_dataframe, append_parsed_dataframe

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def parse_historical_directory(input_directory_path: str, output_file_path: str) -> None:
	'''
	parse_historical_directory
	----------

	This function will parse the historical data from the provided historical directory path
	
	Parsed result will be a excel sheet saved in the output file path

	After the data has been parsed, a graph will be generated and attached to the sheet
	'''
	df_columns = np.array(['Ticker', 'Option Type', 'Alerted At', 'Day of Week', 'Time of Day', 'Expiry',
		'Days to Exp.', 'Strike', 'Underlying', 'Diff %', 'Volume', 'Open Interest', 'Vol/OI',
		'Implied Volatility', 'Delta', 'Gamma', 'Vega', 'Theta', 'Rho', 'Alert Ask', 'Highest Ask', 'P/L',
		'Time Passed'])
	parsed_df = pd.DataFrame(columns=df_columns)
	files = os.listdir(input_directory_path)
	sorted(files)
	for file in files:
		file_df = pd.read_excel(f'{input_directory_path}\\{file}')
		historical_df = parse_dataframe(file_df)
		parsed_df = append_parsed_dataframe(historical_df, parsed_df)
	save_df_to_excel(parsed_df, output_file_path)

	num_of_elems = historical_df.Ticker.size
	create_excel_chart(output_file_path, 'Days to Exp.', 'P/L', 7, 22, 'X2', num_of_elems)
	create_excel_chart(output_file_path, 'Diff %', 'P/L', 10, 22, 'X17', num_of_elems)
	create_excel_chart(output_file_path, 'Vol/OI', 'P/L', 13, 22, 'X32', num_of_elems)
	create_excel_chart(output_file_path, 'Implied Volatility', 'P/L', 14, 22, 'X47', num_of_elems)
	create_excel_chart(output_file_path, 'Delta', 'P/L', 15, 22, 'X62', num_of_elems)
	create_excel_chart(output_file_path, 'Gamma', 'P/L', 16, 22, 'X77', num_of_elems)
	create_excel_chart(output_file_path, 'Vega', 'P/L', 17, 22, 'X92', num_of_elems)
	create_excel_chart(output_file_path, 'Theta', 'P/L', 18, 22, 'X107', num_of_elems)
	create_excel_chart(output_file_path, 'Rho', 'P/L', 19, 22, 'X122', num_of_elems)
	create_excel_chart(output_file_path, 'Alert Ask', 'P/L', 20, 22, 'X137', num_of_elems)
	create_excel_chart(output_file_path, 'Time Passed', 'P/L', 23, 22, 'X152', num_of_elems)
	
#########################################################################################################

def parse_historical_file(input_file_path: str, output_file_path: str) -> None:
	'''
	parse_historical_file
	----------

	This function will parse the historical data from the provided historical file path
	
	Parsed result will be a excel sheet saved in the output file path

	After the data has been parsed, a graph will be generated and attached to the sheet
	'''
	historical_df = pd.read_excel(input_file_path)
	parsed_df = parse_dataframe(historical_df)
	save_df_to_excel(parsed_df, output_file_path)

	num_of_elems = parsed_df.Ticker.size
	create_excel_chart(output_file_path, 'Days to Exp.', 'P/L', 7, 22, 'X2', num_of_elems)
	create_excel_chart(output_file_path, 'Diff %', 'P/L', 10, 22, 'X17', num_of_elems)
	create_excel_chart(output_file_path, 'Vol/OI', 'P/L', 13, 22, 'X32', num_of_elems)
	create_excel_chart(output_file_path, 'Implied Volatility', 'P/L', 14, 22, 'X47', num_of_elems)
	create_excel_chart(output_file_path, 'Delta', 'P/L', 15, 22, 'X62', num_of_elems)
	create_excel_chart(output_file_path, 'Gamma', 'P/L', 16, 22, 'X77', num_of_elems)
	create_excel_chart(output_file_path, 'Vega', 'P/L', 17, 22, 'X92', num_of_elems)
	create_excel_chart(output_file_path, 'Theta', 'P/L', 18, 22, 'X107', num_of_elems)
	create_excel_chart(output_file_path, 'Rho', 'P/L', 19, 22, 'X122', num_of_elems)
	create_excel_chart(output_file_path, 'Alert Ask', 'P/L', 20, 22, 'X137', num_of_elems)
	create_excel_chart(output_file_path, 'Time Passed', 'P/L', 23, 22, 'X152', num_of_elems)
import os
import logging
import numpy as np
import pandas as pd
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
	'''
	df_columns = np.array(['Ticker', 'Option Type', 'Alerted At', 'Day of Week', 'Time of Day', 'Expiry',
		'Days to Exp.', 'Strike', 'Underlying', 'Diff %', 'Volume', 'Open Interest', 'Vol/OI',
		'Implied Volatility', 'Delta', 'Gamma', 'Vega', 'Theta', 'Rho', 'Alert Ask', 'Highest Ask', 'P/L',
		'Time Passed'])
	historical_df = pd.DataFrame(columns=df_columns)
	files = os.listdir(input_directory_path)
	sorted(files)
	for file in files:
		file_df = pd.read_excel(f'{input_directory_path}\\{file}')
		parsed_df = parse_dataframe(file_df)
		historical_df = append_parsed_dataframe(parsed_df, historical_df)
	logger.info(historical_df.Ticker[0])
	save_df_to_excel(historical_df, output_file_path)
	
#########################################################################################################

def parse_historical_file(input_file_path: str, output_file_path: str) -> None:
	'''
	parse_historical_file
	----------

	This function will parse the historical data from the provided historical file path
	
	Parsed result will be a excel sheet saved in the output file path
	'''
	historical_df = pd.read_excel(input_file_path)
	parsed_df = parse_dataframe(historical_df)
	save_df_to_excel(parsed_df, output_file_path)
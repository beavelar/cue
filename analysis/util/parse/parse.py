import logging
import pandas as pd
from util.dataframe.dataframe_util import parse_dataframe
from util.excel.excel_util import save_df_to_excel, create_excel_chart

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
	temp=''
	
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
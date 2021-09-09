import logging
import pandas as pd
from math import isnan
from util.data.report import report
from util.excel.excel_util import color_cell
from openpyxl import Workbook, load_workbook
from openpyxl.worksheet.worksheet import Worksheet

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def rate_excel(file: str, call_report: report, put_report: report, row: int) -> None:
	'''
	rate_excel
	----------

	This function will rate the provided excel, changing the color of the cell depending on the rating

	Color Scheme:

	- Bad: Red

	- Okay: Yellow

	- Good: Light green

	- Best: Green
	'''
	workbook = load_workbook(file)
	worksheet = workbook.active
	dataframe = pd.read_excel(file)

	for index in range(int(row), dataframe.Ticker.size):
		if dataframe.Ticker[index] == 'Ticker' or not isinstance(dataframe.Ticker[index], str):
			continue
		if dataframe['Option Type'][index] == 'Call':
			# rate_list(worksheet, dataframe['Day of Week'][index], call_report.day_of_week.points, f'D{index+2}')
			# rate_list(worksheet, dataframe['Time of Day'][index], call_report.time_of_day.points, f'E{index+2}')

			# If excel returns nan for Days to Exp, we have to calculate it manually
			# if isnan(dataframe['Days to Exp.'][index]):
			# 	days_to_exp = dataframe.Expiry[index] - dataframe['Alerted At'][index]
			# 	rate_list(worksheet, days_to_exp, call_report.days_to_exp.points, f'G{index+2}')
			# else:
			# 	rate_list(worksheet, dataframe['Days to Exp.'][index], call_report.days_to_exp.points, f'G{index+2}')

			# If excel returns nan for Diff %, we have to calculate it manually
			if isnan(dataframe['Diff %'][index]):
				strike = float(dataframe.Strike[index])
				underlying = float(dataframe.Underlying[index])
				diff = (strike/underlying)-1 if underlying>strike else (strike-underlying)/underlying
				rate_list(worksheet, diff, call_report.diff.points, f'J{index+2}')
			else:
				rate_list(worksheet, dataframe['Diff %'][index], call_report.diff.points, f'J{index+2}')
			
			# If excel returns nan for Vol/OI, we have to calculate it manually
			if isnan(dataframe['Vol/OI'][index]):
				vol_oi = float(dataframe.Volume[index])/float(dataframe['Open Interest'][index])
				rate_list(worksheet, vol_oi, call_report.vol_oi.points, f'M{index+2}')
			else:
				rate_list(worksheet, dataframe['Vol/OI'][index], call_report.vol_oi.points, f'M{index+2}')

			rate_list(worksheet, dataframe['Implied Volatility'][index], call_report.imp_vol.points, f'N{index+2}')
			rate_list(worksheet, dataframe.Delta[index], call_report.delta.points, f'O{index+2}')
			rate_list(worksheet, dataframe.Gamma[index], call_report.gamma.points, f'P{index+2}')
			rate_list(worksheet, dataframe.Vega[index], call_report.vega.points, f'Q{index+2}')
			rate_list(worksheet, dataframe.Theta[index], call_report.theta.points, f'R{index+2}')
			rate_list(worksheet, dataframe.Rho[index], call_report.rho.points, f'S{index+2}')
		else:
			# rate_list(worksheet, dataframe['Day of Week'][index], put_report.day_of_week.points, f'D{index+2}')
			# rate_list(worksheet, dataframe['Time of Day'][index], put_report.time_of_day.points, f'E{index+2}')
			
			# If excel returns nan for Days to Exp, we have to calculate it manually
			# if isnan(dataframe['Days to Exp.'][index]):
			# 	days_to_exp = dataframe.Expiry[index] - dataframe['Alerted At'][index]
			# 	rate_list(worksheet, days_to_exp, put_report.days_to_exp.points, f'G{index+2}')
			# else:
			# 	rate_list(worksheet, dataframe['Days to Exp.'][index], put_report.days_to_exp.points, f'G{index+2}')

			# If excel returns nan for Diff %, we have to calculate it manually
			if isnan(dataframe['Diff %'][index]):
				strike = float(dataframe.Strike[index])
				underlying = float(dataframe.Underlying[index])
				diff = (strike/underlying)-1 if underlying>strike else (strike-underlying)/underlying
				rate_list(worksheet, diff, put_report.diff.points, f'J{index+2}')
			else:
				rate_list(worksheet, dataframe['Diff %'][index], put_report.diff.points, f'J{index+2}')
			
			# If excel returns nan for Vol/OI, we have to calculate it manually
			if isnan(dataframe['Vol/OI'][index]):
				vol_oi = float(dataframe.Volume[index])/float(dataframe['Open Interest'][index])
				rate_list(worksheet, vol_oi, put_report.vol_oi.points, f'M{index+2}')
			else:
				rate_list(worksheet, dataframe['Vol/OI'][index], put_report.vol_oi.points, f'M{index+2}')

			rate_list(worksheet, dataframe['Implied Volatility'][index], put_report.imp_vol.points, f'N{index+2}')
			rate_list(worksheet, dataframe.Delta[index], put_report.delta.points, f'O{index+2}')
			rate_list(worksheet, dataframe.Gamma[index], put_report.gamma.points, f'P{index+2}')
			rate_list(worksheet, dataframe.Vega[index], put_report.vega.points, f'Q{index+2}')
			rate_list(worksheet, dataframe.Theta[index], put_report.theta.points, f'R{index+2}')
			rate_list(worksheet, dataframe.Rho[index], put_report.rho.points, f'S{index+2}')
	
	workbook.save(file)

#########################################################################################################

def rate_list(worksheet: Worksheet, df_point: any, points: list, cell: str) -> None:
	'''
	rate_list
	----------

	This function will rate the provided list, changing the color of the cell in excel depending on the rating

	Color Scheme:

	- Bad: Red

	- Okay: Yellow

	- Good: Light green

	- Best: Green
	'''
	for index in range(len(points)):
		if df_point <= points[index].element:
			point_index = index if df_point == points[index].element else index-1
			point = points[point_index].element
			rating = points[point_index].rating
			if rating == 'bad':
				color_cell(worksheet, cell, 'FF0000')
				break
			if rating == 'okay':
				color_cell(worksheet, cell, 'FFFF00')
				break
			if rating == 'good':
				color_cell(worksheet, cell, '00FF00')
				break
			if rating == 'best':
				color_cell(worksheet, cell, '009900')
				break
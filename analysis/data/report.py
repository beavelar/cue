import logging
import numpy as np
from pandas import DataFrame
from data.ranges import ranges

#########################################################################################################
# Logger definition

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

class report:
	'''
	report
	----------

	This class will contain all the data for all the data fields of desire

	- Day of Week

	- Time of Day

	- Days to Expiry

	- Diff %

	- Volume/Open Interest

	- Delta

	- Gamma

	- Vega

	- Theta

	- Rho

	- Time Passed
	'''
	def __init__(self, data_frame: DataFrame) -> None:
		'''
		__init__
		----------

		Creates a report object. data_frame must be a DataFrame, otherwise a TypeError will be raised
		'''
		if isinstance(data_frame, DataFrame):
			p_l = data_frame['P/L'].to_numpy()
			self.day_of_week = ranges(data_frame['Day of Week'].to_numpy(), p_l)
			self.time_of_day = ranges(data_frame['Time of Day'].to_numpy(), p_l)
			self.days_to_exp = ranges(data_frame['Days to Exp.'].to_numpy(), p_l)
			self.diff = ranges(data_frame['Diff %'].to_numpy(), p_l)
			self.vol_oi = ranges(data_frame['Vol/OI'].to_numpy(), p_l)
			self.imp_vol = ranges(data_frame['Implied Volatility'].to_numpy(), p_l)
			self.delta = ranges(data_frame.Delta.to_numpy(), p_l)
			self.gamma = ranges(data_frame.Gamma.to_numpy(), p_l)
			self.vega = ranges(data_frame.Vega.to_numpy(), p_l)
			self.theta = ranges(data_frame.Theta.to_numpy(), p_l)
			self.rho = ranges(data_frame.Rho.to_numpy(), p_l)
			self.time_passed = ranges(data_frame['Time Passed'].to_numpy(), p_l)
		else:
			raise TypeError('Non-DataFrame parameter passed for data_frame when creating report, unable to create report')
#########################################################################################################

	def to_dataframe(self) -> DataFrame:
		'''
		to_dataframe
		----------

		This function will convert the data from this class into dataframes
		'''
		logger.info('Creating numpy arrays from report data points')
		day_of_week = self.day_of_week.to_numpy()
		time_of_day = self.time_of_day.to_numpy()
		days_to_exp = self.days_to_exp.to_numpy()
		diff = self.diff.to_numpy()
		vol_oi = self.vol_oi.to_numpy()
		imp_vol = self.imp_vol.to_numpy()
		delta = self.delta.to_numpy()
		gamma = self.gamma.to_numpy()
		vega = self.vega.to_numpy()
		theta = self.theta.to_numpy()
		rho = self.rho.to_numpy()
		time_passed = self.time_passed.to_numpy()

		data = np.array([day_of_week, time_of_day, days_to_exp, diff, vol_oi, imp_vol,
			delta, gamma, vega, theta, rho, time_passed])

		columns = np.array(['Rating', 'Day of Week', 'Time of Day', 'Days to Exp.', 'Diff %', 'Volume/OI',
			'Implied Volitily', 'Delta', 'Gamma', 'Vega', 'Theta', 'Rho', 'Time Passed'])
		
		logger.info('Creating dataframe from numpy arrays')
		dataframe = DataFrame(data=data.T, columns=columns)
		return dataframe
import os
import logging
from date.day import day
from datetime import datetime
from dotenv import load_dotenv
from watchdog.observers import Observer
from filewatcher.filewatcher import filewatcher
from environment.environment import environment
from util.directory.directory_util import create_directories

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def main(input_file_path, output_file_path, data_file_path):
	logger.info('Opening input file for reading')
	with open(input_file_path, 'r') as input_file:
		logger.info('Opening input file for writing')
		with open(output_file_path, 'w') as output_file:
			logger.info('Reading input file to parse data')
			contents = input_file.readlines()
			entry = ''
			index = 0
			while index<len(contents):
				data = contents[index:(index+45)]
				header = data[0].replace('\n', '').split(' ')

				# Ticker
				ticker = header[0].replace('$', '')

				# Option type
				option_type = 'Call' if header[2] == 'C' else 'Put'

				# Alert date
				alert_date = data[22].replace('\n', '').replace(',', '')
				alert_split = alert_date.split(' ')
				alert_date_time = datetime.strptime(alert_date, '%m/%d/%Y %H:%M')

				# Day of week
				day_of_week = 'DAY OF WEEK'
				try:
					day_of_week = day(alert_date_time.weekday())
				except TypeError as ex:
					logger.warning('TypeError exception caught creating day')
					logger.warning(ex)

				# Expiry
				expiry_date = datetime.fromisoformat(header[1])

				# Days to expiration
				days_to_exp_delta = expiry_date - alert_date_time
				days_to_exp = days_to_exp_delta.days

				# Underlying
				underlying = float(data[16].replace('\n', '').replace('$', ''))

				# Diff %
				diff = 'DIFF'
				strike = float(header[3].replace('$', ''))
				if underlying > strike:
					diff = '%.2f'%(((strike/underlying)-1)*100)
					diff = f'{diff}%'
				else:
					diff = '%.2f'%(((strike-underlying)/underlying)*100)
					diff = f'{diff}%'

				# Volume
				volume = data[28].replace('\n', '')

				# Open interest
				open_interest = data[26].replace('\n', '')

				# Volume/Open Interest
				vol_oi = int(volume)/int(open_interest)

				# Implied volatility
				imp_vol = data[30].replace('\n', '')

				# Delta
				delta = data[32].replace('\n', '')

				# Gamma
				gamma = data[40].replace('\n', '')

				# Vega
				vega = data[38].replace('\n', '')

				# Theta
				theta = data[42].replace('\n', '')

				# Rho
				rho = data[44].replace('\n', '')

				# Ask
				ask = data[20].replace('\n', '').replace('$', '')

				entry = entry + f'{ticker},{option_type},{alert_date},{day_of_week.day},{alert_split[1]},{header[1]},{days_to_exp},{strike},' + \
					f'{underlying},{diff},{volume},{open_interest},{vol_oi},{imp_vol},{delta},{gamma},{vega},{theta},{rho},{ask}\n'
				index = index+46
			logger.info('Writing parsed data to the output file')
			output_file.write(entry)

#########################################################################################################

if __name__ == "__main__":
	env = environment()
	parsed_directory = 'Parsed'
	processed_directory = 'Processed'
	unprocessed_directory = 'Unprocessed'

	if env.data_directory != '':
		directories = [f'{env.data_directory}\\{parsed_directory}', f'{env.data_directory}\\{processed_directory}', f'{env.data_directory}\\{unprocessed_directory}']
		create_directories(directories)
		main(env.input_file, env.output_file, env.data_directory)

		try:
			logger.info(f'Creating filewatcher for {env.data_directory}\\{unprocessed_directory}')
			event_handler = filewatcher()
			observer = Observer()

			logger.info(f'Starting up filewatcher for {env.data_directory}\\{unprocessed_directory}')
			observer.schedule(event_handler, path=f'{env.data_directory}\\{unprocessed_directory}', recursive=False)
			observer.start()

			while True:
				try:
					pass
				except KeyboardInterrupt:
					observer.stop()
		except Exception as ex:
			logger.critical(f'Failed to create filewatcher for {env.data_directory}\\{unprocessed_directory}')
			logger.critical(str(ex))
	else:
		logger.critical(f'Environment variables are not properly defined')
		logger.critical(f'Exiting..')
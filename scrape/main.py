import os
import logging
from dotenv import load_dotenv

#########################################################################################################

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

try:
	load_dotenv()
	INPUT_FILE = os.getenv('INPUT_FILE')
	OUTPUT_FILE = os.getenv('OUTPUT_FILE')
except Exception as ex:
	logger.critical('Failed to retrieve environment variables. Please verify environment variable exists')
	logger.critical(str(ex))
	exit(1)

#########################################################################################################

def main():
    with open(INPUT_FILE, 'r') as input_file:
        with open(OUTPUT_FILE, 'a') as output_file:
            contents = input_file.readlines()
            index = 0
            while index<len(contents):
                data = contents[index:(index+45)]
                header = data[index].split(' ')
                option_type = 'Call' if header == 'C' else 'Put'
                alert_split = data[index+22].split(' ')
                alert = f'{alert_split[0]} {alert_split[1]}'
                entry = f'{data[index], option_type, alert}, DAY OF WEEK, '
                output_file.write(entry)
                index = index+46
            # data = {
            #     'ticker': None,
            #     'option_type': None,
            #     'alert_date': None,
            #     'day_of_week': None,
            #     'time_of_day': None,
            #     'expiry': None,
            #     'days_to_exp': None,
            #     'strike': None,
            #     'underlying': None,
            #     'diff': None,
            #     'volume': None,
            #     'open_interest': None,
            #     'vol_oi': None,
            #     'imp_vol': None,
            #     'delta': None,
            #     'gamma': None,
            #     'vega': None,
            #     'theta': None,
            #     'rho': None,
            #     'ask': None
            # }
#########################################################################################################

if __name__ == "__main__":
	main()
import logging
import requests
from flask import Flask, request
from util.rating.rating import rate_pl
from environment.environment import environment

#########################################################################################################

logging.basicConfig(
    format="%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

env = environment()
app = Flask(__name__)

#########################################################################################################


@app.route("/", methods=["POST"])
def ingest():
    """
    ingest
    ----------

    Any POST requests made to the historical server will be received here.
    """
    logger.info("Received POST request")
    data = request.json

    try:
        logger.info("Rating incoming historical data")
        for key, value in data.items():
            value["rate"] = rate_pl(value["p/l"])
    except Exception as ex:
        message = "An error occurred rating the incoming historical alerts"
        logger.critical(message)
        logger.critical(ex)
        return message, 500

    try:
        logger.info(
            "Sending POST request to DB-Store server with rated historical data"
        )
        response = requests.post(
            f"http://{env.db_store_hostname}:{env.db_store_port}/write_historical",
            json=data,
        )
        logger.info(f"DB-Store Response Status Code: {response.status_code}")
        logger.info(f"DB-Store Response Text: {response.text}")
        return response.text, response.status_code
    except Exception as ex:
        message = "An error occurred sending POST request to the DB-Store server"
        logger.critical(message)
        logger.critical(ex)
        return message, 500


#########################################################################################################

if __name__ == "__main__":
    if env.valid_environment():
        app.run(host=env.historical_server_hostname, port=env.historical_server_port)

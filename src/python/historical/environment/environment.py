import os
import logging
from dotenv import load_dotenv

#########################################################################################################

logging.basicConfig(
    format="%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

#########################################################################################################


class environment:
    """
    environment
    ----------

    This class will contain the environment variables for the historical alerts service:

    - historical_server_hostname

    - historical_server_port

    - db_store_hostname

    - db_store_port
    """

    def __init__(self) -> None:
        """
        __init__
        ----------

        Creates a environment object

        If an exception is raised retrieving environment variables, all

        elements of the environment class will be set to None
        """
        logger.info("Retrieving environment variables")
        try:
            load_dotenv()
            self.historical_server_hostname = os.getenv(
                "HISTORICAL_SERVER_HOSTNAME", None
            )
            self.historical_server_port = os.getenv("HISTORICAL_SERVER_PORT", None)
            self.db_store_hostname = os.getenv("DB_STORE_HOSTNAME", None)
            self.db_store_port = os.getenv("DB_STORE_PORT", None)
        except Exception as ex:
            logger.critical(
                "Failed to retrieve environment variables. Please verify all environment variable exists"
            )
            logger.critical(str(ex))
            self.historical_server_hostname = None
            self.historical_server_port = None
            self.db_store_hostname = None
            self.db_store_port = None

    def valid_environment(self) -> bool:
        """
        valid_environment
        ----------

        Method to utilize to determine if all environment variables are properly defined
        """
        valid = True
        if self.historical_server_hostname is None:
            logger.critical(
                "HISTORICAL_SERVER_HOSTNAME environment variable is invalid"
            )
            valid = False
        if self.historical_server_port is None:
            logger.critical("HISTORICAL_SERVER_PORT environment variable is invalid")
            valid = False
        if self.db_store_hostname is None:
            logger.critical("DB_STORE_HOSTNAME environment variable is invalid")
            valid = False
        if self.db_store_port is None:
            logger.critical("DB_STORE_PORT environment variable is invalid")
            valid = False
        if valid:
            logger.info(
                f"Historical Server Hostname: {self.historical_server_hostname}"
            )
            logger.info(f"Historical Server Port: {self.historical_server_port}")
            logger.info(f"DB-Store Server Hostname: {self.db_store_hostname}")
            logger.info(f"DB-Store Server Port: {self.db_store_port}")
        return valid

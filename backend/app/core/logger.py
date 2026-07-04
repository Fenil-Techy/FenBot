import logging
import sys


def setup_logger():
    logging.basicConfig(
        level=logging.DEBUG,  # Change to DEBUG while developing
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],

    )
    logging.getLogger("openai").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING) 
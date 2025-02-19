import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# API Keys (Use a .env file to store sensitive data)
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Default Stock Data Fetch Period
DEFAULT_PERIOD = "6mo"

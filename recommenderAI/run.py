#!/usr/bin/env python3
"""
Drama Recommendation API 启动脚本
"""

import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    
    if not os.getenv("MONGODB_URI"):
        print("Warning: MONGODB_URI environment variable is not set")
        print("Please set MONGODB_URI in the .env file")
    
    # Run the server
    uvicorn.run(
        "app:app",
        host="localhost",
        port=8000,
        reload=True,
        log_level="info"
    )
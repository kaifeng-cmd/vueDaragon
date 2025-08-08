import os
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pymongo import MongoClient
import pandas as pd

load_dotenv()

app = FastAPI()

# MongoDB setup
mongo_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)
db = client.get_default_database()
dramas_collection = db['dramas']

# Load similarity matrix (indexed by drama Name)
similarity_df = pd.read_pickle('similarity_matrix.pkl')
drama_names = similarity_df.index.tolist()

@app.get("/recommend")
async def recommend(name: str, page: int = 1):
    """
    Returns paginated similar dramas based on cosine similarity.
    Input: 
        - Drama name (case-sensitive)
        - Page number (default=1, each page contains 10 recommendations)
    Output: 
        - Full drama details from MongoDB
        - Pagination metadata
    """
    # Validate input drama exists in index
    if name not in drama_names:
        raise HTTPException(
            status_code=404,
            detail=f"Drama '{name}' not found in similarity matrix. Available names: {drama_names[:3]}..."
        )
    
    # Get similarity scores and exclude self (first item)
    sim_scores = similarity_df[name].sort_values(ascending=False)
    
    # Pagination logic (10 items per page)
    items_per_page = 10
    start_idx = (page - 1) * items_per_page + 1  # +1 to skip the input drama itself
    end_idx = start_idx + items_per_page
    
    # Handle invalid page numbers
    if start_idx > len(sim_scores):
        raise HTTPException(
            status_code=404,
            detail=f"Page {page} exceeds available recommendations. Total possible pages: {len(sim_scores) // items_per_page}"
        )
    
    # Get paginated drama names
    top_drama_names = sim_scores.index[start_idx:end_idx].tolist()
    
    # Fetch full drama details from MongoDB
    recommendations = []
    for drama_name in top_drama_names:
        drama = dramas_collection.find_one(
            {"Name": drama_name},
            {"_id": 0, "drama_key": 0}  # Exclude MongoDB ID
        )
        if drama:
            recommendations.append(drama)
    
    return {
        "input_drama": name,
        "page": page,
        "items_per_page": items_per_page,
        "total_items": len(sim_scores) - 1,  # -1 to exclude self
        "total_pages": (len(sim_scores) - 1 + items_per_page - 1) // items_per_page,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

# uvicorn main:app --reload

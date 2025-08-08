import pandas as pd
import numpy as np
from typing import List, Dict, Any
from fastapi import HTTPException
from config.database import db

class RecommendationService:
    def __init__(self):
        self.similarity_df = None
        self.drama_names = None
        self._load_similarity_matrix()
    
    def _load_similarity_matrix(self):
        """Load similarity matrix from pickle file"""
        try:
            self.similarity_df = pd.read_pickle('similarity_matrix.pkl')
            self.drama_names = self.similarity_df.index.tolist()
        except Exception as e:
            raise Exception(f"Failed to load similarity matrix: {e}")
    
    def get_drama_recommendations(self, name: str, page: int = 1) -> Dict[str, Any]:
        """Get drama recommendations based on drama name"""
        items_per_page = 10  # Fixed items per page
        
        if name not in self.drama_names:
            raise HTTPException(
                status_code=404,
                detail=f"Drama '{name}' not found in similarity matrix."
            )
        
        sim_scores = self.similarity_df[name].sort_values(ascending=False)
        start_idx = (page - 1) * items_per_page + 1
        end_idx = start_idx + items_per_page
        
        if start_idx > len(sim_scores):
            raise HTTPException(
                status_code=404,
                detail=f"Page {page} exceeds available recommendations."
            )
        
        top_drama_names = sim_scores.index[start_idx:end_idx].tolist()
        recommendations = self._fetch_drama_details(top_drama_names)
        
        return {
            "input_drama": name,
            "page": page,
            "items_per_page": items_per_page,
            "total_items": len(sim_scores) - 1,
            "total_pages": (len(sim_scores) - 1 + items_per_page - 1) // items_per_page,
            "recommendations": recommendations
        }
    
    def get_user_recommendations(self, watch_history: List[Dict[str, Any]], page: int = 1, items_per_page: int = 10) -> Dict[str, Any]:
        """Get drama recommendations based on user's watch history using mean pooling"""
        if not watch_history:
            raise HTTPException(status_code=400, detail="Watch history cannot be empty")
        
        # Extract drama names and ratings
        drama_ratings = {}
        for item in watch_history:
            drama_name = item.get('dramaName')
            rating = item.get('rating', 0)
            if drama_name and drama_name in self.drama_names:
                drama_ratings[drama_name] = rating
        
        if not drama_ratings:
            raise HTTPException(status_code=400, detail="No valid dramas found in watch history")
        
        # Calculate weighted mean pooling
        drama_names = list(drama_ratings.keys())
        ratings = list(drama_ratings.values())
        
        similarity_vectors = []
        for drama_name in drama_names:
            if drama_name in self.similarity_df.columns:
                similarity_vectors.append(self.similarity_df[drama_name].values)
        
        if not similarity_vectors:
            raise HTTPException(status_code=400, detail="No similarity data found")
        
        similarity_vectors = np.array(similarity_vectors)
        ratings = np.array(ratings)
        
        # Weighted mean pooling
        weighted_mean_vector = np.average(similarity_vectors, axis=0, weights=ratings)
        mean_vector_norm = np.linalg.norm(weighted_mean_vector)
        
        if mean_vector_norm == 0:
            raise HTTPException(status_code=400, detail="Cannot compute recommendations")
        
        weighted_mean_vector = weighted_mean_vector / mean_vector_norm
        
        # Calculate similarities with all dramas
        similarities = {}
        for i, drama_name in enumerate(self.drama_names):
            if drama_name not in drama_ratings:  # Exclude watched dramas
                drama_vector = self.similarity_df[drama_name].values
                drama_vector_norm = np.linalg.norm(drama_vector)
                if drama_vector_norm > 0:
                    drama_vector = drama_vector / drama_vector_norm
                    similarity = np.dot(weighted_mean_vector, drama_vector)
                    similarities[drama_name] = similarity
        
        # Sort and paginate
        sorted_dramas = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
        start_idx = (page - 1) * items_per_page
        end_idx = start_idx + items_per_page
        
        if start_idx >= len(sorted_dramas):
            raise HTTPException(status_code=404, detail=f"Page {page} exceeds available recommendations")
        
        top_drama_names = [drama_name for drama_name, _ in sorted_dramas[start_idx:end_idx]]
        recommendations = self._fetch_drama_details(top_drama_names)
        
        return {
            "input_dramas": drama_names,
            "page": page,
            "items_per_page": items_per_page,
            "total_items": len(sorted_dramas),
            "total_pages": (len(sorted_dramas) + items_per_page - 1) // items_per_page,
            "recommendations": recommendations
        }
    
    def _fetch_drama_details(self, drama_names: List[str]) -> List[Dict[str, Any]]:
        """Fetch drama details from MongoDB"""
        recommendations = []
        for drama_name in drama_names:
            drama = db.dramas_collection.find_one(
                {"Name": drama_name},
                {"_id": 0, "drama_key": 0}
            )
            if drama:
                recommendations.append(drama)
        return recommendations

recommendation_service = RecommendationService() 
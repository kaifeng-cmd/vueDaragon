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
    
    def get_user_recommendations(self, drama_names: List[str], page: int = 1) -> Dict[str, Any]:
        """Get drama recommendations based on user's watched drama names using mean pooling (no ratings)."""
        items_per_page = 10  # Fixed items per page

        if not drama_names:
            raise HTTPException(status_code=400, detail="Drama names cannot be empty")

        # Filter drama names to those present in the similarity matrix index
        valid_dramas = [name for name in drama_names if name in self.drama_names]
        if not valid_dramas:
            raise HTTPException(status_code=400, detail="No valid dramas found in input list")

        # Collect vectors for valid dramas as numeric numpy arrays
        similarity_vectors = []
        for drama_name in valid_dramas:
            if drama_name in self.similarity_df.columns:
                # Ensure 1-D numeric vector by handling potential duplicate columns
                series = self.similarity_df[drama_name]
                if isinstance(series, pd.DataFrame):
                    series = series.iloc[:, 0]  # Take the first column if duplicates exist
                
                col_values = series.to_numpy(dtype=float)
                # Replace NaNs or infs with zeros
                col_values = np.nan_to_num(col_values, nan=0.0, posinf=0.0, neginf=0.0)
                similarity_vectors.append(col_values)

        if not similarity_vectors:
            raise HTTPException(status_code=400, detail="No similarity data found for provided dramas")

        # Mean pooling without ratings
        try:
            similarity_matrix = np.stack(similarity_vectors, axis=0)  # Shape: (num_watched, num_dramas)
        except Exception as stack_error:
            raise HTTPException(status_code=500, detail=f"Failed to stack vectors: {stack_error}")

        mean_vector = np.mean(similarity_matrix, axis=0)

        # Normalize the mean vector
        mean_vector_norm = np.linalg.norm(mean_vector)
        if mean_vector_norm == 0:
            raise HTTPException(status_code=400, detail="Cannot compute recommendations from zero vector")
        mean_vector = mean_vector / mean_vector_norm

        # Compute cosine similarity with all dramas, excluding those already watched
        similarities = {}
        for drama_name in self.drama_names:
            if drama_name not in valid_dramas:
                # Ensure 1-D numeric vector by handling potential duplicate columns
                series = self.similarity_df[drama_name]
                if isinstance(series, pd.DataFrame):
                    series = series.iloc[:, 0]  # Take the first column if duplicates exist

                drama_vector = series.to_numpy(dtype=float)
                drama_vector = np.nan_to_num(drama_vector, nan=0.0, posinf=0.0, neginf=0.0)
                drama_vector_norm = np.linalg.norm(drama_vector)
                
                if drama_vector_norm > 0:
                    drama_vector = drama_vector / drama_vector_norm
                    similarity = np.dot(mean_vector, drama_vector)
                    similarities[drama_name] = similarity

        # Sort by similarity and paginate
        sorted_dramas = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
        start_idx = (page - 1) * items_per_page
        end_idx = start_idx + items_per_page

        if start_idx >= len(sorted_dramas):
            raise HTTPException(status_code=404, detail=f"Page {page} exceeds available recommendations")

        top_drama_names = [drama_name for drama_name, _ in sorted_dramas[start_idx:end_idx]]
        recommendations = self._fetch_drama_details(top_drama_names)

        return {
            "input_dramas": valid_dramas,
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

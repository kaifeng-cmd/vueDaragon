from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional
from services.recommendation_service import recommendation_service
from config.database import db
from models.schemas import (
    UserRecommendationRequest,
    DramaRecommendationResponse,
    UserRecommendationResponse,
    AvailableDramasResponse
)

router = APIRouter()

@router.get("/recommend/drama")
async def recommend_by_drama(
    name: str = Query(..., description="Drama name to get recommendations for"),
    page: int = Query(1, ge=1, description="Page number")
):
    """
    Get drama recommendations based on a specific drama name.
    
    Returns top similar dramas using cosine similarity from pre-computed similarity matrix.
    Fixed 10 items per page.
    """
    try:
        # Ensure database connection
        if not db.client:
            db.connect()
        
        result = recommendation_service.get_drama_recommendations(name, page)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/recommend/user")
async def recommend_by_user_history(request: UserRecommendationRequest):
    """
    Get drama recommendations based on user's watch history.
    
    Uses mean pooling of similarity vectors weighted by user ratings to generate personalized recommendations.
    """
    try:
        # Ensure database connection
        if not db.client:
            db.connect()
        
        # Use drama names directly for mean pooling recommendation
        result = recommendation_service.get_user_recommendations(
            request.drama_names,
            request.page
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/dramas/available")
async def get_available_dramas():
    """
    Get list of all available drama names in the similarity matrix.
    Useful for validation or dropdown lists.
    """
    try:
        return {
            "total_dramas": len(recommendation_service.drama_names),
            "drama_names": recommendation_service.drama_names[:100],  # Return first 100 for preview
            "message": f"Total {len(recommendation_service.drama_names)} dramas available"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class WatchHistoryItem(BaseModel):
    dramaName: str = Field(..., description="Name of the drama")
    rating: float = Field(..., ge=0, le=5, description="User rating (0-5)")

class UserRecommendationRequest(BaseModel):
    watch_history: List[WatchHistoryItem] = Field(..., description="User's watch history with ratings")
    page: Optional[int] = Field(1, ge=1, description="Page number for pagination")
    items_per_page: Optional[int] = Field(10, ge=1, le=50, description="Number of items per page")

class DramaRecommendation(BaseModel):
    Name: str
    Genre: Optional[str] = None
    Year: Optional[int] = None
    Rating: Optional[float] = None
    Episodes: Optional[int] = None
    Duration: Optional[str] = None
    Synopsis: Optional[str] = None
    Cast: Optional[str] = None
    Director: Optional[str] = None
    Network: Optional[str] = None

class DramaRecommendationResponse(BaseModel):
    input_drama: str
    page: int
    items_per_page: int
    total_items: int
    total_pages: int
    recommendations: List[DramaRecommendation]

class UserRecommendationResponse(BaseModel):
    input_dramas: List[str]
    page: int
    items_per_page: int
    total_items: int
    total_pages: int
    recommendations: List[DramaRecommendation]



class AvailableDramasResponse(BaseModel):
    total_dramas: int
    drama_names: List[str]
    message: str

class ErrorResponse(BaseModel):
    detail: str 
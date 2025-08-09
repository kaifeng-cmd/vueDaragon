from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class WatchHistoryItem(BaseModel):
    dramaName: str = Field(..., description="Name of the drama")
    rating: float = Field(..., ge=0, le=5, description="User rating (0-5)")

class UserRecommendationRequest(BaseModel):
    drama_names: List[str] = Field(..., description="List of drama names the user has watched")
    page: Optional[int] = Field(1, ge=1, description="Page number for pagination")

class DramaRecommendation(BaseModel):
    Name: str
    Year: Optional[int] = None
    Genre: Optional[str] = None
    main_cast: Optional[str] = Field(None, alias="Main Cast")
    sinopsis: Optional[str] = Field(None, alias="Sinopsis")
    Score: Optional[float] = None
    content_rating: Optional[str] = Field(None, alias="Content Rating")
    Tags: Optional[str] = None
    Network: Optional[str] = None
    img_url: Optional[str] = Field(None, alias="img url")
    Episode: Optional[str] = None

    class Config:
        from_attributes = True
        validate_by_name = True

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

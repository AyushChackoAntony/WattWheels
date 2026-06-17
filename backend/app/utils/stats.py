from app import mongo
from bson import ObjectId

def update_aggregate_rating(target_id, target_type):
    """Recalculates avg rating for a vehicle or user whenever a review is added."""
    pipeline = [
        {"$match": {"target_id": target_id, "target_type": target_type}},
        {"$group": {
            "_id": "$target_id",
            "averageRating": {"$avg": "$rating"},
            "reviewCount": {"$sum": 1}
        }}
    ]
    
    result = list(mongo.db.reviews.aggregate(pipeline))
    
    if result:
        stats = result[0]
        update_data = {
            "rating": round(stats['averageRating'], 1),
            "review_count": stats['reviewCount']
        }
        
        if target_type == 'vehicle':
            mongo.db.vehicles.update_one({"_id": ObjectId(target_id)}, {"$set": update_data})
        else:
            mongo.db.users.update_one({"_id": ObjectId(target_id)}, {"$set": {"user_rating": update_data['rating']}})